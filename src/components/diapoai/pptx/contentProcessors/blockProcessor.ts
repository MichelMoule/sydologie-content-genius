
import pptxgen from "pptxgenjs";
import { DOMElement } from "../utils";
import { getTextContent } from "../utils";

/**
 * Process blockquotes and code blocks on the slide
 */
export const processBlocks = (
  slide: pptxgen.Slide, 
  blockElements: DOMElement[], 
  startY: number, 
  accentColor: string,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < blockElements.length; i++) {
    const blockElement = blockElements[i];
    const tagName = blockElement.tagName.toLowerCase();
    
    // Get text content
    const text = getTextContent(blockElement);
    if (!text) continue;
    
    // Determine if it's a blockquote or code block and style accordingly
    if (tagName === 'blockquote') {
      slide.addText(text, {
        x: 0.5, y: currentY, w: '90%', h: 1.5,
        fontSize: 18,
        color: textColor,
        italic: true,
        bullet: false,
        indentLevel: 1,
        fill: { color: `${accentColor}20` }, // Light background
        border: { type: 'solid', pt: 1, color: accentColor, left: true },
        margin: [0, 0, 0, 10]
      });
      
      currentY += 1.5; // Add some extra space after blockquotes
    } else if (tagName === 'pre') {
      // Format as code block with monospace font
      slide.addText(text, {
        x: 0.5, y: currentY, w: '90%', h: 1.5,
        fontSize: 14,
        fontFace: 'Courier New',
        color: textColor, 
        fill: { color: '#F0F0F0' }, // Light gray background for code
        border: { type: 'solid', pt: 1, color: '#CCCCCC' },
        margin: [5, 5, 5, 5]
      });
      
      currentY += 2; // Add space after code blocks
    }
  }
  
  return currentY;
};
