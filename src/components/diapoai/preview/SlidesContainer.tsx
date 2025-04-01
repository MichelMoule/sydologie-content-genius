
import { forwardRef } from "react";

interface SlidesContainerProps {
  ref: React.RefObject<HTMLDivElement>;
}

export const SlidesContainer = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div 
      ref={ref} 
      className="reveal-container border rounded-lg overflow-hidden shadow-lg"
      style={{ height: '700px', width: '100%' }}
    >
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-gray-500">Chargement du diaporama...</p>
      </div>
    </div>
  );
});

SlidesContainer.displayName = "SlidesContainer";
