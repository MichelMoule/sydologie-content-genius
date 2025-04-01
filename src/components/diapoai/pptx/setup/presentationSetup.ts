
import pptxgen from "pptxgenjs";
import { ThemeColors } from "../types";

/**
 * Sets up the PPTX presentation with default settings and theme
 */
export const setupPresentation = (colors: ThemeColors): pptxgen => {
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
  
  return pptx;
};
