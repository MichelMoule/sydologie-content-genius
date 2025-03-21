
import pptxgen from "pptxgenjs";
import { DOMElement } from "../utils";

/**
 * Process canvas elements (e.g., Chart.js charts)
 */
export const processCanvasElements = (
  slide: pptxgen.Slide,
  canvasElements: DOMElement[],
  startY: number,
  accentColor: string,
  textColor: string
): number => {
  let currentY = startY;
  
  // Canvas elements can't be directly converted to images in server-side processing
  // Instead, add a placeholder text
  if (canvasElements.length > 0) {
    slide.addText('Chart (Canvas elements cannot be automatically converted to PowerPoint)', {
      x: 0.5, y: currentY, w: '90%', h: 0.5,
      fontSize: 20,
      color: textColor,
      italic: true,
      align: 'center'
    });
    currentY += 0.7;
    
    // Add rectangle as placeholder
    slide.addShape('rect', {
      x: 2, y: currentY, w: 6, h: 3.5,
      fill: { color: accentColor, transparency: 80 },
      line: { color: accentColor, width: 1 }
    });
    currentY += 3.7;
  }
  
  return currentY;
};
