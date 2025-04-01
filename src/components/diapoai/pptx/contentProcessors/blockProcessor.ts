
import pptxgen from "pptxgenjs";
import { DOMElement, getTextContent } from "../utils";

/**
 * Process blockquotes and code blocks for PowerPoint
 */
export const processBlocks = (
  slide: pptxgen.Slide,
  blockElements: DOMElement[],
  startY: number,
  secondaryColor: string,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < blockElements.length; i++) {
    const blockElement = blockElements[i];
    const text = getTextContent(blockElement);
    
    if (!text.trim()) continue;
    
    // Different styling for different types of blocks
    const isCodeBlock = blockElement.tagName.toLowerCase() === 'pre';
    const isBlockquote = blockElement.tagName.toLowerCase() === 'blockquote';
    
    if (isCodeBlock) {
      // Style for code blocks
      slide.addText(text, {
        x: 0.8, 
        y: currentY, 
        w: 8.4, 
        h: Math.min(4, 0.15 * text.split('\n').length + 1),
        fontSize: 14,
        fontFace: 'Courier New',
        color: textColor,
        fill: { color: '#f0f0f0' },
        border: { pt: 1, color: '#cccccc' },
        valign: 'top',
        margin: [0.2, 0.2, 0.2, 0.2]
      });
      
      // Update Y position - height depends on content
      currentY += Math.min(4.2, 0.15 * text.split('\n').length + 1.2);
    } 
    else if (isBlockquote) {
      // Style for blockquotes
      slide.addText(text, {
        x: 1, 
        y: currentY, 
        w: 8, 
        h: Math.min(3, 0.2 * text.split('\n').length + 0.8),
        fontSize: 18,
        fontFace: 'Arial',
        color: textColor,
        fontStyle: { italic: true },
        fill: { color: secondaryColor + '15' }, // Very light secondary color
        border: { pt: 0, color: 'transparent' },
        borderLeft: { pt: 3, color: secondaryColor },
        valign: 'middle',
        margin: [0, 0, 0, 0.3]
      });
      
      // Update Y position - height depends on content
      currentY += Math.min(3.2, 0.2 * text.split('\n').length + 1);
    }
  }
  
  return currentY;
};
