import { forwardRef, useEffect, useRef } from "react";

export const SlidesContainer = forwardRef<HTMLDivElement, { slidesHtml?: string }>(
  ({ slidesHtml }, ref) => {
    const lastHtmlRef = useRef<string | null>(null);
    const stylesAddedRef = useRef(false);
    
    // Injecter le HTML des slides seulement quand il change
    useEffect(() => {
      const container = ref as React.RefObject<HTMLDivElement>;
      if (container.current && slidesHtml && slidesHtml !== lastHtmlRef.current) {
        lastHtmlRef.current = slidesHtml;
        console.log("Setting slides HTML content");
        
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
          console.log("Slides HTML updated");
          
          // Add custom styles to ensure content stays together on slides
          if (!stylesAddedRef.current) {
            stylesAddedRef.current = true;
            const style = document.createElement('style');
            style.textContent = `
              .reveal .slides section {
                height: auto !important;
                min-height: 450px;
                padding: 15px !important;
                display: flex !important;
                flex-direction: column !important;
                overflow-y: visible !important;
                position: relative !important;
              }
              
              .reveal .slides h1,
              .reveal .slides h2,
              .reveal .slides h3 {
                margin-bottom: 0.3em !important;
                margin-top: 0.1em !important;
                line-height: 1.2 !important;
              }
              
              .reveal .slides h1 + *,
              .reveal .slides h2 + *,
              .reveal .slides h3 + * {
                margin-top: 0 !important;
              }
              
              .reveal .slides p {
                margin-bottom: 0.4em !important;
                margin-top: 0.1em !important;
                line-height: 1.3 !important;
                font-size: 1em !important;
                opacity: 1 !important;
                visibility: visible !important;
              }
              
              .reveal .slides ul, 
              .reveal .slides ol {
                display: block !important;
                margin-bottom: 0.4em !important;
                margin-top: 0.2em !important;
                padding-left: 1.3em !important;
              }
              
              .reveal .slides li {
                margin-bottom: 0.1em !important;
                line-height: 1.3 !important;
                font-size: 0.98em !important;
                opacity: 1 !important;
                visibility: visible !important;
              }
              
              .reveal .slides section > * {
                margin-left: 0 !important;
                margin-right: 0 !important;
                width: 100% !important;
                opacity: 1 !important;
                visibility: visible !important;
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
                font-size: 0.95em !important;
                max-height: none !important;
                overflow: visible !important;
                opacity: 1 !important;
                visibility: visible !important;
              }
              
              /* Optimisation pour plus de texte */
              .reveal .slides {
                font-size: 20px !important;
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
              
              /* Force render all elements */
              .reveal * {
                opacity: 1 !important;
                visibility: visible !important;
              }
              
              /* Critical: Ensure text is visible */
              .reveal .slides p, .reveal .slides li, .reveal .slides h1, 
              .reveal .slides h2, .reveal .slides h3, .reveal .slides blockquote {
                color: inherit !important;
                opacity: 1 !important;
                visibility: visible !important;
              }
              
              /* Ensure content is not truncated */
              .reveal .slides section {
                overflow: visible !important;
                max-height: none !important;
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
