
import pptxgen from "pptxgenjs";
import { ThemeColors } from "./types";
import { parseHtml } from "./utils";
import { processSlideElement } from "./slideProcessor";

/**
 * Converts HTML content to PPTX format
 */
export const convertHtmlToPptx = async (slidesHtml: string, colors: ThemeColors): Promise<Blob> => {
  // Create a new presentation
  const pptx = new pptxgen();
  
  // Set presentation properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'SYDO DiapoAI';
  pptx.title = 'Présentation générée par DiapoAI';
  
  // Define master slide with SYDO theme colors
  pptx.defineSlideMaster({
    title: 'SYDO_MASTER',
    background: { color: colors.background },
    objects: [
      { 'line': { x: 0, y: '90%', w: '100%', h: 0, line: { color: colors.primary, width: 1 } } },
      // Subtle logo or branding element in bottom right corner
      { 'text': { 
        text: 'SYDO', 
        options: { 
          x: '90%', y: '93%', w: '10%', h: 0.3, 
          color: colors.primary, 
          fontSize: 10, 
          align: 'right',
          fontFace: 'Arial'
          // Removed both unsupported 'opacity' and 'transparentBackground' properties
        } 
      }}
    ],
    slideNumber: { x: '95%', y: '95%', color: colors.primary, fontSize: 10 }
  });
  
  // Parse the HTML content
  const dom = parseHtml(slidesHtml);
  
  // Find all slide sections
  const slideElements = dom.getElementsByTagName('section');
  
  if (!slideElements || slideElements.length === 0) {
    throw new Error('No slide content found');
  }
  
  // Process each slide
  for (let i = 0; i < slideElements.length; i++) {
    const slideElement = slideElements[i];
    
    // Skip nested sections (vertical slides in Reveal.js)
    if (slideElement.parentNode && slideElement.parentNode.nodeName.toLowerCase() === 'section') {
      continue;
    }
    
    // Use any type to avoid type conflicts between xmldom Element and DOM Element
    processSlideElement(pptx, slideElement as any, colors);
  }
  
  // Use the correct interface for writeFile and cast the result appropriately
  const pptxBlob = await pptx.writeFile() as unknown as Blob;
  return pptxBlob;
};

// Re-export types
export * from "./types";
