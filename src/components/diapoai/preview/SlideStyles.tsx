
import { useEffect, RefObject } from 'react';

interface SlideStylesProps {
  containerRef: RefObject<HTMLDivElement>;
  stylesAddedRef: { current: boolean };
}

export const SlideStyles = ({ containerRef, stylesAddedRef }: SlideStylesProps) => {
  useEffect(() => {
    if (containerRef.current && !stylesAddedRef.current) {
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
        
        .reveal .present {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          justify-content: flex-start !important;
          text-align: left !important;
          page-break-inside: avoid !important;
          overflow: visible !important;
        }
        
        .reveal .slides {
          height: auto !important;
          overflow: visible !important;
          max-height: none !important;
        }
        
        .reveal .slides section * {
          max-width: 100% !important;
          word-wrap: break-word !important;
        }
        
        .reveal h1, .reveal h2, .reveal h3 {
          page-break-after: avoid !important;
        }
        
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
        
        .reveal .slides {
          font-size: 20px !important;
        }
        
        .reveal .slides section > * {
          overflow: visible !important;
        }
        
        .reveal .slides section {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        .reveal * {
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        .reveal .slides p, .reveal .slides li, .reveal .slides h1, 
        .reveal .slides h2, .reveal .slides h3, .reveal .slides blockquote {
          color: inherit !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        .reveal .slides section {
          overflow: visible !important;
          max-height: none !important;
        }
      `;
      containerRef.current.appendChild(style);
    }
  }, [containerRef, stylesAddedRef]);

  return null;
};
