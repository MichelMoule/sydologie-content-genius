
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
    margin: 0.05, // Reduced margin to allow more content
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
    disableLayout: false,
    // Add maxScale to prevent content from being too large
    maxScale: 1.5,
    // Prevent auto-scaling that might cause content to be cut off
    autoSlide: 0,
    autoSlideStoppable: true,
    // Ensure content is not spread across multiple slides
    pdfMaxPagesPerSlide: 1,
    pdfSeparateFragments: false
  };
};
