
import pptxgen from "pptxgenjs";
import { TextProps } from "./types";
import { svgToDataUrl } from "./utils";

/**
 * Processes SVG elements in slides
 */
export const processSvgElement = (slide: pptxgen.Slide, svgElement: any, contentY: number, caption?: string): number => {
  try {
    // Use XMLSerializer to get the serialized SVG string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement as Node);
    
    if (svgString) {
      const dataUrl = svgToDataUrl(svgString);
      slide.addImage({ 
        data: dataUrl, 
        x: 0.5, 
        y: contentY, 
        w: 9,
        h: 4
      });
      contentY += 4.5;
      
      // Add caption if provided
      if (caption) {
        slide.addText(caption, {
          x: 0.5, y: contentY, w: '95%', h: 0.5,
          fontSize: 12, // Reduced font size
          color: '#333333',
          italic: true,
          align: 'center'
        });
        contentY += 0.7;
      }
    }
  } catch (e) {
    console.error('Error processing SVG:', e);
  }
  return contentY;
};

/**
 * Processes divs containing SVGs (for diagrams and charts)
 */
export const processDiagramDiv = (slide: pptxgen.Slide, divElement: any, contentY: number): number => {
  // Extract SVG from div if it exists
  const nestedSvg = divElement.getElementsByTagName('svg')[0];
  if (nestedSvg) {
    // Look for caption within the div
    const captionElements = divElement.getElementsByClassName('diagram-caption');
    const caption = captionElements.length > 0 ? captionElements[0].textContent || '' : '';
    
    contentY = processSvgElement(slide, nestedSvg, contentY, caption);
  } else {
    // If no SVG exists but there is a data-chart attribute, it might be a Chart.js visualization
    if (divElement.getAttribute('data-chart')) {
      slide.addText('Graphique interactif (visible uniquement dans le HTML)', {
        x: 0.5, y: contentY, w: '95%', h: 0.5,
        fontSize: 14, // Reduced font size
        color: '#FF9B7A',
        italic: true,
        align: 'center'
      });
      contentY += 1.5;
    }
  }
  return contentY;
};

/**
 * Process paragraph content
 */
export const processParagraphs = (slide: pptxgen.Slide, paragraphs: HTMLCollectionOf<Element>, contentY: number, textColor: string): number => {
  for (let j = 0; j < paragraphs.length; j++) {
    const text = paragraphs[j].textContent || '';
    if (text.trim()) {
      slide.addText(text, {
        x: 0.5, y: contentY, w: '95%', h: 0.5,
        fontSize: 16, // Reduced font size from 18 to 16
        color: textColor,
        align: 'left'
      });
      contentY += 0.6; // Slightly reduced spacing
    }
  }
  return contentY;
};

/**
 * Process unordered lists
 */
export const processUnorderedLists = (slide: pptxgen.Slide, ulElements: HTMLCollectionOf<Element>, contentY: number, textColor: string): number => {
  for (let j = 0; j < ulElements.length; j++) {
    const listItems = ulElements[j].getElementsByTagName('li');
    const listContent: TextProps[] = Array.from(listItems).map(li => ({
      text: li.textContent || '',
      options: {}
    }));
    
    if (listContent.length > 0) {
      slide.addText(listContent, {
        x: 0.5, y: contentY, w: '95%', h: 0.5 * listContent.length,
        fontSize: 16, // Reduced font size from 18 to 16
        color: textColor,
        bullet: { type: 'bullet' }
      });
      contentY += 0.5 * listContent.length; // Reduced spacing
    }
  }
  return contentY;
};

/**
 * Process ordered lists
 */
export const processOrderedLists = (slide: pptxgen.Slide, olElements: HTMLCollectionOf<Element>, contentY: number, textColor: string): number => {
  for (let j = 0; j < olElements.length; j++) {
    const listItems = olElements[j].getElementsByTagName('li');
    const listContent: TextProps[] = Array.from(listItems).map(li => ({
      text: li.textContent || '',
      options: {}
    }));
    
    if (listContent.length > 0) {
      slide.addText(listContent, {
        x: 0.5, y: contentY, w: '95%', h: 0.5 * listContent.length,
        fontSize: 16, // Reduced font size from 18 to 16
        color: textColor,
        bullet: { type: 'number' }
      });
      contentY += 0.5 * listContent.length; // Reduced spacing
    }
  }
  return contentY;
};

