
// Use appropriate imports from related modules
import pptxgen from "pptxgenjs";
import { ThemeColors } from "./types";
import { svgToDataUrl, getElementsArrayByTagName } from "./utils";

/**
 * Process paragraphs for a slide
 */
export const processParagraphs = (
  slide: pptxgen.Slide,
  paragraphs: Element[],
  startY: number,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const text = paragraph.textContent || '';
    
    if (text.trim()) {
      slide.addText(text, {
        x: 0.5, y: currentY, w: '95%', h: 0.5,
        fontSize: 16,
        color: textColor,
        breakLine: true
      });
      currentY += 0.6;
    }
  }
  
  return currentY;
};

/**
 * Process unordered lists for a slide
 */
export const processUnorderedLists = (
  slide: pptxgen.Slide,
  ulElements: Element[],
  startY: number,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < ulElements.length; i++) {
    const ul = ulElements[i];
    const liElements = getElementsArrayByTagName(ul, 'li');
    
    for (let j = 0; j < liElements.length; j++) {
      const li = liElements[j];
      const text = li.textContent || '';
      
      if (text.trim()) {
        slide.addText(`• ${text}`, {
          x: 0.7, y: currentY, w: '90%', h: 0.5,
          fontSize: 16,
          color: textColor,
          breakLine: true
        });
        currentY += 0.5;
      }
    }
    
    currentY += 0.2; // Add spacing after list
  }
  
  return currentY;
};

/**
 * Process ordered lists for a slide
 */
export const processOrderedLists = (
  slide: pptxgen.Slide,
  olElements: Element[],
  startY: number,
  textColor: string
): number => {
  let currentY = startY;
  
  for (let i = 0; i < olElements.length; i++) {
    const ol = olElements[i];
    const liElements = getElementsArrayByTagName(ol, 'li');
    
    for (let j = 0; j < liElements.length; j++) {
      const li = liElements[j];
      const text = li.textContent || '';
      
      if (text.trim()) {
        slide.addText(`${j + 1}. ${text}`, {
          x: 0.7, y: currentY, w: '90%', h: 0.5,
          fontSize: 16,
          color: textColor,
          breakLine: true
        });
        currentY += 0.5;
      }
    }
    
    currentY += 0.2; // Add spacing after list
  }
  
  return currentY;
};

/**
 * Process an SVG element for a slide
 */
export const processSvgElement = (
  slide: pptxgen.Slide,
  svgElement: Element,
  startY: number,
  caption: string
): number => {
  try {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const dataUrl = svgToDataUrl(svgString);
    
    // Add SVG as image
    slide.addImage({
      data: dataUrl,
      x: 0.5, y: startY,
      w: '90%', h: 3
    });
    
    let currentY = startY + 3.2;
    
    // Add caption if provided
    if (caption) {
      slide.addText(caption, {
        x: 0.5, y: currentY, w: '90%', h: 0.5,
        fontSize: 14,
        italic: true,
        align: 'center'
      });
      currentY += 0.6;
    }
    
    return currentY;
  } catch (error) {
    console.error('Error processing SVG:', error);
    return startY;
  }
};

/**
 * Process a diagram div for a slide (div containing an SVG)
 */
export const processDiagramDiv = (
  slide: pptxgen.Slide,
  divElement: Element,
  startY: number
): number => {
  try {
    const svgElements = getElementsArrayByTagName(divElement, 'svg');
    
    if (svgElements.length > 0) {
      const svgElement = svgElements[0];
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const dataUrl = svgToDataUrl(svgString);
      
      // Add SVG as image
      slide.addImage({
        data: dataUrl,
        x: 0.5, y: startY,
        w: '90%', h: 3
      });
      
      // Look for caption
      let caption = '';
      const captionElements = Array.from(divElement.childNodes).filter(node => 
        node.nodeType === 1 && 
        (node as Element).classList && 
        (node as Element).classList.contains('diagram-caption')
      );
      
      if (captionElements.length > 0) {
        caption = captionElements[0].textContent || '';
      }
      
      let currentY = startY + 3.2;
      
      // Add caption if found
      if (caption) {
        slide.addText(caption, {
          x: 0.5, y: currentY, w: '90%', h: 0.5,
          fontSize: 14,
          italic: true,
          align: 'center'
        });
        currentY += 0.6;
      }
      
      return currentY;
    }
    
    return startY;
  } catch (error) {
    console.error('Error processing diagram div:', error);
    return startY;
  }
};

/**
 * Process canvas elements (e.g., Chart.js charts)
 */
