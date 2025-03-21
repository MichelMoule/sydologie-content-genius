
import pptxgen from "pptxgenjs";
import { hasClass, getTextContent, DOMElement } from "../utils";
import { ThemeColors } from "../types";

/**
 * Process feature panels (styled boxes with content)
 */
export const processFeaturePanels = (
  slide: pptxgen.Slide,
  divElements: DOMElement[],
  startY: number,
  colors: ThemeColors
): number => {
  let currentY = startY;
  
  for (let i = 0; i < divElements.length; i++) {
    const div = divElements[i];
    
    if (hasClass(div, 'feature-panel')) {
      const text = getTextContent(div);
      
      if (text.trim()) {
        // Add box shape
        slide.addShape('rect', {
          x: 0.5, y: currentY, w: '95%', h: 1.0,
          fill: { color: colors.primary, transparency: 90 },
          line: { color: colors.primary, width: 1 }
        });
        
        // Add text inside box
        slide.addText(text, {
          x: 0.7, y: currentY + 0.1, w: '90%', h: 0.8,
          fontSize: 20,
          color: colors.text,
          breakLine: true
        });
        
        currentY += 1.2;
      }
    }
  }
  
  return currentY;
};
