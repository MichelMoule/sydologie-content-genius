
import pptxgen from "pptxgenjs";
import { ThemeColors } from "../types";
import { parseHtml, DOMElement } from "../utils";
import { processSlideElement } from "../slideProcessor";
import { setupPresentation } from "../setup/presentationSetup";

/**
 * Converts HTML content to PPTX format
 */
export const convertHtmlToPptx = async (slidesHtml: string, colors: ThemeColors): Promise<Blob> => {
  // Create a new presentation with the proper setup
  const pptx = setupPresentation(colors);
  
  try {
    // Parse the HTML content
    const dom = parseHtml(slidesHtml);
    
    // Find all slide sections
    const slideElements = dom.getElementsByTagName('section');
    
    if (!slideElements || slideElements.length === 0) {
      throw new Error('No slide content found');
    }
    
    console.log(`Found ${slideElements.length} slide elements`);
    
    // Process each slide
    for (let i = 0; i < slideElements.length; i++) {
      const slideElement = slideElements.item(i);
      if (!slideElement) continue;
      
      // Skip nested sections (vertical slides in Reveal.js)
      if (slideElement.parentNode && slideElement.parentNode.nodeName.toLowerCase() === 'section') {
        continue;
      }
      
      console.log(`Processing slide ${i + 1}`);
      
      // Process the slide element using our DOMElement type
      processSlideElement(pptx, slideElement as DOMElement, colors);
    }
    
    // Use the correct interface for writeFile
    // Cast the result to Blob since we know the output will be a Blob
    const pptxData = await pptx.writeFile({ fileName: 'presentation.pptx' }) as unknown as ArrayBuffer;
    const pptxBlob = new Blob([pptxData], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    
    console.log("PPTX generation successful");
    return pptxBlob;
  } catch (error) {
    console.error("Error in convertHtmlToPptx:", error);
    throw error;
  }
};
