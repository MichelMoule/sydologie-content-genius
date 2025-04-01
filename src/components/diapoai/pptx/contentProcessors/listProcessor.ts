
import pptxgen from "pptxgenjs";
import { getElementsArrayByTagName, getTextContent, DOMElement } from "../utils";

/**
 * Process unordered lists for a slide
 */
export const processUnorderedLists = (
  slide: pptxgen.Slide,
  ulElements: DOMElement[],
  startY: number,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < ulElements.length; i++) {
    const ul = ulElements[i];
    const liElements = getElementsArrayByTagName(ul, 'li');
    
    for (let j = 0; j < liElements.length; j++) {
      const li = liElements[j];
      const text = getTextContent(li);
      
      if (text.trim()) {
        slide.addText(`• ${text}`, {
          x: 0.7, y: currentY, w: '90%', h: 0.4, // Hauteur réduite
          fontSize: 18, // Taille réduite
          color: textColor,
          breakLine: true,
          lineSpacing: 0.9 // Lignes plus rapprochées
        });
        currentY += 0.45; // Espacement réduit entre éléments de liste
      }
    }
    
    currentY += 0.2; // Réduit l'espace après une liste
  }
  
  return currentY;
};

/**
 * Process ordered lists for a slide
 */
export const processOrderedLists = (
  slide: pptxgen.Slide,
  olElements: DOMElement[],
  startY: number,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < olElements.length; i++) {
    const ol = olElements[i];
    const liElements = getElementsArrayByTagName(ol, 'li');
    
    for (let j = 0; j < liElements.length; j++) {
      const li = liElements[j];
      const text = getTextContent(li);
      
      if (text.trim()) {
        slide.addText(`${j + 1}. ${text}`, {
          x: 0.7, y: currentY, w: '90%', h: 0.4, // Hauteur réduite
          fontSize: 18, // Taille réduite
          color: textColor,
          breakLine: true,
          lineSpacing: 0.9 // Lignes plus rapprochées
        });
        currentY += 0.45; // Espacement réduit entre éléments de liste
      }
    }
    
    currentY += 0.2; // Réduit l'espace après une liste
  }
  
  return currentY;
};
