/**
 * Handles the normalization and structural organization of slides
 */

import { ensureSectionStyling, applyProperSectionStyling } from './styleManager';

export const normalizeSlideStructure = (slidesContainer: Element) => {
  // Get all direct children of slides container
  const children = Array.from(slidesContainer.children);
  
  // If no children, nothing to normalize
  if (children.length === 0) {
    console.warn("No slides content to normalize");
    return;
  }
  
  console.log(`Normalizing ${children.length} slide elements`);
  
  // Check if we have proper section tags
  const sections = children.filter(child => child.nodeName.toLowerCase() === 'section');
  
  // If all children are sections, we're good
  if (sections.length === children.length && sections.length > 0) {
    console.log("All slides already have proper section tags");
    // Just ensure each section is properly styled
    ensureSectionStyling(sections);
    return;
  }
  
  console.log("Restructuring content into proper slides");
  
  // We need to restructure the content into proper slides
  
  // First, clear the container
  const tempContent = slidesContainer.innerHTML;
  slidesContainer.innerHTML = '';
  
  // Check if content has any section tags
  if (tempContent.includes('<section')) {
    // Content has some section tags, but not for all elements
    // We'll just set it back and ensure each section is styled
    slidesContainer.innerHTML = tempContent;
    const newSections = Array.from(slidesContainer.querySelectorAll('section'));
    ensureSectionStyling(newSections);
    console.log(`Preserved ${newSections.length} existing section tags`);
    return;
  }
  
  // Content has no section tags, wrap everything in sections
  console.log("Wrapping content in section tags");
  
  // Create a document fragment to build the new structure
  const fragment = document.createDocumentFragment();
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = tempContent;
  
  // Process containers that might indicate slide divisions
  const potentialContainers = tempDiv.querySelectorAll('.slide-content, .section-title, .title-slide, .section-container');
  
  if (potentialContainers.length > 0) {
    console.log(`Found ${potentialContainers.length} potential slide containers`);
    
    // These are likely designed to be individual slides already
    potentialContainers.forEach((container) => {
      const section = document.createElement('section');
      section.id = `slide-${fragment.childNodes.length + 1}`;
      applyProperSectionStyling(section);
      
      // Move the content to the section
      section.appendChild(container.cloneNode(true));
      fragment.appendChild(section);
    });
  } else {
    // Group content by headings or create sections for each logical block
    const createNewSection = () => {
      const section = document.createElement('section');
      section.id = `slide-${fragment.childNodes.length + 1}`;
      applyProperSectionStyling(section);
      return section;
    };
    
    let currentSection = createNewSection();
    let currentHeading = null;
    
    // Process each node
    Array.from(tempDiv.childNodes).forEach((node, index) => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        currentSection.appendChild(node.cloneNode(true));
        return;
      }
      
      const element = node as Element;
      const tagName = element.nodeName.toLowerCase();
      
      // Start a new section for each heading
      if (tagName === 'h1' || tagName === 'h2' || (tagName === 'h3' && !currentHeading)) {
        // If we already have content in the current section, add it to the fragment
        if (currentSection.childNodes.length > 0) {
          fragment.appendChild(currentSection);
        }
        
        // Create a new section
        currentSection = createNewSection();
        currentHeading = node;
        
        // Add the heading to the section
        currentSection.appendChild(node.cloneNode(true));
      }
      // For the last node, or if we have accumulated many nodes, finalize the section
      else if (index === tempDiv.childNodes.length - 1 || currentSection.childNodes.length > 10) {
        currentSection.appendChild(node.cloneNode(true));
        fragment.appendChild(currentSection);
        currentSection = createNewSection();
      }
      // Otherwise just add to the current section
      else {
        currentSection.appendChild(node.cloneNode(true));
      }
    });
    
    // Add the last section if it has content
    if (currentSection.childNodes.length > 0) {
      fragment.appendChild(currentSection);
    }
  }
  
  // Append all processed sections to the slides container
  slidesContainer.appendChild(fragment);
  
  console.log(`Created ${slidesContainer.childNodes.length} slide sections`);
  
  // Ensure all sections are properly styled
  ensureSectionStyling(Array.from(slidesContainer.querySelectorAll('section')));
};

