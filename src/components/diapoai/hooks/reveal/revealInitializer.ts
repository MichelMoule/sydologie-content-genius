
import Reveal from "reveal.js";
import { ThemeColors } from "../../types/ThemeColors";
import { applyCustomColors } from "./themeUtils";

// Import the plugins directly from reveal.js
import RevealHighlight from 'reveal.js/plugin/highlight/highlight';
import RevealNotes from 'reveal.js/plugin/notes/notes';
import RevealMarkdown from 'reveal.js/plugin/markdown/markdown';
import RevealZoom from 'reveal.js/plugin/zoom/zoom';
import RevealMath from 'reveal.js/plugin/math/math';

interface RevealInitConfig {
  container: HTMLElement | null;
  slidesHtml: string;
  colors: ThemeColors;
  transition: string;
}

/**
 * Initializes Reveal.js with the given configuration.
 *
 * @param {RevealInitConfig} config - The configuration object for Reveal.js.
 */
export const initializeReveal = (config: RevealInitConfig) => {
  if (!config.container) {
    console.warn('Reveal.js container not found.');
    return null;
  }

  const deck = new Reveal({
    embedded: true,
    width: "100%",
    height: "100%",
    margin: 0.1,
    autoAnimateDuration: 0.8,
    autoAnimateEasing: 'ease-in-out',
    transition: config.transition,
    backgroundTransition: 'fade',
    plugins: [RevealHighlight, RevealNotes, RevealMarkdown, RevealZoom, RevealMath],
    chart: {
      defaults: {
        color: config.colors.text,
        scale: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          grid: { color: `${config.colors.primary}33` }
        },
      },
      line: { borderColor: [config.colors.primary, config.colors.secondary, `${config.colors.primary}88`] },
      bar: { backgroundColor: [config.colors.primary, config.colors.secondary, `${config.colors.primary}88`] },
      pie: { backgroundColor: [[config.colors.primary, config.colors.secondary, `${config.colors.primary}88`, `${config.colors.secondary}88`]] },
    },
  });

  // Initialize Reveal
  deck.initialize().then(() => {
    // Apply custom theme colors
    applyCustomColors(deck, config.colors);

    // Set content AFTER Reveal is initialized
    if (config.slidesHtml) {
      deck.getSlidesElement().innerHTML = config.slidesHtml;
    }

    deck.layout();
    deck.sync();
  });

  return deck;
};

/**
 * Safely destroys a Reveal.js instance if it exists.
 */
export const safeDestroyReveal = (deck: any) => {
  if (deck && typeof deck.destroy === 'function') {
    try {
      deck.destroy();
    } catch (error) {
      console.error('Error destroying Reveal.js instance:', error);
    }
  }
};
