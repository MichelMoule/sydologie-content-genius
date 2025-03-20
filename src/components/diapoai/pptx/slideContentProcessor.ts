
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
          fontSize: 14,
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
        fontSize: 16,
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
        fontSize: 18,
        color: textColor,
        align: 'left'
      });
      contentY += 0.7;
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
        fontSize: 18,
        color: textColor,
        bullet: { type: 'bullet' }
      });
      contentY += 0.6 * listContent.length;
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
        fontSize: 18,
        color: textColor,
        bullet: { type: 'number' }
      });
      contentY += 0.6 * listContent.length;
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
        fontSize: 16,
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
            fontSize: 14,
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
