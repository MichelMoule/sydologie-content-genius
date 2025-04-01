
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
      (heading as HTMLElement).style.fontSize = '2.5em'; // Augmenter la taille des h1
      (heading as HTMLElement).style.marginBottom = '0.5em';
    });
    
    const h2Elements = slide.querySelectorAll('h2');
    h2Elements.forEach(heading => {
      (heading as HTMLElement).style.color = colors.primary;
      (heading as HTMLElement).style.fontSize = '2em'; // Augmenter la taille des h2
      (heading as HTMLElement).style.marginBottom = '0.4em';
    });
    
    const h3Elements = slide.querySelectorAll('h3');
    h3Elements.forEach(heading => {
      (heading as HTMLElement).style.color = colors.primary;
      (heading as HTMLElement).style.fontSize = '1.75em'; // Augmenter la taille des h3
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
