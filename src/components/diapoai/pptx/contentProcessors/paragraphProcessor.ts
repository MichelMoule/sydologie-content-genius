
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
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const text = getTextContent(paragraph);
    
    if (text.trim()) {
      // Réduire la hauteur et augmenter la largeur pour plus de texte par diapo
      slide.addText(text, {
        x: 0.5, 
        y: currentY, 
        w: '95%', 
        h: 0.5, // Réduit pour permettre plus de contenu
        fontSize: 18, // Légèrement plus petit pour plus de texte
        color: textColor,
        breakLine: true,
        lineSpacing: 0.9 // Lignes plus rapprochées
      });
      currentY += 0.55; // Avancer moins pour permettre plus de contenu par diapo
    }
  }
  
  return currentY;
};
