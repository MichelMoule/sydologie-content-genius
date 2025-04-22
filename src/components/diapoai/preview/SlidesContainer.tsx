
import { forwardRef } from "react";
import { useSlideStructure } from "../hooks/useSlideStructure";
import { SlideStyles } from "./SlideStyles";
import { LoadingSlide } from "./LoadingSlide";

export const SlidesContainer = forwardRef<HTMLDivElement, { slidesHtml?: string }>(
  ({ slidesHtml }, ref) => {
    const { stylesAddedRef } = useSlideStructure(ref as React.RefObject<HTMLDivElement>, slidesHtml);
    
    return (
      <div className="relative w-full overflow-hidden">
        <div 
          ref={ref} 
          className="bg-white reveal border rounded-lg overflow-hidden shadow-lg"
          style={{ height: '600px', width: '100%', position: 'relative' }}
        >
          <SlideStyles 
            containerRef={ref as React.RefObject<HTMLDivElement>} 
            stylesAddedRef={stylesAddedRef}
          />
          <div className="slides" style={{ overflow: 'visible' }}>
            <LoadingSlide />
          </div>
        </div>
      </div>
    );
  }
);

SlidesContainer.displayName = "SlidesContainer";