/**
 * Process feature panels (custom styled boxes)
 */
export const processFeaturePanels = (slide: pptxgen.Slide, divElements: HTMLCollectionOf<Element>, contentY: number, colors: { primary: string, secondary: string, text: string }): number => {
  // Filter divs to only get feature panels
  const featurePanels = Array.from(divElements).filter(div => {
    return div.getAttribute('class')?.includes('feature-panel');
  });
  
  for (let j = 0; j < featurePanels.length; j++) {
    const panel = featurePanels[j];
    const text = panel.textContent || '';
    
    if (text.trim()) {
      // Add a colored rectangle for the panel
      slide.addShape('rect', { 
        x: 0.5, y: contentY, 
        w: 9, h: 0.7, // Reduced height from 0.8 to 0.7
        fill: { color: lightenHex(colors.primary, 0.9) },
        line: { color: colors.primary, width: 2 },
        rectRadius: 8
      });
      
      // Add the text content
      slide.addText(text, {
        x: 0.7, y: contentY + 0.1, w: 8.6, h: 0.5, // Reduced height from 0.6 to 0.5
        fontSize: 16, // Reduced font size from 18 to 16
        color: colors.text,
        bold: true
      });
      
      contentY += 0.9; // Reduced spacing from 1.0 to 0.9
    }
  }
  
  return contentY;
};

/**
 * Process timeline items (numbered content with vertical line)
 */
export const processTimelineItems = (slide: pptxgen.Slide, divElements: HTMLCollectionOf<Element>, contentY: number, colors: { primary: string, secondary: string, text: string }): number => {
  // Filter divs to only get timeline items
  const timelineItems = Array.from(divElements).filter(div => {
    return div.getAttribute('class')?.includes('timeline-item');
  });
  
  for (let j = 0; j < timelineItems.length; j++) {
    const item = timelineItems[j];
    
    // Find number element and content
    const numberDiv = item.querySelector('.timeline-number');
    const contentDiv = item.querySelector('.timeline-content');
    
    if (numberDiv && contentDiv) {
      const number = numberDiv.textContent || '';
      const contentText = contentDiv.textContent || '';
      
      // Add the number circle
      slide.addShape('ellipse', {
        x: 0.5, y: contentY,
        w: 0.5, h: 0.5,
        fill: { color: colors.primary }
      });
      
      // Add the number
      slide.addText(number, {
        x: 0.5, y: contentY,
        w: 0.5, h: 0.5,
        color: 'FFFFFF',
        fontSize: 14,
        bold: true,
        align: 'center',
        valign: 'middle'
      });
      
      // Add the content text
      slide.addText(contentText, {
        x: 1.2, y: contentY,
        w: 8.3, h: 0.7, // Reduced height from 0.8 to 0.7
        fontSize: 14, // Reduced font size from 16 to 14
        color: colors.text
      });
      
      // If not the last item, add a vertical line
      if (j < timelineItems.length - 1) {
        slide.addShape('line', {
          x: 0.75, y: contentY + 0.5,
          w: 0, h: 0.5,
          line: { color: colors.primary, width: 1, dashType: 'dash' }
        });
      }
      
      contentY += 1.1; // Reduced spacing from 1.2 to 1.1
    }
  }
  
  return contentY;
};

/**
 * Process grid containers (2x2 or other grid layouts)
 */
