/**
 * Manages the styling of slide sections
 */

export const ensureSectionStyling = (sections: Element[]) => {
  sections.forEach((section, index) => {
    if (!section.id) {
      section.id = `slide-${index + 1}`;
    }
    
    applyProperSectionStyling(section);
    
    // Group heading with following content
    groupHeadingWithContent(section);
  });
};

export const applyProperSectionStyling = (section: Element) => {
  const sectionElem = section as HTMLElement;
  sectionElem.style.minHeight = '400px';
  sectionElem.style.height = 'auto';
  sectionElem.style.display = 'flex';
  sectionElem.style.flexDirection = 'column';
  sectionElem.style.padding = '15px';
  sectionElem.style.visibility = 'visible';
  sectionElem.style.opacity = '1';
  sectionElem.style.overflow = 'visible';
};

export const groupHeadingWithContent = (section: Element) => {
  // Find all headings in this section
  const headings = section.querySelectorAll('h1, h2, h3');
  
  headings.forEach(heading => {
    // Create a wrapper to keep heading with its content
    const wrapper = document.createElement('div');
    wrapper.className = 'heading-content-group';
    wrapper.style.cssText = 'page-break-inside: avoid; display: block; width: 100%; overflow: visible;';
    
    // Insert wrapper before heading
    heading.parentNode?.insertBefore(wrapper, heading);
    
    // Move heading into wrapper
    wrapper.appendChild(heading);
    
    // Find content elements that should stay with this heading
    let nextElement = wrapper.nextElementSibling;
    
    // Keep adding elements to wrapper until we hit another heading
    while (nextElement && 
          !['H1', 'H2', 'H3'].includes(nextElement.nodeName)) {
      const current = nextElement;
      nextElement = nextElement.nextElementSibling;
      wrapper.appendChild(current);
    }
  });
};
