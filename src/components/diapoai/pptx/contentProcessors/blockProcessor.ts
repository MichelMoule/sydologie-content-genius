
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
        x: 0.5, y: currentY, w: '92%', h: 0.9, // Hauteur légèrement réduite
        fontSize: 15, // Plus petit pour plus de densité
        color: textColor,
        italic: true,
        bullet: false,
        indentLevel: 1,
        fill: { color: `${accentColor}20` }, // Light background
        line: { color: accentColor, width: 0, dashType: 'solid', beginArrowType: 'none', endArrowType: 'none' },
        margin: [0, 0, 0, 5], // Marges réduites
        lineSpacing: 0.85 // Lignes plus rapprochées
      });
      
      currentY += 1.0; // Moins d'espace après blockquotes
    } else if (tagName === 'pre') {
      // Format as code block with monospace font
      slide.addText(text, {
        x: 0.5, y: currentY, w: '92%', h: 1.1, // Hauteur légèrement réduite
        fontSize: 11, // Plus petit pour le code pour plus de densité
        fontFace: 'Courier New',
        color: textColor, 
        fill: { color: '#F0F0F0' }, // Light gray background for code
        line: { color: '#CCCCCC', width: 1 },
        margin: [2, 2, 2, 2], // Marges très réduites
        lineSpacing: 0.82 // Lignes plus rapprochées pour le code
      });
      
      currentY += 1.2; // Moins d'espace après blocs de code
    }
  }
  
  return currentY;
};
