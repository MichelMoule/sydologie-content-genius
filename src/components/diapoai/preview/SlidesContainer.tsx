
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
          
          // Check if sections exist and ensure they're proper slides
          const sections = slidesContainer.querySelectorAll('section');
          if (sections.length === 0) {
            // If no sections, wrap content in a section
            slidesContainer.innerHTML = `<section>${slidesHtml}</section>`;
          } else {
            // Ensure each section is a direct child of slides
            sections.forEach(section => {
              if (section.parentElement !== slidesContainer) {
                slidesContainer.appendChild(section.cloneNode(true));
                section.remove();
              }
            });
          }
          
          // Add custom styles to ensure content stays together
          const style = document.createElement('style');
          style.textContent = `
            .reveal .slides section {
              height: auto !important;
              min-height: 500px;
              padding: 20px !important;
              display: flex !important;
              flex-direction: column !important;
            }
            .reveal .slides h1,
            .reveal .slides h2,
            .reveal .slides h3 {
              margin-bottom: 0.3em !important;
            }
            .reveal .slides h1 + p,
            .reveal .slides h2 + p,
            .reveal .slides h3 + p {
              margin-top: 0 !important;
            }
            .reveal .slides h1 + ul,
            .reveal .slides h2 + ul,
            .reveal .slides h3 + ul,
            .reveal .slides h1 + ol,
            .reveal .slides h2 + ol,
            .reveal .slides h3 + ol {
              margin-top: 0 !important;
            }
            .reveal .slides p {
              margin-bottom: 0.5em !important;
            }
            .reveal .slides ul, 
            .reveal .slides ol {
              display: block !important;
              margin-bottom: 0.5em !important;
            }
            .reveal .slides section > * {
              margin-left: 0 !important;
              margin-right: 0 !important;
              width: 100% !important;
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
