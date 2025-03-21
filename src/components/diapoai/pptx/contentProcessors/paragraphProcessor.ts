
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
      slide.addText(text, {
        x: 0.5, y: currentY, w: '95%', h: 0.6,
        fontSize: 20,
        color: textColor,
        breakLine: true
      });
      currentY += 0.7;
    }
  }
  
  return currentY;
};
