
import { DOMParser } from '@xmldom/xmldom';

// Define a type that can represent both browser and xmldom Element types
export type DOMElement = Element | import('@xmldom/xmldom').Element;
export type DOMNode = Node | import('@xmldom/xmldom').Node;

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
export const getElementsArrayByTagName = (element: DOMElement, tagName: string): DOMElement[] => {
  const collection = element.getElementsByTagName(tagName);
  const result: DOMElement[] = [];
  
  // Handle both DOM collections and NodeList from xmldom
  for (let i = 0; i < collection.length; i++) {
    const item = collection.item(i);
    if (item) {
      result.push(item as DOMElement);
    }
  }
  
  return result;
};

/**
 * Safe way to check if an element has a class
 * Works with both browser DOM and xmldom elements
 */
export const hasClass = (element: DOMElement, className: string): boolean => {
  // For browser DOM elements with classList property
  if ('classList' in element && element.classList) {
    return element.classList.contains(className);
  }
  
  // For xmldom elements without classList
  const classAttr = element.getAttribute('class');
  if (!classAttr) return false;
  
  const classes = classAttr.split(' ');
  return classes.includes(className);
};

/**
 * Safe way to filter child nodes that are elements by class
 * Works with both browser DOM and xmldom nodes
 */
export const filterChildElementsByClass = (element: DOMElement, className: string): DOMElement[] => {
  const result: DOMElement[] = [];
  
  // Convert childNodes to array safely
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    // Check that it's an element node (nodeType 1)
    if (child.nodeType === 1) {
      const childElement = child as DOMElement;
      if (hasClass(childElement, className)) {
        result.push(childElement);
      }
    }
  }
  
  return result;
};

/**
 * Gets the text content safely from any DOM element
 * Works with both browser DOM and xmldom elements
 */
export const getTextContent = (element: DOMElement): string => {
  // Direct access for browser DOM
  if ('textContent' in element && element.textContent !== null) {
    return element.textContent;
  }
  
  // For xmldom elements, manually concatenate text nodes
  let text = '';
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    if (node.nodeType === 3) { // Text node
      text += node.nodeValue || '';
    } else if (node.nodeType === 1) { // Element node
      text += getTextContent(node as DOMElement);
    }
  }
  
  return text;
};