// New function to structure slides based on outline
export const structureSlidesByOutline = (slidesHtml: string, outline: any[]) => {
  if (!outline || outline.length === 0) {
    console.warn("No outline provided for structuring slides");
    return slidesHtml;
  }
  
  // Create a temporary container to work with the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = slidesHtml;
  
  // Check if we already have properly structured content
  if (tempDiv.querySelector('.slides-by-outline')) {
    console.log("Slides are already structured by outline");
    return slidesHtml;
  }
  
  const result = document.createElement('div');
  result.className = 'slides-by-outline';
  
  // Add title slide if it exists
  const titleSlide = tempDiv.querySelector('.title-slide');
  if (titleSlide) {
    const sectionElem = document.createElement('section');
    sectionElem.className = 'title-slide-section';
    sectionElem.appendChild(titleSlide.cloneNode(true));
    result.appendChild(sectionElem);
  } else {
    // Create a default title slide if none exists
    const sectionElem = document.createElement('section');
    sectionElem.className = 'title-slide-section';
    const defaultTitle = document.createElement('div');
    defaultTitle.className = 'title-slide';
    defaultTitle.innerHTML = `<h1>Présentation</h1><h3>Généré par DiapoAI</h3>`;
    sectionElem.appendChild(defaultTitle);
    result.appendChild(sectionElem);
  }
  
  // Process each section in the outline
  outline.forEach((section, sectionIndex) => {
    // Section title slide
    const sectionTitleElem = document.createElement('section');
    sectionTitleElem.className = 'section-title';
    sectionTitleElem.innerHTML = `<h2>${section.section}</h2>`;
    result.appendChild(sectionTitleElem);
    
    // Find content for each subsection
    section.subsections.forEach((subsection, subsectionIndex) => {
      // Create a slide for this subsection
      const subsectionElem = document.createElement('section');
      subsectionElem.id = `slide-section-${sectionIndex}-subsection-${subsectionIndex}`;
      
      // Try to find content for this subsection
      const subsectionContent = findContentForSubsection(tempDiv, subsection);
      
      if (subsectionContent) {
        subsectionElem.appendChild(subsectionContent);
      } else {
        // Default content if nothing specific is found
        subsectionElem.innerHTML = `<h3>${subsection}</h3><p>Contenu à venir...</p>`;
      }
      
      result.appendChild(subsectionElem);
    });
  });
  
  return result.outerHTML;
};

// Helper function to find content matching a subsection title
function findContentForSubsection(container: HTMLElement, subsectionTitle: string): HTMLElement | null {
  // First try to find an exact match for the subsection heading
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4'));
  
  for (const heading of headings) {
    if (heading.textContent?.trim().toLowerCase() === subsectionTitle.toLowerCase()) {
      // We found a matching heading, now collect all content until the next heading
      const content = document.createElement('div');
      content.appendChild(heading.cloneNode(true));
      
      let currentNode = heading.nextSibling;
      while (currentNode) {
        if (currentNode.nodeName.match(/^H[1-4]$/i)) {
          break; // Stop at the next heading
        }
        const nextNode = currentNode.nextSibling;
        content.appendChild(currentNode.cloneNode(true));
        currentNode = nextNode;
      }
      
      return content;
    }
  }
  
  // If no exact match, try to find content that contains the subsection title
  const allElements = Array.from(container.querySelectorAll('*'));
  for (const elem of allElements) {
    if (elem.textContent?.toLowerCase().includes(subsectionTitle.toLowerCase())) {
      const section = findClosestSection(elem);
      if (section) {
        return section.cloneNode(true) as HTMLElement;
      }
      return elem.cloneNode(true) as HTMLElement;
    }
  }
  
  return null;
}

// Helper to find the closest section or container for an element
function findClosestSection(elem: Element): HTMLElement | null {
  let current = elem;
  while (current.parentElement) {
    if (current.classList.contains('slide-content') || 
        current.classList.contains('section-content') ||
        current.nodeName.toLowerCase() === 'section') {
      return current as HTMLElement;
    }
    current = current.parentElement;
  }
  return null;
}
