
import { useEffect, useRef } from 'react';
import { normalizeSlideStructure } from "./reveal/slideStructureManager";

export const useSlideStructure = (
  containerRef: React.RefObject<HTMLDivElement>,
  slidesHtml?: string
) => {
  const lastHtmlRef = useRef<string | null>(null);
  const stylesAddedRef = useRef(false);

  useEffect(() => {
    if (containerRef.current && slidesHtml && slidesHtml !== lastHtmlRef.current) {
      lastHtmlRef.current = slidesHtml;
      console.log("Setting slides HTML content");
      
      const slidesContainer = containerRef.current.querySelector('.slides');
      if (slidesContainer) {
        slidesContainer.innerHTML = slidesHtml;
        normalizeSlideStructure(slidesContainer);
        console.log("Slides HTML updated");
      }
    }
  }, [containerRef, slidesHtml]);

  return { stylesAddedRef };
};
