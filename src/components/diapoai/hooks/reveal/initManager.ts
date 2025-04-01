
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
    if (slidesContainer) {
      // Force section tags to be direct children of .slides
      const sections = Array.from(slidesContainer.querySelectorAll('section'));
      sections.forEach(section => {
        if (section.parentElement !== slidesContainer) {
          slidesContainer.appendChild(section);
        }
      });
      
      // If no sections, create at least one
      if (sections.length === 0) {
        const content = slidesContainer.innerHTML;
        slidesContainer.innerHTML = `<section>${content}</section>`;
      }
    }
    
    // Initialize Reveal
    const deck = new Reveal(container, config);
    await deck.initialize();
    
    // Sync after initialization to ensure correct slide rendering
    setTimeout(() => {
      if (deck && deck.sync) {
        deck.sync();
      }
    }, 200);
    
    console.log('Reveal.js initialized successfully');
    return deck;
  } catch (error) {
    console.error('Error initializing Reveal.js:', error);
    return null;
  }
};
