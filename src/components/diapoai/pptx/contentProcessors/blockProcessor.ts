
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
    
    // Calculer une hauteur plus généreuse basée sur la longueur du texte
    const textLength = text.length;
    const dynamicHeight = Math.max(0.6, Math.min(3.0, textLength * 0.001));
    
    // Determine if it's a blockquote or code block and style accordingly
    if (tagName === 'blockquote') {
      slide.addText(text, {
        x: 0.5, y: currentY, 
        w: '92%', 
        h: dynamicHeight,
        fontSize: 14,
        color: textColor,
        italic: true,
        bullet: false,
        indentLevel: 1,
        fill: { color: `${accentColor}20` },
        line: { color: accentColor, width: 0, dashType: 'solid', beginArrowType: 'none', endArrowType: 'none' },
        margin: [0, 0, 0, 5],
        lineSpacing: 0.9,
        valign: 'top',
        wrap: true
      });
      
      currentY += dynamicHeight + 0.2;
    } else if (tagName === 'pre') {
      // Format as code block with monospace font
      slide.addText(text, {
        x: 0.5, y: currentY, 
        w: '92%', 
        h: Math.max(0.8, Math.min(3.0, textLength * 0.001)),
        fontSize: 12,
        fontFace: 'Courier New',
        color: textColor, 
        fill: { color: '#F0F0F0' },
        line: { color: '#CCCCCC', width: 1 },
        margin: [2, 2, 2, 2],
        lineSpacing: 0.85,
        valign: 'top',
        wrap: true
      });
      
      currentY += dynamicHeight + 0.3;
    }
  }
  
  return currentY;
};
