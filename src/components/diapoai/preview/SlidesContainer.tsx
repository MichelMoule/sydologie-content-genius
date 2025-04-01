
import { forwardRef } from "react";

export const SlidesContainer = forwardRef<HTMLDivElement>((_, ref) => {
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
});

SlidesContainer.displayName = "SlidesContainer";
