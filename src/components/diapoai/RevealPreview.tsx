
import { useEffect, useRef } from 'react';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';

interface RevealPreviewProps {
  slidesHtml: string;
}

const RevealPreview = ({ slidesHtml }: RevealPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadReveal = async () => {
      if (!containerRef.current) return;

      try {
        // Dynamic import of Reveal.js
        const Reveal = (await import('reveal.js')).default;
        
        // Clear previous content
        containerRef.current.innerHTML = slidesHtml;
        
        // Initialize Reveal.js
        const deck = new Reveal(containerRef.current, {
          embedded: true,
          margin: 0.1,
          height: 700,
          width: 960,
          controls: true,
          progress: true,
          center: true,
          hash: false,
        });
        
        await deck.initialize();
      } catch (error) {
        console.error('Error initializing Reveal.js:', error);
      }
    };

    loadReveal();
  }, [slidesHtml]);

  return (
    <div 
      ref={containerRef} 
      className="reveal-container border rounded-lg overflow-hidden"
      style={{ height: '700px', width: '100%' }}
    >
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-gray-500">Chargement du diaporama...</p>
      </div>
    </div>
  );
};

export default RevealPreview;
