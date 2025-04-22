
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
  
  // Si aucun paragraphe, rien à faire
  if (paragraphs.length === 0) return currentY;
  
  // Fusionner tous les paragraphes en un seul bloc de texte complet
  let allText = "";
  
  // Collecter tout le texte
  for (let i = 0; i < paragraphs.length; i++) {
    const text = getTextContent(paragraphs[i]);
    if (text.trim()) {
      allText += (allText ? '\n\n' : '') + text;
    }
  }
  
  if (allText.trim()) {
    // Calculer la hauteur dynamiquement en fonction du texte
    // Plus de texte = plus d'espace nécessaire
    const textLength = allText.length;
    
    // Estimation de la hauteur nécessaire (1 caractère ≈ 0.0008 unité de hauteur)
    // avec un minimum de 0.4 et un maximum de 4.5
    const dynamicHeight = Math.max(0.4, Math.min(4.5, textLength * 0.0008));
    
    // Ajouter tout le texte d'un coup pour éviter la fragmentation
    slide.addText(allText, {
      x: 0.4, 
      y: currentY, 
      w: '92%',
      h: dynamicHeight,
      fontSize: 14,
      color: textColor,
      breakLine: true,
      lineSpacing: 0.9,
      margin: [0, 0, 0, 0],
      valign: 'top',
      wrap: true,
      bullet: false,
    });
    
    // Avancer la position Y
    currentY += dynamicHeight + 0.15;
  }
  
  return currentY;
};
