
import { themes } from "reveal.js/dist/reveal.esm.js";
import { ThemeColors } from "../../types/ThemeColors";

/**
 * Applies theme colors to the slides
 */
export const applyThemeColors = (container: HTMLDivElement, colors: ThemeColors) => {
  const slides = container.querySelectorAll('.slides section');
  slides.forEach(slide => {
    // Set background for slide
    (slide as HTMLElement).style.background = colors.background;
    
    // Make sure the slide content is structured properly
    if (slide.children.length > 0) {
      // Apply colors to headings with appropriate font sizes but reduced margins
      const h1Elements = slide.querySelectorAll('h1');
      h1Elements.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
        (heading as HTMLElement).style.fontSize = '2.5em'; // Slightly reduced for more content
        (heading as HTMLElement).style.marginBottom = '0.2em'; // Reduced spacing
        (heading as HTMLElement).style.marginTop = '0.1em'; // Reduced spacing
      });
      
      const h2Elements = slide.querySelectorAll('h2');
      h2Elements.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
        (heading as HTMLElement).style.fontSize = '2.0em'; // Slightly reduced for more content
        (heading as HTMLElement).style.marginBottom = '0.2em'; // Reduced spacing
        (heading as HTMLElement).style.marginTop = '0.1em'; // Reduced spacing
      });
      
      const h3Elements = slide.querySelectorAll('h3');
      h3Elements.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
        (heading as HTMLElement).style.fontSize = '1.7em'; // Slightly reduced for more content
        (heading as HTMLElement).style.marginBottom = '0.15em'; // Reduced spacing
        (heading as HTMLElement).style.marginTop = '0.1em'; // Reduced spacing
      });
    }
    
    // Ensure paragraphs stay VERY close to headings
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => {
      (p as HTMLElement).style.marginTop = '0.1em'; // Minimized spacing
      (p as HTMLElement).style.marginBottom = '0.2em'; // Minimized spacing
      (p as HTMLElement).style.fontSize = '1.3em'; // Slightly smaller for more content per slide
      (p as HTMLElement).style.lineHeight = '1.3'; // Tighter line height
    });
    
    // Ensure lists stay close to headings with tighter spacing
    const lists = slide.querySelectorAll('ul, ol');
    lists.forEach(list => {
      (list as HTMLElement).style.marginTop = '0.1em'; // Minimized spacing
      (list as HTMLElement).style.marginBottom = '0.2em'; // Minimized spacing
      (list as HTMLElement).style.paddingLeft = '1.5em'; // Reduced indent
    });
    
    // Make list items more compact
    const listItems = slide.querySelectorAll('li');
    listItems.forEach(item => {
      (item as HTMLElement).style.fontSize = '1.3em'; // Slightly smaller
      (item as HTMLElement).style.marginBottom = '0.1em'; // Minimized spacing
      (item as HTMLElement).style.lineHeight = '1.3'; // Tighter line height
    });
    
    // Apply styles specific to slide classes
    if (slide.classList.contains('section-title')) {
      (slide as HTMLElement).style.background = `linear-gradient(135deg, ${colors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
    } else if (slide.classList.contains('title-slide')) {
      (slide as HTMLElement).style.background = '#f8f8f8';
    }
  });
};

/**
 * Apply custom colors to the Reveal.js deck
 */
export const applyCustomColors = (deck: any, colors: ThemeColors) => {
  if (!deck || !deck.getSlidesElement) return;
  
  const slidesContainer = deck.getSlidesElement();
  if (slidesContainer) {
    applyThemeColors(slidesContainer, colors);
    
    // Force a layout update
    deck.layout();
  }
};
