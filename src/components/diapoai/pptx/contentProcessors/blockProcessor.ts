
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
        x: 0.5, y: currentY, w: '90%', h: 1.0, // Hauteur réduite
        fontSize: 16, // Plus petit
        color: textColor,
        italic: true,
        bullet: false,
        indentLevel: 1,
        fill: { color: `${accentColor}20` }, // Light background
        line: { color: accentColor, width: 0, dashType: 'solid', beginArrowType: 'none', endArrowType: 'none' },
        margin: [0, 0, 0, 10],
        lineSpacing: 0.9 // Lignes plus rapprochées
      });
      
      currentY += 1.1; // Moins d'espace après blockquotes
    } else if (tagName === 'pre') {
      // Format as code block with monospace font
      slide.addText(text, {
        x: 0.5, y: currentY, w: '90%', h: 1.2, // Hauteur réduite
        fontSize: 12, // Plus petit pour le code
        fontFace: 'Courier New',
        color: textColor, 
        fill: { color: '#F0F0F0' }, // Light gray background for code
        line: { color: '#CCCCCC', width: 1 },
        margin: [3, 3, 3, 3], // Marges réduites
        lineSpacing: 0.85 // Lignes plus rapprochées pour le code
      });
      
      currentY += 1.3; // Moins d'espace après blocs de code
    }
  }
  
  return currentY;
};
