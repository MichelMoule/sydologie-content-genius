
import pptxgen from "pptxgenjs";
import { filterChildElementsByClass, getElementsArrayByTagName, getTextContent, hasClass, DOMElement } from "../utils";
import { ThemeColors } from "../types";

/**
 * Process timeline items (numbered steps with vertical connector)
 */
export const processTimelineItems = (
  slide: pptxgen.Slide,
  divElements: DOMElement[],
  startY: number,
  colors: ThemeColors
): number => {
  let currentY = startY;
  
  for (let i = 0; i < divElements.length; i++) {
    const div = divElements[i];
    
    if (hasClass(div, 'timeline-item')) {
      // Find number div
      const numberDivs = filterChildElementsByClass(div, 'timeline-number');
      
      // Find content div
      const contentDivs = filterChildElementsByClass(div, 'timeline-content');
      
      if (numberDivs.length > 0 && contentDivs.length > 0) {
        const number = getTextContent(numberDivs[0]);
        const contentDiv = contentDivs[0];
        
        // Find title and text in content
        const h3Elements = getElementsArrayByTagName(contentDiv, 'h3');
        const paragraphs = getElementsArrayByTagName(contentDiv, 'p');
        
        let title = '';
        let text = '';
        
        if (h3Elements.length > 0) {
          title = getTextContent(h3Elements[0]);
        }
        
        if (paragraphs.length > 0) {
          text = getTextContent(paragraphs[0]);
        }
        
        // Add circle with number
        slide.addShape('ellipse', {
          x: 0.5, y: currentY, w: 0.5, h: 0.5,
          fill: { color: colors.primary },
          line: { color: colors.primary, width: 1 }
        });
        
        // Add number inside circle
        slide.addText(number, {
          x: 0.5, y: currentY, w: 0.5, h: 0.5,
          fontSize: 14,
          bold: true,
          color: 'FFFFFF',
          align: 'center',
          valign: 'middle'
        });
        
        // Add title and text
        if (title) {
          slide.addText(title, {
            x: 1.2, y: currentY - 0.1, w: '85%', h: 0.4,
            fontSize: 18,
            bold: true,
            color: colors.primary
          });
        }
        
        if (text) {
          slide.addText(text, {
            x: 1.2, y: currentY + (title ? 0.3 : 0),
            w: '85%', h: 0.5,
            fontSize: 16,
            color: colors.text,
            breakLine: true
          });
        }
        
        // Add connector line to next item if not last
        if (i < divElements.length - 1) {
          slide.addShape('line', {
            x: 0.75, y: currentY + 0.5,
            w: 0, h: 0.5,
            line: { color: colors.primary, width: 1, dashType: 'dash' }
          });
        }
        
        currentY += title && text ? 1.0 : 0.7;
      }
    }
  }
  
  return currentY;
};
