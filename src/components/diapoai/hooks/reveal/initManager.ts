
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

/**
 * Initializes Reveal.js with the given configuration
 */
export const initializeReveal = async (
  container: HTMLDivElement, 
  colors: ThemeColors,
  transition: string
): Promise<any> => {
  try {
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
    await deck.initialize();
    
    // Sync after initialization to ensure correct slide rendering
    // Use a longer timeout to ensure all content is properly rendered
    setTimeout(() => {
      if (deck && deck.sync) {
        deck.sync();
        deck.slide(0); // Ensure we start at the first slide
        
        // Force layout recalculation
        setTimeout(() => {
          if (deck && deck.layout) {
            deck.layout();
          }
        }, 300);
      }
    }, 500);
    
    console.log('Reveal.js initialized successfully');
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
  // Get all content in the slides container
  const content = slidesContainer.innerHTML;
  
  // Check if we have proper section tags
  const sections = Array.from(slidesContainer.querySelectorAll('section'));
  
  // If there are no sections or some sections aren't direct children, restructure
  if (sections.length === 0 || sections.some(section => section.parentElement !== slidesContainer)) {
    // Clear the container
    slidesContainer.innerHTML = '';
    
    // Create sections from the content if necessary
    if (sections.length === 0) {
      // If no sections exist, wrap all content in a single section
      slidesContainer.innerHTML = `<section>${content}</section>`;
    } else {
      // If sections exist but structure is wrong, fix it
      sections.forEach(section => {
        // Create a new section at the root level with the content of the original section
        const newSection = document.createElement('section');
        newSection.innerHTML = section.innerHTML;
        newSection.className = section.className;
        
        // Add each section directly to the slides container
        slidesContainer.appendChild(newSection);
      });
    }
  }
  
  // Ensure each section has a unique ID for navigation
  const normalizedSections = slidesContainer.querySelectorAll('section');
  normalizedSections.forEach((section, index) => {
    if (!section.id) {
      section.id = `slide-${index}`;
    }
    
    // Ensure proper styling for content within each slide
    (section as HTMLElement).style.minHeight = '400px';
    (section as HTMLElement).style.height = 'auto';
    (section as HTMLElement).style.display = 'flex';
    (section as HTMLElement).style.flexDirection = 'column';
    (section as HTMLElement).style.padding = '20px';
  });
};
