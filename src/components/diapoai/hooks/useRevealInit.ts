import { useEffect, useState, RefObject } from "react";
import { ThemeColors } from "../types/ThemeColors";
import { initReveal } from "./reveal/initManager";

interface UseRevealInitProps {
  containerRef: RefObject<HTMLDivElement>;
  slidesHtml: string;
  colors: ThemeColors;
  transition: string;
}

export const useRevealInit = (
  containerRef: RefObject<HTMLDivElement>,
  slidesHtml: string,
  colors: ThemeColors,
  transition: string
) => {
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
        newDeck?.destroy();
      };
    }
  }, [containerRef, slidesHtml, colors, transition]);

  return { deck };
};
