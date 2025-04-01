
import pptxgen from "pptxgenjs";
import { ThemeColors } from "./types";
import { parseHtml, DOMElement, DOMNode } from "./utils";
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
        } 
      }}
    ],
    slideNumber: { x: '95%', y: '95%', color: colors.primary, fontSize: 10 }
  });
  
  try {
    // Parse the HTML content
    const dom = parseHtml(slidesHtml);
    
    // Find all slide sections
    const slideElements = dom.getElementsByTagName('section');
    
    if (!slideElements || slideElements.length === 0) {
      throw new Error('No slide content found');
    }
    
    // Process each slide
    for (let i = 0; i < slideElements.length; i++) {
      const slideElement = slideElements.item(i);
      if (!slideElement) continue;
      
      // Skip nested sections (vertical slides in Reveal.js)
      if (slideElement.parentNode && slideElement.parentNode.nodeName.toLowerCase() === 'section') {
        continue;
      }
      
      // Process the slide element using our DOMElement type
      processSlideElement(pptx, slideElement as DOMElement, colors);
    }
    
    // Use the correct interface for writeFile and cast the result appropriately
    const pptxBlob = await pptx.writeFile({ outputType: 'blob' }) as Blob;
    console.log("PPTX generation successful");
    return pptxBlob;
  } catch (error) {
    console.error("Error in convertHtmlToPptx:", error);
    throw error;
  }
};

// Re-export types
export * from "./types";
