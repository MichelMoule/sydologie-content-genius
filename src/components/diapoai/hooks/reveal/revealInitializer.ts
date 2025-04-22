
import { ThemeColors } from "../../pptx/types";
import { applyThemeColors } from "./themeUtils";
import { createRevealConfig } from "./config";
import { normalizeSlideStructure } from "./slideStructureManager";

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

// Cache for avoiding redundant reinitializations
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
    // Anti-bounce: skip if initialization occurred less than 2 seconds ago
    const now = Date.now();
    if (now - initCache.lastInit < 2000) {
      console.log('Limiting re-initialization frequency');
      return document.querySelector('.reveal')['Reveal']; // Return existing instance
    }
    
    // Update last initialization timestamp
    initCache.lastInit = now;
    
    // Get the Reveal constructor
    const Reveal = (window as any).Reveal;
    
    if (!Reveal) {
      console.error('Reveal.js not found in window object');
      return null;
    }
    
    // Apply theme colors
    applyThemeColors(container, colors);
    
    // Create configuration
    const config = createRevealConfig(transition);
    
    // Ensure slides structure exists
    const slidesContainer = container.querySelector('.slides');
    if (!slidesContainer) {
      console.error('No slides container found');
      return null;
    }
    
    // Normalize slide structure before initialization
    normalizeSlideStructure(slidesContainer);
    
    // Initialize Reveal
    const deck = new Reveal(container, config);
    
    // Handle initialization with Promise
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
    
    // Mark as initialized
    container['_revealInitialized'] = true;
    
    return deck;
  } catch (error) {
    console.error('Error initializing Reveal.js:', error);
    return null;
  }
};

