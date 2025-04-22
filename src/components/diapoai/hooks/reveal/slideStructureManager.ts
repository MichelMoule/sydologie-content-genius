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
    const tagName = node.nodeName.toLowerCase();
    
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
  
  // Append all processed sections to the slides container
  slidesContainer.appendChild(fragment);
  
  console.log(`Created ${slidesContainer.childNodes.length} slide sections`);
  
  // Ensure all sections are properly styled
  ensureSectionStyling(Array.from(slidesContainer.querySelectorAll('section')));
};
