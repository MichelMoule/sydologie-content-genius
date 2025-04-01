
import { useState, useEffect, useRef } from 'react';
import { ThemeColors } from '../pptx/types';

export const useRevealInit = (
  containerRef: React.RefObject<HTMLDivElement>,
  slidesHtml: string,
  themeColors: ThemeColors,
  transition: string
) => {
  const [deck, setDeck] = useState<any>(null);
  const isInitialized = useRef(false);
  const scriptLoaded = useRef(false);

  // Fonction pour appliquer les couleurs du thème
  const applyThemeColors = (container: HTMLDivElement, colors: ThemeColors) => {
    const slides = container.querySelectorAll('.slides section');
    slides.forEach(slide => {
      // Appliquer les couleurs aux titres
      const headings = slide.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
      });
      
      // Appliquer les styles spécifiques selon la classe du slide
      if (slide.classList.contains('section-title')) {
        (slide as HTMLElement).style.background = `linear-gradient(135deg, ${colors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
      } else if (slide.classList.contains('title-slide')) {
        (slide as HTMLElement).style.background = '#f8f8f8';
      } else {
        (slide as HTMLElement).style.background = colors.background;
      }
    });
  };

  // Charger Reveal.js
  useEffect(() => {
    // Fonction pour charger le script
    const loadRevealScript = () => {
      if (scriptLoaded.current) return Promise.resolve();
      
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js';
        script.async = true;
        script.onload = () => {
          console.log('Script Reveal.js chargé avec succès');
          scriptLoaded.current = true;
          resolve();
        };
        script.onerror = (e) => {
          console.error('Erreur lors du chargement de Reveal.js', e);
          reject(new Error('Erreur de chargement du script Reveal.js'));
        };
        document.head.appendChild(script);
      });
    };

    // Charger le CSS de Reveal.js
    const loadRevealCss = () => {
      const linkId = 'reveal-theme-link';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/white.css';
        document.head.appendChild(link);
      }
    };

    // On charge le script puis on initialise
    if (!isInitialized.current) {
      loadRevealCss();
      loadRevealScript()
        .then(() => {
          console.log('Prêt à initialiser Reveal.js');
        })
        .catch(error => {
          console.error('Erreur lors du chargement de Reveal:', error);
        });
    }

    return () => {
      // Nettoyage simple - on laisse le script chargé pour éviter les rechargements
    };
  }, []);

  // Initialiser ou mettre à jour Reveal quand le contenu change
  useEffect(() => {
    // Fonction pour initialiser Reveal.js
    const initializeReveal = () => {
      if (!containerRef.current || !slidesHtml || !scriptLoaded.current) return;
      
      try {
        console.log('Initialisation de Reveal.js');
        const Reveal = (window as any).Reveal;
        
        if (!Reveal) {
          console.error('Reveal.js non trouvé dans l\'objet window');
          return;
        }
        
        // Si un deck existe déjà, on le détruit proprement
        if (deck) {
          try {
            console.log('Destruction du deck existant');
            deck.destroy();
          } catch (e) {
            console.error('Erreur lors de la destruction du deck:', e);
          }
        }
        
        // On applique les couleurs du thème
        if (containerRef.current) {
          applyThemeColors(containerRef.current, themeColors);
        }
        
        // Configuration simple
        const config = {
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
        
        // Création d'une nouvelle instance
        const newDeck = new Reveal(containerRef.current, config);
        
        // Initialisation
        newDeck.initialize()
          .then(() => {
            console.log('Reveal.js initialisé avec succès');
            setDeck(newDeck);
            isInitialized.current = true;
          })
          .catch((error: any) => {
            console.error('Erreur lors de l\'initialisation de Reveal:', error);
          });
        
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de Reveal:', error);
      }
    };

    // On attend un peu pour s'assurer que le DOM est prêt
    const timer = setTimeout(() => {
      initializeReveal();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [containerRef, slidesHtml, themeColors, transition, deck]);

  return { deck };
};
