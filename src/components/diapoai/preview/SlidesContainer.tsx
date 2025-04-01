
import { forwardRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SlidesContainer = forwardRef<HTMLDivElement, { slidesHtml?: string }>(
  ({ slidesHtml }, ref) => {
    // Injecter le HTML des slides lorsqu'il change
    useEffect(() => {
      const container = ref as React.RefObject<HTMLDivElement>;
      if (container.current && slidesHtml) {
        const slidesContainer = container.current.querySelector('.slides');
        if (slidesContainer) {
          slidesContainer.innerHTML = slidesHtml;
          
          // Add custom styles to ensure content stays together
          const style = document.createElement('style');
          style.textContent = `
            .reveal .slides section {
              height: auto !important;
              min-height: 500px;
              padding: 20px !important;
            }
            .reveal .slides h1 + p,
            .reveal .slides h2 + p,
            .reveal .slides h3 + p {
              margin-top: 0.2em !important;
            }
            .reveal .slides h1 + ul,
            .reveal .slides h2 + ul,
            .reveal .slides h3 + ul,
            .reveal .slides h1 + ol,
            .reveal .slides h2 + ol,
            .reveal .slides h3 + ol {
              margin-top: 0.2em !important;
            }
            .reveal .slides p {
              margin-bottom: 0.8em !important;
            }
            .reveal .slides ul, 
            .reveal .slides ol {
              display: block !important;
              margin-bottom: 0.8em !important;
            }
          `;
          container.current.appendChild(style);
        }
      }
    }, [slidesHtml, ref]);

    return (
      <div className="relative w-full overflow-hidden">
        <div 
          ref={ref} 
          className="bg-white reveal border rounded-lg overflow-hidden shadow-lg"
          style={{ height: '600px', width: '100%', position: 'relative' }}
        >
          <div className="slides">
            <section>
              <h2>Chargement du diaporama...</h2>
              <p>La prévisualisation apparaîtra dans quelques instants.</p>
            </section>
          </div>
        </div>
      </div>
    );
  }
);

SlidesContainer.displayName = "SlidesContainer";
