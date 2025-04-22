
import { forwardRef, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SlidesContainer = forwardRef<HTMLDivElement, { slidesHtml?: string }>(
  ({ slidesHtml }, ref) => {
    const lastHtmlRef = useRef<string | null>(null);
    const stylesAddedRef = useRef(false);
    
    // Injecter le HTML des slides seulement quand il change
    useEffect(() => {
      const container = ref as React.RefObject<HTMLDivElement>;
      if (container.current && slidesHtml && slidesHtml !== lastHtmlRef.current) {
        lastHtmlRef.current = slidesHtml;
        
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
          if (!stylesAddedRef.current) {
            stylesAddedRef.current = true;
            const style = document.createElement('style');
            style.textContent = `
              .reveal .slides section {
                height: auto !important;
                min-height: 440px;
                padding: 15px !important;
                display: flex !important;
                flex-direction: column !important;
                overflow-y: visible !important;
                position: relative !important;
              }
              
              .reveal .slides h1,
              .reveal .slides h2,
              .reveal .slides h3 {
                margin-bottom: 0.15em !important;
                margin-top: 0.05em !important;
                line-height: 1.1 !important;
              }
              
              .reveal .slides h1 + *,
              .reveal .slides h2 + *,
              .reveal .slides h3 + * {
                margin-top: 0 !important;
              }
              
              .reveal .slides p {
                margin-bottom: 0.25em !important;
                margin-top: 0.05em !important;
                line-height: 1.25 !important;
                font-size: 0.95em !important;
              }
              
              .reveal .slides ul, 
              .reveal .slides ol {
                display: block !important;
                margin-bottom: 0.25em !important;
                margin-top: 0.05em !important;
                padding-left: 1.2em !important;
              }
              
              .reveal .slides li {
                margin-bottom: 0.05em !important;
                line-height: 1.2 !important;
                font-size: 0.95em !important;
              }
              
              .reveal .slides section > * {
                margin-left: 0 !important;
                margin-right: 0 !important;
                width: 100% !important;
              }
              
              .reveal .slides blockquote {
                margin: 0.2em 0 !important;
                padding: 0.4em !important;
              }
              
              /* Force content to remain in the same slide */
              .reveal .present {
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-start !important;
                justify-content: flex-start !important;
                text-align: left !important;
                page-break-inside: avoid !important;
                overflow: visible !important;
              }
              
              /* Ensure all content is visible - critical fix */
              .reveal .slides {
                height: auto !important;
                overflow: visible !important;
                max-height: none !important;
              }
              
              /* Ensure content wrapping for better text density */
              .reveal .slides section * {
                max-width: 100% !important;
                word-wrap: break-word !important;
              }
              
              /* Empêcher la séparation entre titres et contenus */
              .reveal h1, .reveal h2, .reveal h3 {
                page-break-after: avoid !important;
              }
              
              /* Force les éléments à rester avec leur contenu */
              .reveal h1 + *, .reveal h2 + *, .reveal h3 + * {
                page-break-before: avoid !important;
              }
              
              .reveal p, .reveal li {
                page-break-inside: avoid !important;
                font-size: 0.92em !important;
                max-height: none !important;
                overflow: visible !important;
              }
              
              /* Optimisation pour plus de texte */
              .reveal .slides {
                font-size: 18px !important;
              }
              
              /* Ensure slide contents don't overflow */
              .reveal .slides section > * {
                overflow: visible !important;
              }
              
              /* Disable any slide transitions that might cause content to be hidden */
              .reveal .slides section {
                opacity: 1 !important;
                visibility: visible !important;
              }
              
              /* Fix for slide content overflow */
              .reveal .slide-background {
                overflow: visible !important;
              }
            `;
            container.current.appendChild(style);
          }
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
          <div className="slides" style={{ overflow: 'visible' }}>
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
