
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
  
  // This is the key interface used by pptxgenjs for text options
  interface AddTextProps {
    x?: number | string;
    y?: number | string;
    w?: number | string;
    h?: number | string;
    fontSize?: number;
    fontFace?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    valign?: 'top' | 'middle' | 'bottom';
    align?: 'left' | 'center' | 'right';
    margin?: number | [number, number, number, number];
    fill?: { color: string };
    borderColor?: string;
    borderPt?: number;
    borderLeftColor?: string;
    borderLeftPt?: number;
  }
  
  // Extend the ITextOpts interface which is used internally by the library
  interface ITextOpts {
    borderColor?: string;
    borderPt?: number;
    borderLeftColor?: string;
    borderLeftPt?: number;
    italic?: boolean;
  }
  
  // Also extend TextPropsOptions which is used by slide.addText
  interface TextPropsOptions extends AddTextProps {
    // TextPropsOptions now inherits all properties from AddTextProps,
    // which includes borderColor, borderPt, borderLeftColor, borderLeftPt, etc.
  }
}
