import { createRevealConfig } from "./config";
import { applyThemeColors } from "./themeUtils";
import { ThemeColors } from "../../pptx/types";

/**
 * Handles safe destruction of an existing Reveal.js instance
 */
export const safeDestroyReveal = (deck: any) => {
  if (deck) {
    try {
      console.log('Safely destroying Reveal.js deck');
      deck.destroy();
    } catch (e) {
      console.warn('Error while destroying Reveal.js deck:', e);
      // Continue despite the error
    }
  }
};

// Cache pour éviter les réinitialisations redondantes
const initCache = {
  lastConfig: null as any,
  lastColors: null as ThemeColors | null,
  lastInit: 0,
  contentHash: null as string | null,
};

/**
 * Initializes Reveal.js with the given configuration
 */
export const initializeReveal = async (
  container: HTMLDivElement, 
  colors: ThemeColors,
  transition: string
): Promise<any> => {
  try {
    // Anti-rebond: si une initialisation a eu lieu il y a moins de 2 secondes, ignorer
    const now = Date.now();
    if (now - initCache.lastInit < 2000) {
      console.log('Limiting re-initialization frequency');
      return document.querySelector('.reveal')['Reveal']; // Return existing instance
    }
    
    // Mise à jour de l'horodatage de la dernière initialisation
    initCache.lastInit = now;
    
    // Get the Reveal constructor from the window object
    const Reveal = (window as any).Reveal;
    
    if (!Reveal) {
      console.error('Reveal.js not found in window object');
      return null;
    }
    
    // Apply theme colors
    applyThemeColors(container, colors);
    
    // Create configuration
    const config = createRevealConfig(transition);
    
    // Ensure slides structure is correct before initialization
    const slidesContainer = container.querySelector('.slides');
    if (!slidesContainer) {
      console.error('No slides container found');
      return null;
    }
    
    // Normalize slide structure - critical for consistent behavior
    normalizeSlideStructure(slidesContainer);
    
    // Initialize Reveal
    const deck = new Reveal(container, config);
    
    // Use a Promise to handle initialization
    await new Promise<void>((resolve) => {
      deck.initialize().then(() => {
        console.log('Reveal.js initialized successfully');
        
        // Force visibility of all slides after initialization
        setTimeout(() => {
          try {
            const sections = container.querySelectorAll('.slides section');
            sections.forEach((section) => {
              (section as HTMLElement).style.visibility = 'visible';
              (section as HTMLElement).style.opacity = '1';
              (section as HTMLElement).style.display = 'flex';
              (section as HTMLElement).style.overflow = 'visible';
            });
            
            // Force sync and go to first slide
            deck.sync();
            deck.slide(0);
          } catch (e) {
            console.warn('Error during post-init adjustments:', e);
          }
        }, 200);
        
        resolve();
      }).catch((error: any) => {
        console.error('Error in Reveal.js initialization promise:', error);
        resolve(); // Continue despite error
      });
    });
    
    // Set initialized flag on the DOM element to prevent duplicate initialization
    container['_revealInitialized'] = true;
    
    return deck;
  } catch (error) {
    console.error('Error initializing Reveal.js:', error);
    return null;
  }
};

/**
 * Ensures proper slide structure for consistent behavior
 */
const normalizeSlideStructure = (slidesContainer: Element) => {
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

/**
 * Apply proper styling to sections to ensure visibility
 */
const ensureSectionStyling = (sections: Element[]) => {
  sections.forEach((section, index) => {
    if (!section.id) {
      section.id = `slide-${index + 1}`;
    }
    
    applyProperSectionStyling(section);
    
    // Group heading with following content
    groupHeadingWithContent(section);
  });
};

/**
 * Apply critical styling to a section
 */
const applyProperSectionStyling = (section: Element) => {
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

/**
 * Group heading with following content to prevent separation
 */
const groupHeadingWithContent = (section: Element) => {
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
