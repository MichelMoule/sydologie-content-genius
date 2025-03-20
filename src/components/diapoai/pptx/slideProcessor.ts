
import pptxgen from "pptxgenjs";
import { ThemeColors } from "./types";
import { 
  processParagraphs, 
  processUnorderedLists, 
  processOrderedLists, 
  processSvgElement, 
  processDiagramDiv,
  processCanvasElements
} from "./slideContentProcessor";

/**
 * Processes a slide element and adds content to PowerPoint slide
 */
export const processSlideElement = (
  pptx: pptxgen,
  slideElement: any, // Changed from Element to any to resolve type mismatch
  colors: ThemeColors
): void => {
  // Create a new slide
  const slide = pptx.addSlide({ masterName: 'SYDO_MASTER' });
  
  // Check for special slide classes
  const isTitle = slideElement.getAttribute('class')?.includes('title-slide');
  const isSectionTitle = slideElement.getAttribute('class')?.includes('section-title');
  
  // Find headings
  const h1Elements = slideElement.getElementsByTagName('h1');
  const h2Elements = slideElement.getElementsByTagName('h2');
  const h3Elements = slideElement.getElementsByTagName('h3');
  
  // Add title if found
  if (h1Elements.length > 0) {
    const titleText = h1Elements[0].textContent || '';
    slide.addText(titleText, {
      x: 0.5, y: 0.5, w: '95%', h: 1,
      fontSize: isTitle ? 44 : (isSectionTitle ? 40 : 36),
      color: colors.primary,
      bold: true,
      align: isTitle || isSectionTitle ? 'center' : 'left'
    });
  } else if (h2Elements.length > 0) {
    const titleText = h2Elements[0].textContent || '';
    slide.addText(titleText, {
      x: 0.5, y: 0.5, w: '95%', h: 1,
      fontSize: isSectionTitle ? 40 : 32,
      color: colors.primary,
      bold: true,
      align: isSectionTitle ? 'center' : 'left'
    });
  }
  
  // Add subtitle if exists and is title slide
  if (isTitle && h2Elements.length > 0) {
    const subtitleText = h2Elements[0].textContent || '';
    slide.addText(subtitleText, { 
      x: 0.5, y: 1.8, w: '95%', h: 0.8, 
      fontSize: 28, 
      color: colors.secondary,
      align: 'center'
    });
  }
  
  // Process content based on slide type
  if (!isTitle && !isSectionTitle) {
    let contentY = h1Elements.length > 0 || h2Elements.length > 0 ? 2 : 0.5;
    
    // Process paragraph content
    const paragraphs = slideElement.getElementsByTagName('p');
    contentY = processParagraphs(slide, paragraphs, contentY, colors.text);
    
    // Process lists
    const ulElements = slideElement.getElementsByTagName('ul');
    contentY = processUnorderedLists(slide, ulElements, contentY, colors.text);
    
    // Process ordered lists
    const olElements = slideElement.getElementsByTagName('ol');
    contentY = processOrderedLists(slide, olElements, contentY, colors.text);
    
    // Process standalone SVG elements
    const svgElements = slideElement.getElementsByTagName('svg');
    for (let j = 0; j < svgElements.length; j++) {
      const svgElement = svgElements[j];
      
      // Look for caption
      let caption = '';
      const nextSibling = svgElement.nextSibling;
      if (nextSibling && nextSibling.nodeType === 1) {
        const nextElement = nextSibling as any;
        if (nextElement.classList && nextElement.classList.contains('diagram-caption')) {
          caption = nextElement.textContent || '';
        }
      }
      
      contentY = processSvgElement(slide, svgElement, contentY, caption);
    }
    
    // Process divs containing SVGs (for diagrams and charts)
    const diagramDivs = slideElement.getElementsByTagName('div');
    for (let j = 0; j < diagramDivs.length; j++) {
      const divElement = diagramDivs[j];
      if (
        divElement.getAttribute('class')?.includes('diagram') || 
        divElement.getAttribute('class')?.includes('svg-diagram') ||
        divElement.hasAttribute('data-animate') ||
        divElement.hasAttribute('data-chart')
      ) {
        contentY = processDiagramDiv(slide, divElement, contentY);
      }
    }
    
    // Process canvas elements (likely Chart.js charts)
    const canvasElements = slideElement.getElementsByTagName('canvas');
    contentY = processCanvasElements(slide, canvasElements, contentY, colors.secondary, colors.text);
  }
};
