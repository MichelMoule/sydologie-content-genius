
import pptxgen from "pptxgenjs";
import { hasClass, filterChildElementsByClass, getElementsArrayByTagName, getTextContent, DOMElement } from "../utils";
import { ThemeColors } from "../types";

/**
 * Process grid containers (2x2 or other grid layouts)
 */
export const processGridContainers = (
  slide: pptxgen.Slide,
  divElements: DOMElement[],
  startY: number,
  colors: ThemeColors
): number => {
  let currentY = startY;
  
  for (let i = 0; i < divElements.length; i++) {
    const div = divElements[i];
    
    if (hasClass(div, 'grid-container')) {
      // Find grid items
      const gridItems = filterChildElementsByClass(div, 'grid-item');
      
      if (gridItems.length > 0) {
        const gridItemsCount = gridItems.length;
        const isEven = gridItemsCount % 2 === 0;
        
        // Calculate grid layout
        const rowCount = isEven ? gridItemsCount / 2 : Math.ceil(gridItemsCount / 2);
        const colCount = Math.min(gridItemsCount, 2); // Max 2 columns
        
        for (let j = 0; j < gridItemsCount; j++) {
          const gridItem = gridItems[j];
          const row = Math.floor(j / colCount);
          const col = j % colCount;
          
          // Find title and text in grid item
          const h3Elements = getElementsArrayByTagName(gridItem, 'h3');
          const paragraphs = getElementsArrayByTagName(gridItem, 'p');
          
          let title = '';
          let text = '';
          
          if (h3Elements.length > 0) {
            title = getTextContent(h3Elements[0]);
          }
          
          if (paragraphs.length > 0) {
            text = getTextContent(paragraphs[0]);
          } else {
            // If no paragraphs, use remaining text content
            const allText = getTextContent(gridItem);
            if (title) {
              text = allText.replace(title, '').trim();
            } else {
              text = allText;
            }
          }
          
          // Calculate position
          const x = col === 0 ? 0.5 : 5.5;
          const y = currentY + (row * 2.2);
          
          // Add box shape
          slide.addShape('rect', {
            x, y, w: 4.5, h: 2.0,
            fill: { color: colors.primary, transparency: 90 },
            line: { color: colors.primary, width: 1 }
          });
          
          // Add title if available
          if (title) {
            slide.addText(title, {
              x: x + 0.2, y: y + 0.1, w: 4.1, h: 0.5,
              fontSize: 20,
              bold: true,
              color: colors.primary
            });
          }
          
          // Add text if available
          if (text) {
            slide.addText(text, {
              x: x + 0.2, y: y + (title ? 0.6 : 0.1),
              w: 4.1, h: title ? 1.3 : 1.8,
              fontSize: 18,
              color: colors.text,
              breakLine: true
            });
          }
        }
        
        // Update current Y position
        currentY += rowCount * 2.2 + 0.3;
      }
    }
  }
  
  return currentY;
};
