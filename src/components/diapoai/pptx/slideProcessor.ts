
import pptxgen from "pptxgenjs";
import { ThemeColors } from "./types";
import { 
  getElementsArrayByTagName, 
  hasClass, 
  getTextContent,
  filterChildElementsByClass,
  DOMElement
} from "./utils";
import { 
  processParagraphs, 
  processUnorderedLists, 
  processOrderedLists, 
  processSvgElement, 
  processDiagramDiv,
  processCanvasElements,
  processFeaturePanels,
  processTimelineItems,
  processGridContainers,
  processTables,
  processBlocks
} from "./contentProcessors";

/**
 * Processes a slide element and adds content to PowerPoint slide
 */
export const processSlideElement = (
  pptx: pptxgen,
  slideElement: DOMElement,
  colors: ThemeColors
): void => {
  // Create a new slide
  const slide = pptx.addSlide({ masterName: 'SYDO_MASTER' });
  
  // Check for special slide classes
  const isTitle = hasClass(slideElement, 'title-slide');
  const isSectionTitle = hasClass(slideElement, 'section-title');
  
  // Find headings
  const h1Elements = getElementsArrayByTagName(slideElement, 'h1');
  const h2Elements = getElementsArrayByTagName(slideElement, 'h2');
  const h3Elements = getElementsArrayByTagName(slideElement, 'h3');
  
  // Track if we've processed main headers for this slide
  let mainHeaderProcessed = false;
  let contentY = 0.5; // Start content positioning at the top
  
  // Add title if found - always process headers first
  if (h1Elements.length > 0) {
    const titleText = getTextContent(h1Elements[0]);
    slide.addText(titleText, {
      x: 0.5, y: contentY, w: '95%', h: 1,
      fontSize: isTitle ? 44 : (isSectionTitle ? 40 : 36), // Increased font sizes
      color: colors.primary,
      bold: true,
      align: isTitle || isSectionTitle ? 'center' : 'left'
    });
    contentY += 1.2; // Move content position down after adding the title
    mainHeaderProcessed = true;
  } else if (h2Elements.length > 0) {
    const titleText = getTextContent(h2Elements[0]);
    slide.addText(titleText, {
      x: 0.5, y: contentY, w: '95%', h: 1,
      fontSize: isSectionTitle ? 40 : 32, // Increased font sizes
      color: colors.primary,
      bold: true,
      align: isSectionTitle ? 'center' : 'left'
    });
    contentY += 1.0; // Move content position down after adding the title
    mainHeaderProcessed = true;
  }
  
  // Add subtitle if exists and is title slide
  if (isTitle && h2Elements.length > 0 && mainHeaderProcessed) {
    const subtitleText = getTextContent(h2Elements[0]);
    slide.addText(subtitleText, { 
      x: 0.5, y: contentY, w: '95%', h: 0.8, 
      fontSize: 28, // Increased from 22
      color: colors.secondary,
      align: 'center'
    });
    contentY += 1.0; // Move content position down after adding subtitle
  }
  
  // Process remaining h3 headers if they exist (as subheadings within the slide)
  if (h3Elements.length > 0 && !isSectionTitle) {
    const subheadingText = getTextContent(h3Elements[0]);
    slide.addText(subheadingText, {
      x: 0.5, y: contentY, w: '95%', h: 0.7,
      fontSize: 28,
      color: colors.primary,
      bold: true,
      align: 'left'
    });
    contentY += 0.8; // Add some space after the subheading
  }
  
  // Always process content, regardless of slide type
  // Get all div elements (needed for various custom elements)
  const divElements = getElementsArrayByTagName(slideElement, 'div');
  
  // Process feature panels (styled boxes with content)
  contentY = processFeaturePanels(slide, divElements, contentY, colors);
  
  // Process timeline items (numbered content with vertical line)
  contentY = processTimelineItems(slide, divElements, contentY, colors);
  
  // Process grid containers (2x2 or other grid layouts)
  contentY = processGridContainers(slide, divElements, contentY, colors);
  
  // Process paragraph content
  const paragraphs = getElementsArrayByTagName(slideElement, 'p');
  contentY = processParagraphs(slide, paragraphs, contentY, colors.text);
  
  // Process lists
  const ulElements = getElementsArrayByTagName(slideElement, 'ul');
  contentY = processUnorderedLists(slide, ulElements, contentY, colors.text);
  
  // Process ordered lists
  const olElements = getElementsArrayByTagName(slideElement, 'ol');
  contentY = processOrderedLists(slide, olElements, contentY, colors.text);
  
  // Process tables
  const tableElements = getElementsArrayByTagName(slideElement, 'table');
  contentY = processTables(slide, tableElements, contentY, colors.primary, colors.text);
  
  // Process blockquotes and code blocks
  const blockquoteElements = getElementsArrayByTagName(slideElement, 'blockquote');
  const preElements = getElementsArrayByTagName(slideElement, 'pre');
  const blockElements = [...blockquoteElements, ...preElements];
  contentY = processBlocks(slide, blockElements, contentY, colors.secondary, colors.text);
  
  // Process standalone SVG elements
  const svgElements = getElementsArrayByTagName(slideElement, 'svg');
  for (let j = 0; j < svgElements.length; j++) {
    const svgElement = svgElements[j];
    
    // Look for caption
    let caption = '';
    if (svgElement.nextSibling && svgElement.nextSibling.nodeType === 1) {
      const nextElement = svgElement.nextSibling as DOMElement;
      if (hasClass(nextElement, 'diagram-caption')) {
        caption = getTextContent(nextElement);
      }
    }
    
    contentY = processSvgElement(slide, svgElement, contentY, caption);
  }
  
  // Process divs containing SVGs (for diagrams and charts)
  for (let j = 0; j < divElements.length; j++) {
    const divElement = divElements[j];
    if (
      hasClass(divElement, 'diagram') ||
      hasClass(divElement, 'svg-diagram') ||
      divElement.hasAttribute('data-animate') ||
      divElement.hasAttribute('data-chart')
    ) {
      contentY = processDiagramDiv(slide, divElement, contentY);
    }
  }
  
  // Process canvas elements (likely Chart.js charts)
  const canvasElements = getElementsArrayByTagName(slideElement, 'canvas');
  contentY = processCanvasElements(slide, canvasElements, contentY, colors.secondary, colors.text);
};
