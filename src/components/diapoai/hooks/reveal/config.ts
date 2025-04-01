/**
 * Creates the configuration for Reveal.js initialization
 */
export const createRevealConfig = (transition: string) => {
  return {
    controls: true,
    progress: true,
    center: false, // Changed from true to allow better content alignment
    hash: false,
    transition: transition,
    slideNumber: true,
    embedded: true, // Mode intégré pour empêcher le comportement plein écran
    width: '100%',
    height: '100%',
    margin: 0.1,
    viewDistance: 3, // Preload 3 slides in each direction
    display: 'block', // Ensure slides display as block
    fragments: false, // Disable fragments to prevent partial content showing
    // Improved keyboard config
    keyboard: {
      // Keep arrow navigation but disable space
      32: null, // Space
      // Explicitly enable arrow navigation
      37: 'prev', // Left arrow
      39: 'next', // Right arrow
    },
    // Improved touch control
    touch: {
      captureHorizontalSwipe: true,
      captureVerticalSwipe: false,
      swipeThreshold: 40
    },
    // Force all content on a slide to be revealed
    disableLayout: false
  };
};
