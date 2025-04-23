
import { useEffect, useRef } from 'react';
import { normalizeSlideStructure, structureSlidesByOutline } from "./reveal/slideStructureManager";
import { OutlineSection } from '../types';

export const useSlideStructure = (
  containerRef: React.RefObject<HTMLDivElement>,
  slidesHtml?: string,
  outline?: OutlineSection[] | null
) => {
  const lastHtmlRef = useRef<string | null>(null);
  const stylesAddedRef = useRef(false);
  const contentProcessedRef = useRef(false);

  useEffect(() => {
    if (containerRef.current && slidesHtml && slidesHtml !== lastHtmlRef.current) {
      lastHtmlRef.current = slidesHtml;
      contentProcessedRef.current = false;
      console.log("Processing slides HTML content");
      
      // Process the HTML content based on the outline if available
      let processedHtml = slidesHtml;
      if (outline && outline.length > 0) {
        console.log("Structuring slides by outline", outline);
        processedHtml = structureSlidesByOutline(slidesHtml, outline);
      }
      
      const slidesContainer = containerRef.current.querySelector('.slides');
      if (slidesContainer) {
        slidesContainer.innerHTML = processedHtml;
        normalizeSlideStructure(slidesContainer);
        contentProcessedRef.current = true;
        console.log("Slides HTML updated and normalized");
      }
    }
  }, [containerRef, slidesHtml, outline]);

  return { stylesAddedRef, contentProcessedRef };
};
