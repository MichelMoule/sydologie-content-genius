
import { ThemeColors } from "../../pptx/types";

/**
 * Applies theme colors to the slides
 */
export const applyThemeColors = (container: HTMLDivElement, colors: ThemeColors) => {
  const slides = container.querySelectorAll('.slides section');
  slides.forEach(slide => {
    // Apply colors to headings with larger font sizes
    const h1Elements = slide.querySelectorAll('h1');
    h1Elements.forEach(heading => {
      (heading as HTMLElement).style.color = colors.primary;
      (heading as HTMLElement).style.fontSize = '2.7em'; // Increased font size
      (heading as HTMLElement).style.marginBottom = '0.3em'; // Reduced margin to keep content closer
      (heading as HTMLElement).style.marginTop = '0.2em';
    });
    
    const h2Elements = slide.querySelectorAll('h2');
    h2Elements.forEach(heading => {
      (heading as HTMLElement).style.color = colors.primary;
      (heading as HTMLElement).style.fontSize = '2.2em'; // Increased font size
      (heading as HTMLElement).style.marginBottom = '0.3em'; // Reduced margin to keep content closer
      (heading as HTMLElement).style.marginTop = '0.2em';
    });
    
    const h3Elements = slide.querySelectorAll('h3');
    h3Elements.forEach(heading => {
      (heading as HTMLElement).style.color = colors.primary;
      (heading as HTMLElement).style.fontSize = '1.8em';
      (heading as HTMLElement).style.marginBottom = '0.2em'; // Reduced margin to keep content closer
      (heading as HTMLElement).style.marginTop = '0.1em';
    });
    
    // Ensure paragraphs stay close to headings
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => {
      (p as HTMLElement).style.marginTop = '0.3em';
      (p as HTMLElement).style.marginBottom = '0.5em';
      (p as HTMLElement).style.fontSize = '1.5em'; // Larger text for better readability
    });
    
    // Ensure lists stay close to headings
    const lists = slide.querySelectorAll('ul, ol');
    lists.forEach(list => {
      (list as HTMLElement).style.marginTop = '0.3em';
      (list as HTMLElement).style.marginBottom = '0.5em';
    });
    
    // Make list items more readable
    const listItems = slide.querySelectorAll('li');
    listItems.forEach(item => {
      (item as HTMLElement).style.fontSize = '1.4em';
      (item as HTMLElement).style.marginBottom = '0.2em';
    });
    
    // Apply styles specific to slide classes
    if (slide.classList.contains('section-title')) {
      (slide as HTMLElement).style.background = `linear-gradient(135deg, ${colors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
    } else if (slide.classList.contains('title-slide')) {
      (slide as HTMLElement).style.background = '#f8f8f8';
    } else {
      (slide as HTMLElement).style.background = colors.background;
    }
  });
};
