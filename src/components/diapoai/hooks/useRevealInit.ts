
import { useEffect, useState, useRef, RefObject } from "react";
import { ThemeColors } from "../types/ThemeColors";
import { initReveal, safeDestroyReveal } from "./reveal/initManager";

interface UseRevealInitProps {
  containerRef: RefObject<HTMLDivElement>;
  slidesHtml: string;
  colors: ThemeColors;
  transition: string;
}

export const useRevealInit = ({
  containerRef,
  slidesHtml,
  colors,
  transition
}: UseRevealInitProps) => {
  const [deck, setDeck] = useState<any>(null);
  const initAttemptedRef = useRef(false);
  
  useEffect(() => {
    // Clean up previous instance
    if (deck) {
      safeDestroyReveal(deck);
      setDeck(null);
    }
    
    if (containerRef.current && slidesHtml) {
      // Small delay to ensure the HTML is properly rendered before initialization
      const timer = setTimeout(() => {
        try {
          console.log("Initializing Reveal.js");
          const newDeck = initReveal({
            container: containerRef.current,
            slidesHtml: slidesHtml,
            colors: colors,
            transition: transition,
          });
          
          setDeck(newDeck);
          initAttemptedRef.current = true;
        } catch (error) {
          console.error("Error in useRevealInit:", error);
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [containerRef, slidesHtml, colors, transition]);
  
  // Re-attempt initialization if it failed the first time
  useEffect(() => {
    if (containerRef.current && slidesHtml && !deck && initAttemptedRef.current) {
      // Try again after a longer delay
      const retryTimer = setTimeout(() => {
        try {
          console.log("Retrying Reveal.js initialization");
          const newDeck = initReveal({
            container: containerRef.current,
            slidesHtml: slidesHtml,
            colors: colors,
            transition: transition,
          });
          
          setDeck(newDeck);
        } catch (error) {
          console.error("Error in useRevealInit retry:", error);
        }
      }, 500);
      
      return () => {
        clearTimeout(retryTimer);
      };
    }
    
    // Clean up on unmount
    return () => {
      if (deck) {
        safeDestroyReveal(deck);
      }
    };
  }, [containerRef, slidesHtml, colors, transition, deck]);

  return { deck };
};
