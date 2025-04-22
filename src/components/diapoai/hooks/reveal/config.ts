
/**
 * Creates the configuration for Reveal.js initialization
 */
export const createRevealConfig = (transition: string) => {
  return {
    controls: true,
    progress: true,
    center: false, // Keep content aligned for better text density
    hash: false,
    transition: transition,
    slideNumber: true,
    embedded: true, // Keep embedded mode to prevent fullscreen behavior
    width: '100%',
    height: '100%',
    margin: 0.03, // Even more reduced margin to allow more content
    viewDistance: 2, // Reduce preload for better performance
    display: 'block', // Ensure slides display as block
    fragments: false, // Disable fragments to prevent partial content showing
    // Prevent unnecessary re-calculations that might trigger re-renders
    autoPlayMedia: false,
    autoAnimateUnmatched: false,
    // Improved keyboard config
    keyboard: {
      // Keep arrow navigation but disable space
      32: null, // Space
      // Explicitly enable arrow navigation
      37: 'prev', // Left arrow
      39: 'next', // Right arrow
    },
    // Simplified touch control
    touch: {
      captureHorizontalSwipe: true,
      captureVerticalSwipe: false,
      swipeThreshold: 40
    },
    // Prevent layout recalculations that may cause refreshes
    disableLayout: true,
    // Add maxScale to prevent content from being too large
    maxScale: 1.5,
    // Prevent auto-animation that might cause reflows
    autoSlide: 0,
    autoSlideStoppable: true,
    // Optimize for content display
    minScale: 0.2,
    // Prevent content from being cut off
    pdfMaxPagesPerSlide: 1,
    pdfSeparateFragments: false,
    // Disable features that might cause reflows
    overview: false,
    // Set this to reduce unnecessary DOM updates
    respondToHashChanges: false
  };
};
