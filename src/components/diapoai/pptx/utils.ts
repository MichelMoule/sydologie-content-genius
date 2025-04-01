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
export const filterChildElementsByClass = (parent: DOMElement, className: string): DOMElement[] => {
  const result: DOMElement[] = [];
  if (!parent || !parent.childNodes) return result;
  
  for (let i = 0; i < parent.childNodes.length; i++) {
    const child = parent.childNodes[i];
    if (child.nodeType === 1) { // ELEMENT_NODE
      const element = child as DOMElement;
      if (hasClass(element, className)) {
        result.push(element);
      }
    }
  }
  
  return result;
};

/**
 * Gets text content from an element and its children
 */
export const getTextContent = (element: DOMElement): string => {
  if (!element) return '';

  // Try to use native textContent if available
  if (element.textContent !== undefined && element.textContent !== null) {
    return element.textContent;
  }

  // Fallback for elements without native textContent
  let text = '';
  
  // Get direct text of this node
  if (element.childNodes) {
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      if (child.nodeType === 3) { // TEXT_NODE
        text += child.nodeValue || '';
      } else if (child.nodeType === 1) { // ELEMENT_NODE
        text += getTextContent(child as DOMElement);
      }
    }
  }
  
  return text;
};
