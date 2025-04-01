
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

// Additional pptxgenjs type definitions if necessary
declare module 'pptxgenjs' {
  interface TableCellProps {
    text?: string;
    options?: object;
    fill?: { color: string };
    bold?: boolean;
  }

  // Extend TextPropsOptions interface to add missing properties
  interface TextPropsOptions {
    // Add the properties that TypeScript is complaining about
    borderColor?: string;
    borderPt?: number;
    borderLeftColor?: string;
    borderLeftPt?: number;
    italic?: boolean;
  }
}