export const processGridContainers = (slide: pptxgen.Slide, divElements: HTMLCollectionOf<Element>, contentY: number, colors: { primary: string, secondary: string, text: string }): number => {
  // Filter divs to only get grid containers
  const gridContainers = Array.from(divElements).filter(div => {
    return div.getAttribute('class')?.includes('grid-container');
  });
  
  for (let i = 0; i < gridContainers.length; i++) {
    const container = gridContainers[i];
    const gridItems = container.querySelectorAll('.grid-item');
    
    if (gridItems.length > 0) {
      const itemCount = gridItems.length;
      const columns = itemCount > 2 ? 2 : itemCount;
      const rows = Math.ceil(itemCount / 2);
      
      // Calculate dimensions for each grid item
      const itemWidth = 4.3; // Slightly reduced from 4.4
      const itemHeight = 1.4; // Reduced from 1.5
      const itemSpacing = 0.2;
      
      for (let j = 0; j < gridItems.length; j++) {
        const item = gridItems[j];
        const title = item.querySelector('h3')?.textContent || '';
        const content = item.textContent?.replace(title, '').trim() || '';
        
        // Calculate position
        const col = j % columns;
        const row = Math.floor(j / columns);
        const itemX = 0.5 + (col * (itemWidth + itemSpacing));
        const itemY = contentY + (row * (itemHeight + itemSpacing));
        
        // Add rectangle background
        slide.addShape('rect', {
          x: itemX, y: itemY,
          w: itemWidth, h: itemHeight,
          fill: { color: lightenHex(colors.primary, 0.9) },
          line: { color: colors.primary, width: 1 },
          rectRadius: 5
        });
        
        // Add title
        if (title) {
          slide.addText(title, {
            x: itemX + 0.1, y: itemY + 0.1,
            w: itemWidth - 0.2, h: 0.4,
            fontSize: 12, // Reduced from 14
            color: colors.primary,
            bold: true
          });
          
          // Add separator line
          slide.addShape('line', {
            x: itemX + 0.1, y: itemY + 0.5,
            w: itemWidth - 0.2, h: 0,
            line: { color: colors.secondary, width: 1 }
          });
        }
        
        // Add content
        slide.addText(content, {
          x: itemX + 0.1, y: itemY + 0.6,
          w: itemWidth - 0.2, h: itemHeight - 0.7,
          fontSize: 11, // Reduced from 12
          color: colors.text
        });
      }
      
      // Update contentY to after the grid
      contentY += (rows * (itemHeight + itemSpacing));
    }
  }
  
  return contentY;
};

/**
 * Process canvas elements (likely Chart.js charts)
 */
export const processCanvasElements = (slide: pptxgen.Slide, canvasElements: HTMLCollectionOf<Element>, contentY: number, secondaryColor: string, textColor: string): number => {
  for (let j = 0; j < canvasElements.length; j++) {
    const canvasElement = canvasElements[j];
    
    // If canvas has data-chart attribute, it's a Chart.js chart
    if (canvasElement.hasAttribute('data-chart')) {
      slide.addText('Graphique interactif (visible uniquement dans le HTML)', {
        x: 0.5, y: contentY, w: '95%', h: 0.5,
        fontSize: 14, // Reduced from 16
        color: secondaryColor,
        italic: true,
        align: 'center'
      });
      contentY += 1.5;
      
      // Look for caption
      const nextSibling = canvasElement.nextSibling;
      if (nextSibling && nextSibling.nodeType === 1) {
        const nextElement = nextSibling as any;
        if (nextElement.classList && nextElement.classList.contains('diagram-caption')) {
          slide.addText(nextElement.textContent || '', {
            x: 0.5, y: contentY, w: '95%', h: 0.5,
            fontSize: 12, // Reduced from 14
            color: textColor,
            italic: true,
            align: 'center'
          });
          contentY += 0.7;
        }
      }
    }
  }
  return contentY;
};

/**
 * Helper function to lighten a hex color
 */
function lightenHex(hexColor: string, factor: number): string {
  // Remove the # if present
  hexColor = hexColor.replace(/^#/, '');
  
  // Parse the hex values
  let r = parseInt(hexColor.substring(0, 2), 16);
  let g = parseInt(hexColor.substring(2, 4), 16);
  let b = parseInt(hexColor.substring(4, 6), 16);
  
  // Lighten the color
  r = Math.round(r + (255 - r) * factor);
  g = Math.round(g + (255 - g) * factor);
  b = Math.round(b + (255 - b) * factor);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
