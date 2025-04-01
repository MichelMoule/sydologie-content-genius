
import { ThemeColors } from "../../pptx/types";

/**
 * Applies theme colors to the slides
 */
export const applyThemeColors = (container: HTMLDivElement, colors: ThemeColors) => {
  const slides = container.querySelectorAll('.slides section');
  slides.forEach(slide => {
    // Apply colors to headings
    const headings = slide.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
      (heading as HTMLElement).style.color = colors.primary;
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
