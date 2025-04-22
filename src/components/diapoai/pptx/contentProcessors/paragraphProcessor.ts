
import pptxgen from "pptxgenjs";
import { getTextContent, DOMElement } from "../utils";

/**
 * Process paragraphs for a slide
 */
export const processParagraphs = (
  slide: pptxgen.Slide,
  paragraphs: DOMElement[],
  startY: number,
  textColor: string
): number => {
  let currentY = startY;
  
  // Regrouper les paragraphes pour un meilleur agencement
  const maxParasPerGroup = 3;
  for (let i = 0; i < paragraphs.length; i += maxParasPerGroup) {
    let combinedText = "";
    
    // Combiner jusqu'à maxParasPerGroup paragraphes
    for (let j = 0; j < maxParasPerGroup && i + j < paragraphs.length; j++) {
      const paragraph = paragraphs[i + j];
      const text = getTextContent(paragraph);
      
      if (text.trim()) {
        combinedText += (combinedText ? '\n\n' : '') + text;
      }
    }
    
    if (combinedText.trim()) {
      // Ajouter le groupe de paragraphes comme un seul bloc de texte
      // avec une hauteur adaptative basée sur la longueur du texte
      const textLength = combinedText.length;
      const dynamicHeight = Math.max(0.35, Math.min(1.5, textLength / 300));
      
      slide.addText(combinedText, {
        x: 0.4, 
        y: currentY, 
        w: '96%',
        h: dynamicHeight,
        fontSize: 16,
        color: textColor,
        breakLine: true,
        lineSpacing: 0.85,
        margin: [0, 0, 0, 0],
        valign: 'top',
        wrap: true
      });
      
      // Avancer la position Y de façon proportionnelle au texte ajouté
      currentY += dynamicHeight + 0.1;
    }
  }
  
  return currentY;
};
