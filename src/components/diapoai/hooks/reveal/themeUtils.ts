import { ThemeColors } from "../../types/ThemeColors";

/**
 * Applies theme colors to the slides
 */
export const applyThemeColors = (container: HTMLDivElement, colors: ThemeColors) => {
  if (!container) return;
  
  try {
    console.log("Applying theme colors to slides");
    
    // Make sure the container has the correct class
    container.classList.add('reveal');
    
    // Set background color for the container itself
    container.style.backgroundColor = colors.background || '#FFFFFF';
    
    const slides = container.querySelectorAll('.slides section');
    if (slides.length === 0) {
      console.warn("No slides found for applying theme colors");
    }
    
    slides.forEach((slide, index) => {
      // Set background for slide
      (slide as HTMLElement).style.background = colors.background || '#FFFFFF';
      (slide as HTMLElement).style.color = colors.text || '#333333';
      console.log(`Applying colors to slide ${index + 1}`);
      
      // Apply colors to headings
      const h1Elements = slide.querySelectorAll('h1');
      h1Elements.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
        (heading as HTMLElement).style.fontSize = '2.5em';
        (heading as HTMLElement).style.marginBottom = '0.2em';
        (heading as HTMLElement).style.marginTop = '0.1em';
      });
      
      const h2Elements = slide.querySelectorAll('h2');
      h2Elements.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
        (heading as HTMLElement).style.fontSize = '2.0em';
        (heading as HTMLElement).style.marginBottom = '0.2em';
        (heading as HTMLElement).style.marginTop = '0.1em';
      });
      
      const h3Elements = slide.querySelectorAll('h3');
      h3Elements.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
        (heading as HTMLElement).style.fontSize = '1.7em';
        (heading as HTMLElement).style.marginBottom = '0.15em';
        (heading as HTMLElement).style.marginTop = '0.1em';
      });
      
      // Apply styles to paragraphs
      const paragraphs = slide.querySelectorAll('p');
      paragraphs.forEach(p => {
        (p as HTMLElement).style.color = colors.text;
        (p as HTMLElement).style.marginTop = '0.1em';
        (p as HTMLElement).style.marginBottom = '0.2em';
        (p as HTMLElement).style.fontSize = '1.3em';
        (p as HTMLElement).style.lineHeight = '1.3';
        (p as HTMLElement).style.opacity = '1';
        (p as HTMLElement).style.visibility = 'visible';
      });
      
      // Apply styles to lists
      const lists = slide.querySelectorAll('ul, ol');
      lists.forEach(list => {
        (list as HTMLElement).style.marginTop = '0.1em';
        (list as HTMLElement).style.marginBottom = '0.2em';
        (list as HTMLElement).style.paddingLeft = '1.5em';
      });
      
      // Apply styles to list items
      const listItems = slide.querySelectorAll('li');
      listItems.forEach(item => {
        (item as HTMLElement).style.color = colors.text;
        (item as HTMLElement).style.fontSize = '1.3em';
        (item as HTMLElement).style.marginBottom = '0.1em';
        (item as HTMLElement).style.lineHeight = '1.3';
        (item as HTMLElement).style.opacity = '1';
        (item as HTMLElement).style.visibility = 'visible';
      });
      
      // Apply special styles for specific slide types
      if (slide.classList.contains('section-title')) {
        (slide as HTMLElement).style.background = `linear-gradient(135deg, ${colors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
      } else if (slide.classList.contains('title-slide')) {
        (slide as HTMLElement).style.background = '#f8f8f8';
      }
    });
    
    console.log("Theme colors applied successfully");
  } catch (error) {
    console.error("Error applying theme colors:", error);
  }
};

/**
 * Apply custom colors to the Reveal.js deck
 */
export const applyCustomColors = (deck: any, colors: ThemeColors, container?: HTMLElement | null) => {
  // If container is directly provided, use it
  if (container) {
    const revealContainer = container.querySelector('.reveal') as HTMLDivElement || container as HTMLDivElement;
    applyThemeColors(revealContainer, colors);
    return;
  }
  
  // Otherwise, try to get slides element from deck
  if (!deck || !deck.getRevealElement) return;
  
  try {
    const revealElement = deck.getRevealElement();
    if (revealElement) {
      applyThemeColors(revealElement as HTMLDivElement, colors);
      
      // Force a layout update if deck is available
      if (deck && deck.layout) {
        deck.layout();
      }
    }
  } catch (error) {
    console.error("Error in applyCustomColors:", error);
  }
};
