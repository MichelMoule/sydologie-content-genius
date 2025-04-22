import { themes } from "reveal.js/dist/reveal.esm.js";
import { ThemeColors } from "../../types/ThemeColors";
import { applyCustomColors } from "./themeUtils";

interface RevealInitConfig {
  container: HTMLElement | null;
  slidesHtml: string;
  themeColors: ThemeColors;
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
    plugins: [ RevealHighlight, RevealNotes, RevealMarkdown, RevealZoom, RevealMath, RevealAnimate, RevealChart ],
    chart: {
      defaults: {
        color: config.themeColors.text,
        scale: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
          grid: { color: `${config.themeColors.primary}33` }
        },
      },
      line: { borderColor: [config.themeColors.primary, config.themeColors.secondary, `${config.themeColors.primary}88`] },
      bar: { backgroundColor: [config.themeColors.primary, config.themeColors.secondary, `${config.themeColors.primary}88`] },
      pie: { backgroundColor: [[config.themeColors.primary, config.themeColors.secondary, `${config.themeColors.primary}88`, `${config.themeColors.secondary}88`]] },
    },
  });

  // Initialize Reveal
  deck.initialize().then(() => {
    // Apply custom theme colors
    applyCustomColors(deck, config.themeColors);

    // Set content AFTER Reveal is initialized
    if (config.slidesHtml) {
      deck.getSlidesElement().innerHTML = config.slidesHtml;
    }

    deck.layout();
    deck.sync();
  });

  return deck;
};