export const processCanvasElements = (
  slide: pptxgen.Slide,
  canvasElements: Element[],
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
      fontSize: 16,
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

/**
 * Process feature panels (styled boxes with content)
 */
export const processFeaturePanels = (
  slide: pptxgen.Slide,
  divElements: Element[],
  startY: number,
  colors: ThemeColors
): number => {
  let currentY = startY;
  
  for (let i = 0; i < divElements.length; i++) {
    const div = divElements[i];
    const className = div.getAttribute('class') || '';
    
    if (className.includes('feature-panel')) {
      const text = div.textContent || '';
      
      if (text.trim()) {
        // Add box shape
        slide.addShape('rect', {
          x: 0.5, y: currentY, w: '95%', h: 0.8,
          fill: { color: colors.primary, transparency: 90 },
          line: { color: colors.primary, width: 1 }
        });
        
        // Add text inside box
        slide.addText(text, {
          x: 0.7, y: currentY + 0.1, w: '90%', h: 0.6,
          fontSize: 16,
          color: colors.text,
          breakLine: true
        });
        
        currentY += 1.0;
      }
    }
  }
  
  return currentY;
};

/**
 * Process timeline items (numbered steps with vertical connector)
 */
export const processTimelineItems = (
  slide: pptxgen.Slide,
  divElements: Element[],
  startY: number,
  colors: ThemeColors
): number => {
  let currentY = startY;
  
  for (let i = 0; i < divElements.length; i++) {
    const div = divElements[i];
    const className = div.getAttribute('class') || '';
    
    if (className.includes('timeline-item')) {
      // Find number div
      const numberDivs = getElementsArrayByTagName(div, 'div').filter(el => 
        (el.getAttribute('class') || '').includes('timeline-number')
      );
      
      // Find content div
      const contentDivs = getElementsArrayByTagName(div, 'div').filter(el => 
        (el.getAttribute('class') || '').includes('timeline-content')
      );
      
      if (numberDivs.length > 0 && contentDivs.length > 0) {
        const number = numberDivs[0].textContent || '';
        const contentDiv = contentDivs[0];
        
        // Find title and text in content
        const h3Elements = getElementsArrayByTagName(contentDiv, 'h3');
        const paragraphs = getElementsArrayByTagName(contentDiv, 'p');
        
        let title = '';
        let text = '';
        
        if (h3Elements.length > 0) {
          title = h3Elements[0].textContent || '';
        }
        
        if (paragraphs.length > 0) {
          text = paragraphs[0].textContent || '';
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

/**
 * Process grid containers (2x2 or other grid layouts)
 */
export const processGridContainers = (
  slide: pptxgen.Slide,
  divElements: Element[],
  startY: number,
  colors: ThemeColors
): number => {
  let currentY = startY;
  
  for (let i = 0; i < divElements.length; i++) {
    const div = divElements[i];
    const className = div.getAttribute('class') || '';
    
    if (className.includes('grid-container')) {
      // Find grid items
      const gridItems = getElementsArrayByTagName(div, 'div').filter(el => 
        (el.getAttribute('class') || '').includes('grid-item')
      );
      
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
            title = h3Elements[0].textContent || '';
          }
          
          if (paragraphs.length > 0) {
            text = paragraphs[0].textContent || '';
          } else {
            // If no paragraphs, use remaining text content
            const allText = gridItem.textContent || '';
            if (title) {
              text = allText.replace(title, '').trim();
            } else {
              text = allText;
            }
          }
          
          // Calculate position
          const x = col === 0 ? 0.5 : 5.5;
          const y = currentY + (row * 2); // Each grid item is about 2 inches high
          
          // Add box shape
          slide.addShape('rect', {
            x, y, w: 4.5, h: 1.7,
            fill: { color: colors.primary, transparency: 90 },
            line: { color: colors.primary, width: 1 }
          });
          
          // Add title if available
          if (title) {
            slide.addText(title, {
              x: x + 0.2, y: y + 0.1, w: 4.1, h: 0.4,
              fontSize: 16,
              bold: true,
              color: colors.primary
            });
          }
          
          // Add text if available
          if (text) {
            slide.addText(text, {
              x: x + 0.2, y: y + (title ? 0.5 : 0.1),
              w: 4.1, h: title ? 1.1 : 1.5,
              fontSize: 14,
              color: colors.text,
              breakLine: true
            });
          }
        }
        
        // Update current Y position
        currentY += rowCount * 2 + 0.3; // Add some extra space after grid
      }
    }
  }
  
  return currentY;
};
