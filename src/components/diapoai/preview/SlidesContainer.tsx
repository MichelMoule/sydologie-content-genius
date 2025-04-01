
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
          // Process the HTML to ensure it has proper slide structure
          let processedHtml = slidesHtml;
          
          // If no section tags exist, wrap content in sections
          if (!processedHtml.includes('<section')) {
            processedHtml = `<section>${processedHtml}</section>`;
          }
          
          // Update the slides container with processed HTML
          slidesContainer.innerHTML = processedHtml;
          
          // Add custom styles to ensure content stays together on slides
          // and to maximize text density
          const style = document.createElement('style');
          style.textContent = `
            .reveal .slides section {
              height: auto !important;
              min-height: 450px;
              padding: 20px !important;
              display: flex !important;
              flex-direction: column !important;
              overflow-y: visible !important;
              position: relative !important;
            }
            
            .reveal .slides h1,
            .reveal .slides h2,
            .reveal .slides h3 {
              margin-bottom: 0.2em !important;
              margin-top: 0.1em !important;
              line-height: 1.2 !important;
            }
            
            .reveal .slides h1 + *,
            .reveal .slides h2 + *,
            .reveal .slides h3 + * {
              margin-top: 0 !important;
            }
            
            .reveal .slides p {
              margin-bottom: 0.3em !important;
              margin-top: 0.1em !important;
              line-height: 1.3 !important;
            }
            
            .reveal .slides ul, 
            .reveal .slides ol {
              display: block !important;
              margin-bottom: 0.3em !important;
              margin-top: 0.1em !important;
              padding-left: 1.5em !important;
            }
            
            .reveal .slides li {
              margin-bottom: 0.1em !important;
              line-height: 1.3 !important;
            }
            
            .reveal .slides section > * {
              margin-left: 0 !important;
              margin-right: 0 !important;
              width: 100% !important;
            }
            
            .reveal .slides blockquote {
              margin: 0.3em 0 !important;
              padding: 0.5em !important;
            }
            
            /* Force content to remain in the same slide */
            .reveal .present {
              display: flex !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              justify-content: flex-start !important;
              text-align: left !important;
            }
            
            /* Ensure content wrapping for better text density */
            .reveal .slides section * {
              max-width: 100% !important;
              word-wrap: break-word !important;
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
