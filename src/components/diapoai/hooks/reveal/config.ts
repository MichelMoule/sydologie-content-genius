
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
    embedded: true, // Mode intégré pour empêcher le comportement plein écran
    width: '100%',
    height: '100%',
    margin: 0.1,
    // Désactiver les raccourcis clavier qui peuvent interférer avec le défilement
    keyboard: {
      // Désactiver la touche espace pour éviter les conflits avec le défilement
      32: null,
    },
    // Limiter la capture d'événements à l'intérieur du conteneur Reveal
    touch: {
      captureHorizontalSwipe: true,
      captureVerticalSwipe: false
    }
  };
};
