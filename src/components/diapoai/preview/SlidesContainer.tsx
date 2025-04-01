
import { forwardRef, useEffect } from "react";

export const SlidesContainer = forwardRef<HTMLDivElement, { slidesHtml?: string }>(
  ({ slidesHtml }, ref) => {
    // Injecter le HTML des slides lorsqu'il change
    useEffect(() => {
      const container = ref as React.RefObject<HTMLDivElement>;
      if (container.current && slidesHtml) {
        const slidesContainer = container.current.querySelector('.slides');
        if (slidesContainer) {
          slidesContainer.innerHTML = slidesHtml;
        }
      }
    }, [slidesHtml, ref]);

    return (
      <div 
        ref={ref} 
        className="bg-white reveal border rounded-lg overflow-hidden shadow-lg"
        style={{ height: '700px', width: '100%', position: 'relative' }}
      >
        <div className="slides">
          <section>
            <h2>Chargement du diaporama...</h2>
            <p>La prévisualisation apparaîtra dans quelques instants.</p>
          </section>
        </div>
      </div>
    );
  }
);

SlidesContainer.displayName = "SlidesContainer";
