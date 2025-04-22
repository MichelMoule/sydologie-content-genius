
/**
 * Creates the configuration for Reveal.js initialization
 */
export const createRevealConfig = (transition: string) => {
  return {
    controls: true,
    progress: true,
    hash: false,
    transition: transition,
    slideNumber: true,
    embedded: true,
    width: '100%',
    height: '100%',
    margin: 0.01,
    viewDistance: 3,
    display: 'block',
    fragments: false,
    
    // Paramètres critiques pour éviter les problèmes d'affichage
    autoSlide: 0,
    autoPlayMedia: false,
    parallaxBackgroundImage: '',
    parallaxBackgroundSize: '',
    
    // Désactiver les transitions complexes pour éviter les problèmes d'affichage
    backgroundTransition: 'none',
    
    // Empêcher le contenu d'être coupé
    minScale: 0.2,
    maxScale: 2.0,
    
    // Configuration du clavier
    keyboard: {
      37: 'prev',
      39: 'next',
    },
    
    // Optimisations tactiles
    touch: true,
    
    // Paramètres critiques pour garantir un affichage complet du contenu
    pdfSeparateFragments: false,
    pdfMaxPagesPerSlide: 1,
    
    // Force l'affichage du contenu
    showNotes: false,
    disableLayout: false,
    
    // IMPORTANT: Empêche le contenu d'être coupé entre les diapositives
    shuffle: false,
    loop: false,
    rtl: false,
    navigationMode: 'default',
    
    // Désactive les fonctionnalités qui peuvent causer des problèmes d'affichage
    hideInactiveCursor: false,
    hideCursorTime: 0,
    
    // Paramètres pour une meilleure compatibilité d'affichage
    mouseWheel: false,
    preloadIframes: true,
    
    // PDF specific settings
    pdfPageHeightOffset: -1,
    
    // Garantir que tout le contenu reste visible
    fit: true,
    
    // Enable better content distribution
    center: true // Removed the duplicate "center" property
  };
};
