
import { DOMParser } from '@xmldom/xmldom';

/**
 * Extracts text content from HTML
 */
export const extractTextContent = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
};

/**
 * Converts SVG string to a data URL for embedding in PowerPoint
 */
export const svgToDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
};

/**
 * Extract SVGs from HTML content
 */
export const extractSvgsFromHtml = (html: string): string[] => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const svgs = div.querySelectorAll('svg');
  const serializer = new XMLSerializer();
  return Array.from(svgs).map(svg => serializer.serializeToString(svg));
};

/**
 * Parse HTML content into DOM
 */
export const parseHtml = (html: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(`<html><body>${html}</body></html>`, 'text/html');
};

/**
 * Helper to safely get elements by tag name and convert to array
 * Works with both browser DOM and xmldom
 */
export const getElementsArrayByTagName = (element: Element, tagName: string): Element[] => {
  const collection = element.getElementsByTagName(tagName);
  const result: Element[] = [];
  
  // Handle both DOM collections and NodeList from xmldom
  for (let i = 0; i < collection.length; i++) {
    const item = collection.item(i);
    if (item) {
      result.push(item);
    }
  }
  
  return result;
};
