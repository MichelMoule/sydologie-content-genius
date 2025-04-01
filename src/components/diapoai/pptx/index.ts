
import { ThemeColors } from "./types";
import { setupPresentation } from "./setup/presentationSetup";
import { convertHtmlToPptx as convert } from "./converter/htmlToPptxConverter";

/**
 * Converts HTML content to PPTX format with proper setup
 */
export const convertHtmlToPptx = async (slidesHtml: string, colors: ThemeColors): Promise<Blob> => {
  try {
    return await convert(slidesHtml, colors);
  } catch (error) {
    console.error("Error in PPTX conversion:", error);
    throw error;
  }
};

// Re-export types
export * from "./types";
