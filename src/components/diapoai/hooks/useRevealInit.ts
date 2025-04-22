
import { useEffect, useState, RefObject } from "react";
import { ThemeColors } from "../types/ThemeColors";
import { initReveal } from "./reveal/initManager";

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

  useEffect(() => {
    if (containerRef.current) {
      const newDeck = initReveal({
        container: containerRef.current,
        slidesHtml: slidesHtml,
        colors: colors,
        transition: transition,
      });

      setDeck(newDeck);

      return () => {
        if (newDeck && typeof newDeck.destroy === 'function') {
          try {
            newDeck.destroy();
          } catch (error) {
            console.error('Error destroying Reveal.js instance:', error);
          }
        }
      };
    }
  }, [containerRef, slidesHtml, colors, transition]);

  return { deck };
};
