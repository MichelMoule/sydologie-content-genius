
/**
 * Theme colors for PowerPoint slides
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

/**
 * Interface for text properties in pptxgenjs
 */
export interface TextProps {
  text: string;
  options?: object;
}

// Additional pptxgenjs type definitions
declare module 'pptxgenjs' {
  interface TableCellProps {
    text?: string;
    options?: object;
    fill?: { color: string };
    bold?: boolean;
  }
  
  // Ensure we're extending the correct interface that's actually used by the library
  interface ITextOpts {
    borderColor?: string;
    borderPt?: number;
    borderLeftColor?: string;
    borderLeftPt?: number;
    italic?: boolean;
  }
  
  // Also extend the slide.addText options interface
  interface TextPropsOptions {
    borderColor?: string;
    borderPt?: number;
    borderLeftColor?: string;
    borderLeftPt?: number;
    italic?: boolean;
  }
}
