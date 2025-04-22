
/**
 * Creates the configuration for Reveal.js initialization
 */
export const createRevealConfig = (transition: string) => {
  return {
    controls: true,
    progress: true,
    center: false,
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
    
    // Paramètres pour éviter les problèmes de flux de rendu
    history: false,
    overview: false,
    pause: false,
    respondToHashChanges: false,
    
    // Important: désactive les fonctionnalités qui pourraient masquer du contenu
    hideInactiveCursor: false,
    hideCursorTime: 0,
    
    // Paramètres pour une meilleure compatibilité d'affichage
    mouseWheel: false,
    preloadIframes: true,
    
    // PDF specific settings
    pdfPageHeightOffset: -1
  };
};
