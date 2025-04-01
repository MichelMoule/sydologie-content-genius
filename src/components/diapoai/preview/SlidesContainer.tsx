
import { forwardRef } from "react";

interface SlidesContainerProps {
  ref: React.RefObject<HTMLDivElement>;
}

export const SlidesContainer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div 
      ref={ref} 
      className="reveal border rounded-lg overflow-hidden shadow-lg"
      style={{ height: '700px', width: '100%' }}
    >
      <div className="slides">
        {/* Les diapositives seront injectées ici par useRevealInit */}
        <section>
          <p className="text-center text-gray-500">Chargement du diaporama...</p>
        </section>
      </div>
    </div>
  );
});

SlidesContainer.displayName = "SlidesContainer";
