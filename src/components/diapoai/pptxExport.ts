
import pptxgen from "pptxgenjs";
import { DOMParser } from '@xmldom/xmldom';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

// Interface pour les propriétés de texte dans pptxgenjs
interface TextProps {
  text: string;
  options?: object;
}

// Helper to extract text content from HTML
const extractTextContent = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
};

// Convert SVG to DataURL for embedding in PowerPoint
const svgToDataUrl = (svgString: string): string => {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
};

// Function to convert HTML content to PPTX
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
      { 'line': { x: 0, y: '90%', w: '100%', h: 0, line: { color: colors.primary, width: 1 } } }
    ],
    slideNumber: { x: '95%', y: '95%', color: colors.primary }
  });
  
  // Parse the HTML content
  const parser = new DOMParser();
  const dom = parser.parseFromString(`<html><body>${slidesHtml}</body></html>`, 'text/html');
  
  // Find all slide sections
  const slideElements = dom.getElementsByTagName('section');
  
  if (!slideElements || slideElements.length === 0) {
    throw new Error('No slide content found');
  }
  
  // Process each slide
  for (let i = 0; i < slideElements.length; i++) {
    const slideElement = slideElements[i];
    
    // Skip nested sections (vertical slides in Reveal.js)
    if (slideElement.parentNode && slideElement.parentNode.nodeName.toLowerCase() === 'section') {
      continue;
    }
    
    // Create a new slide
    const slide = pptx.addSlide({ masterName: 'SYDO_MASTER' });
    
    // Check for special slide classes
    const isTitle = slideElement.getAttribute('class')?.includes('title-slide');
    const isSectionTitle = slideElement.getAttribute('class')?.includes('section-title');
    
    // Find headings
    const h1Elements = slideElement.getElementsByTagName('h1');
    const h2Elements = slideElement.getElementsByTagName('h2');
    const h3Elements = slideElement.getElementsByTagName('h3');
    
    // Add title if found
    if (h1Elements.length > 0) {
      const titleText = h1Elements[0].textContent || '';
      slide.addText(titleText, {
        x: 0.5, y: 0.5, w: '95%', h: 1,
        fontSize: isTitle ? 44 : (isSectionTitle ? 40 : 36),
        color: colors.primary,
        bold: true,
        align: isTitle || isSectionTitle ? 'center' : 'left'
      });
    } else if (h2Elements.length > 0) {
      const titleText = h2Elements[0].textContent || '';
      slide.addText(titleText, {
        x: 0.5, y: 0.5, w: '95%', h: 1,
        fontSize: isSectionTitle ? 40 : 32,
        color: colors.primary,
        bold: true,
        align: isSectionTitle ? 'center' : 'left'
      });
    }
    
    // Add subtitle if exists and is title slide
    if (isTitle && h2Elements.length > 0) {
      const subtitleText = h2Elements[0].textContent || '';
      slide.addText(subtitleText, { 
        x: 0.5, y: 1.8, w: '95%', h: 0.8, 
        fontSize: 28, 
        color: colors.secondary,
        align: 'center'
      });
    }
    
    // Process content based on slide type
    if (!isTitle && !isSectionTitle) {
      let contentY = h1Elements.length > 0 || h2Elements.length > 0 ? 2 : 0.5;
      
      // Process paragraph content
      const paragraphs = slideElement.getElementsByTagName('p');
      for (let j = 0; j < paragraphs.length; j++) {
        const text = paragraphs[j].textContent || '';
        if (text.trim()) {
          slide.addText(text, {
            x: 0.5, y: contentY, w: '95%', h: 0.5,
            fontSize: 18,
            color: colors.text,
            align: 'left'
          });
          contentY += 0.7;
        }
      }
      
      // Process lists
      const ulElements = slideElement.getElementsByTagName('ul');
      for (let j = 0; j < ulElements.length; j++) {
        const listItems = ulElements[j].getElementsByTagName('li');
        const listContent: TextProps[] = Array.from(listItems).map(li => ({
          text: li.textContent || '',
          options: {}
        }));
        
        if (listContent.length > 0) {
          slide.addText(listContent, {
            x: 0.5, y: contentY, w: '95%', h: 0.5 * listContent.length,
            fontSize: 18,
            color: colors.text,
            bullet: { type: 'bullet' } // Removed color property as it's not supported
          });
          contentY += 0.6 * listContent.length;
        }
      }
      
      // Process ordered lists
      const olElements = slideElement.getElementsByTagName('ol');
      for (let j = 0; j < olElements.length; j++) {
        const listItems = olElements[j].getElementsByTagName('li');
        const listContent: TextProps[] = Array.from(listItems).map(li => ({
          text: li.textContent || '',
          options: {}
        }));
        
        if (listContent.length > 0) {
          slide.addText(listContent, {
            x: 0.5, y: contentY, w: '95%', h: 0.5 * listContent.length,
            fontSize: 18,
            color: colors.text,
            bullet: { type: 'number' } // Removed color property as it's not supported
          });
          contentY += 0.6 * listContent.length;
        }
      }
      
      // Process SVG diagrams
      const svgElements = slideElement.getElementsByTagName('svg');
      for (let j = 0; j < svgElements.length; j++) {
        const svgElement = svgElements[j];
        // Use XMLSerializer to get the serialized SVG string
        // Fix: Cast svgElement to Node type, which is what XMLSerializer expects
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement as Node);
        
        if (svgString) {
          try {
            const dataUrl = svgToDataUrl(svgString);
            slide.addImage({ 
              data: dataUrl, 
              x: 0.5, 
              y: contentY, 
              w: 9,
              h: 4
            });
            contentY += 4.5;
            
            // Look for caption
            const nextElement = svgElement.nextSibling;
            if (nextElement && 
                nextElement.nodeType === 1 && 
                ((nextElement as unknown) as Element).classList?.contains('diagram-caption')) {
              const captionText = nextElement.textContent || '';
              slide.addText(captionText, {
                x: 0.5, y: contentY, w: '95%', h: 0.5,
                fontSize: 14,
                color: colors.text,
                italic: true,
                align: 'center'
              });
              contentY += 0.7;
            }
          } catch (e) {
            console.error('Error processing SVG:', e);
          }
        }
      }
    }
  }
  
  // Use the correct interface for writeFile and cast the result appropriately
  // pptxgenjs actually returns a Promise<string | Blob | Buffer> depending on the outputType
  // Since we know we're requesting a Blob, we can safely cast the result
  const pptxBlob = await pptx.writeFile() as unknown as Blob;
  return pptxBlob;
};
