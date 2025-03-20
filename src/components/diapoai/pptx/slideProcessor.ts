
import pptxgen from "pptxgenjs";
import { ThemeColors } from "./types";
import { 
  processParagraphs, 
  processUnorderedLists, 
  processOrderedLists, 
  processSvgElement, 
  processDiagramDiv,
  processCanvasElements,
  processFeaturePanels,
  processTimelineItems,
  processGridContainers
} from "./slideContentProcessor";

/**
 * Processes a slide element and adds content to PowerPoint slide
 */
export const processSlideElement = (
  pptx: pptxgen,
  slideElement: any, // Using any type to resolve type mismatch
  colors: ThemeColors
): void => {
  // Create a new slide
  const slide = pptx.addSlide({ masterName: 'SYDO_MASTER' });
  
  // Check for special slide classes
  const isTitle = slideElement.getAttribute('class')?.includes('title-slide');
  const isSectionTitle = slideElement.getAttribute('class')?.includes('section-title');
  
  // Find headings
  const h1Elements = Array.from(slideElement.getElementsByTagName('h1'));
  const h2Elements = Array.from(slideElement.getElementsByTagName('h2'));
  const h3Elements = Array.from(slideElement.getElementsByTagName('h3'));
  
  // Add title if found
  if (h1Elements.length > 0) {
    const titleText = h1Elements[0].textContent || '';
    slide.addText(titleText, {
      x: 0.5, y: 0.5, w: '95%', h: 1,
      fontSize: isTitle ? 36 : (isSectionTitle ? 32 : 28), // Further reduced font sizes
      color: colors.primary,
      bold: true,
      align: isTitle || isSectionTitle ? 'center' : 'left'
    });
  } else if (h2Elements.length > 0) {
    const titleText = h2Elements[0].textContent || '';
    slide.addText(titleText, {
      x: 0.5, y: 0.5, w: '95%', h: 1,
      fontSize: isSectionTitle ? 32 : 26, // Further reduced font sizes
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
      fontSize: 22, // Further reduced from 24
      color: colors.secondary,
      align: 'center'
    });
  }
  
  // Process content based on slide type
  if (!isTitle && !isSectionTitle) {
    let contentY = h1Elements.length > 0 || h2Elements.length > 0 ? 2 : 0.5;
    
    // Get all div elements (needed for various custom elements)
    const divElements = Array.from(slideElement.getElementsByTagName('div'));
    
    // Process feature panels (styled boxes with content)
    contentY = processFeaturePanels(slide, divElements, contentY, colors);
    
    // Process timeline items (numbered content with vertical line)
    contentY = processTimelineItems(slide, divElements, contentY, colors);
    
    // Process grid containers (2x2 or other grid layouts)
    contentY = processGridContainers(slide, divElements, contentY, colors);
    
    // Process paragraph content
    const paragraphs = Array.from(slideElement.getElementsByTagName('p'));
    contentY = processParagraphs(slide, paragraphs, contentY, colors.text);
    
    // Process lists
    const ulElements = Array.from(slideElement.getElementsByTagName('ul'));
    contentY = processUnorderedLists(slide, ulElements, contentY, colors.text);
    
    // Process ordered lists
    const olElements = Array.from(slideElement.getElementsByTagName('ol'));
    contentY = processOrderedLists(slide, olElements, contentY, colors.text);
    
    // Process standalone SVG elements
    const svgElements = Array.from(slideElement.getElementsByTagName('svg'));
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
    for (let j = 0; j < divElements.length; j++) {
      const divElement = divElements[j];
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
    const canvasElements = Array.from(slideElement.getElementsByTagName('canvas'));
    contentY = processCanvasElements(slide, canvasElements, contentY, colors.secondary, colors.text);
  }
};
