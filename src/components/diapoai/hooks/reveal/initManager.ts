
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
    
    // Initialize Reveal
    const deck = new Reveal(container, config);
    await deck.initialize();
    
    console.log('Reveal.js initialized successfully');
    return deck;
  } catch (error) {
    console.error('Error initializing Reveal.js:', error);
    return null;
  }
};
