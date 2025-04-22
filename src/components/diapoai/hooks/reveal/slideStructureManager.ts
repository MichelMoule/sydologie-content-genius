
/**
 * Handles the normalization and structural organization of slides
 */

import { ensureSectionStyling, applyProperSectionStyling } from './styleManager';

export const normalizeSlideStructure = (slidesContainer: Element) => {
  // Get all direct children of slides container
  const children = Array.from(slidesContainer.children);
  
  // If no children, nothing to normalize
  if (children.length === 0) return;
  
  // Check if we have proper section tags
  const sections = children.filter(child => child.nodeName.toLowerCase() === 'section');
  
  // If all children are sections, we're good
  if (sections.length === children.length) {
    // Just ensure each section is properly styled
    ensureSectionStyling(sections);
    return;
  }
  
  // We need to restructure the content into proper slides
  
  // First, clear the container
  slidesContainer.innerHTML = '';
  
  // Group content properly by headers
  let currentSection: HTMLElement | null = null;
  let currentHeading: Element | null = null;
  
  // Create section for each logical grouping
  for (const child of children) {
    const tagName = child.nodeName.toLowerCase();
    
    // If it's a heading, start a new section
    if (tagName === 'h1' || tagName === 'h2' || (tagName === 'h3' && !currentHeading)) {
      // Create a new section
      currentSection = document.createElement('section');
      currentSection.id = `slide-${sections.length + 1}`;
      
      // Set proper styling to ensure content display
      applyProperSectionStyling(currentSection);
      
      // Add to slides container
      slidesContainer.appendChild(currentSection);
      
      // Remember this is our current heading
      currentHeading = child;
      
      // Add the heading to the section
      currentSection.appendChild(child.cloneNode(true));
    } 
    // Otherwise add to current section
    else if (currentSection) {
      currentSection.appendChild(child.cloneNode(true));
    } 
    // If no section exists yet, create one
    else {
      currentSection = document.createElement('section');
      currentSection.id = `slide-${sections.length + 1}`;
      applyProperSectionStyling(currentSection);
      slidesContainer.appendChild(currentSection);
      currentSection.appendChild(child.cloneNode(true));
    }
  }
  
  // Ensure all sections are properly styled
  ensureSectionStyling(Array.from(slidesContainer.querySelectorAll('section')));
};
