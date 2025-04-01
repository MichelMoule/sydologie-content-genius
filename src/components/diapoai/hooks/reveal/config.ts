
/**
 * Creates the configuration for Reveal.js initialization
 */
export const createRevealConfig = (transition: string) => {
  return {
    controls: true,
    progress: true,
    center: true,
    hash: false,
    transition: transition,
    slideNumber: true,
    embedded: false,
    width: '100%',
    height: '100%',
    margin: 0.1
  };
};
