
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
      // Optimisations pour plus de texte par diapo
      slide.addText(text, {
        x: 0.4, 
        y: currentY, 
        w: '96%', // Augmenté pour utiliser plus d'espace horizontal
        h: 0.45,  // Réduit davantage pour permettre plus de contenu
        fontSize: 16, // Plus petit pour accommoder plus de texte
        color: textColor,
        breakLine: true,
        lineSpacing: 0.85, // Lignes plus rapprochées pour une meilleure densité
        margin: [0, 0, 0, 0] // Réduire les marges au minimum
      });
      currentY += 0.5; // Avancer encore moins pour plus de contenu par diapo
    }
  }
  
  return currentY;
};
