
import pptxgen from "pptxgenjs";
import { svgToDataUrl, getElementsArrayByTagName, getTextContent, filterChildElementsByClass, DOMElement, DOMNode } from "../utils";

/**
 * Process an SVG element for a slide
 */
export const processSvgElement = (
  slide: pptxgen.Slide,
  svgElement: DOMElement,
  startY: number,
  caption: string
): number => {
  try {
    const serializer = new XMLSerializer();
    // Add type assertion to handle the DOMElement to Node conversion
    const svgString = serializer.serializeToString(svgElement as unknown as Node);
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
  divElement: DOMElement,
  startY: number
): number => {
  try {
    const svgElements = getElementsArrayByTagName(divElement, 'svg');
    
    if (svgElements.length > 0) {
      const svgElement = svgElements[0];
      const serializer = new XMLSerializer();
      // Add type assertion to handle the DOMElement to Node conversion
      const svgString = serializer.serializeToString(svgElement as unknown as Node);
      const dataUrl = svgToDataUrl(svgString);
      
      // Add SVG as image
      slide.addImage({
        data: dataUrl,
        x: 0.5, y: startY,
        w: '90%', h: 3
      });
      
      // Look for caption
      let caption = '';
      const captionElements = filterChildElementsByClass(divElement, 'diagram-caption');
      
      if (captionElements.length > 0) {
        caption = getTextContent(captionElements[0]);
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
