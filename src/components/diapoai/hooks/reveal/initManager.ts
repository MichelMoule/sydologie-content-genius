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
    // Vérification rapide si l'initialisation est vraiment nécessaire
    const colorsMatch = JSON.stringify(colors) === JSON.stringify(initCache.lastColors);
    
    // Si les couleurs et la configuration n'ont pas changé, on ne réinitialise pas
    if (colorsMatch && initCache.lastConfig?.transition === transition) {
      console.log('Skipping initialization - no change in config');
      return document.querySelector('.reveal')['Reveal']; // Return existing instance
    }
    
    // Mise à jour du cache
    initCache.lastColors = {...colors};
    
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
    initCache.lastConfig = {...config};
    
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
  
  // Ensure each section has proper structure
  const normalizedSections = slidesContainer.querySelectorAll('section');
  normalizedSections.forEach((section, index) => {
    if (!section.id) {
      section.id = `slide-${index}`;
    }
    
    // Keep h1, h2, and h3 with their content together
    const headings = section.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
      const wrapper = document.createElement('div');
      wrapper.className = 'heading-content-group';
      wrapper.style.cssText = 'page-break-inside: avoid; display: block;';
      
      // Insert wrapper before heading
      heading.parentNode?.insertBefore(wrapper, heading);
      
      // Move heading into wrapper
      wrapper.appendChild(heading);
      
      // Move next sibling (content after heading) into wrapper if it exists
      let nextElement = wrapper.nextSibling;
      if (nextElement && 
         nextElement.nodeName !== 'H1' && 
         nextElement.nodeName !== 'H2' && 
         nextElement.nodeName !== 'H3') {
        wrapper.appendChild(nextElement);
      }
    });
    
    // Ensure proper styling for content within each slide
    (section as HTMLElement).style.minHeight = '400px';
    (section as HTMLElement).style.height = 'auto';
    (section as HTMLElement).style.display = 'flex';
    (section as HTMLElement).style.flexDirection = 'column';
    (section as HTMLElement).style.padding = '15px';
  });
};
