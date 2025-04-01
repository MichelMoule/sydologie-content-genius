
import { useState, useEffect } from 'react';
import { ThemeColors } from '../pptx/types';

export const useRevealInit = (
  containerRef: React.RefObject<HTMLDivElement>,
  slidesHtml: string,
  themeColors: ThemeColors,
  transition: string
) => {
  const [deck, setDeck] = useState<any>(null);

  // Load theme CSS dynamically
  useEffect(() => {
    const linkId = 'reveal-theme-link';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    link.href = `https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/white.css`;
    
    // Update Reveal.js configuration if it's already initialized
    if (deck) {
      deck.configure({ transition });
    }
  }, [transition, deck]);

  // Dynamically load the plugins scripts
  useEffect(() => {
    const loadPluginsScripts = async () => {
      // Function to load a script
      const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
          document.head.appendChild(script);
        });
      };

      try {
        // Load SVG.js required for the Animate plugin
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.min.js');
        
        // Load Chart.js required for the Chart plugin
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.2.0/chart.min.js');
        
        // Load the LoadContent plugin (required for Animate plugin)
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/loadcontent/plugin.js');
        
        // Load the Animate plugin
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/animate/plugin.js');
        
        // Load the Anything plugin
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/anything/plugin.js');
        
        // Load the Chart plugin
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chart/plugin.js');
        
        console.log('All plugins loaded successfully');
      } catch (error) {
        console.error('Error loading plugin scripts:', error);
      }
    };

    loadPluginsScripts();
  }, []);

  useEffect(() => {
    const loadReveal = async () => {
      if (!containerRef.current) return;

      try {
        // Dynamic import of Reveal.js
        const Reveal = (await import('reveal.js')).default;
        const Highlight = (await import('reveal.js/plugin/highlight/highlight')).default;
        const Notes = (await import('reveal.js/plugin/notes/notes')).default;
        const Markdown = (await import('reveal.js/plugin/markdown/markdown')).default;
        const Zoom = (await import('reveal.js/plugin/zoom/zoom')).default;
        const Math = (await import('reveal.js/plugin/math/math')).default;
        
        // Get the slides container
        const slidesContainer = containerRef.current.querySelector('.slides');
        if (!slidesContainer) {
          console.error('Slides container not found');
          return;
        }
        
        // Nettoyer les diapositives existantes
        slidesContainer.innerHTML = '';
        
        // Créer un DOM temporaire pour analyser le HTML des diapositives
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = slidesHtml;
        
        // Récupérer les balises section qui représentent les diapositives
        const sectionElements = tempDiv.querySelectorAll('section');
        
        if (sectionElements.length === 0) {
          console.log("Aucune section trouvée dans le HTML, on l'utilise comme une seule diapo");
          // Si pas de sections trouvées, considérer le contenu comme une seule diapositive
          const newSection = document.createElement('section');
          newSection.innerHTML = slidesHtml;
          slidesContainer.appendChild(newSection);
        } else {
          console.log(`${sectionElements.length} sections trouvées, injection des diapositives individuelles`);
          // Injecter chaque section comme une diapositive
          sectionElements.forEach(section => {
            slidesContainer.appendChild(section.cloneNode(true));
          });
        }
        
        // Add SYDO styling to slides
        const slides = containerRef.current.querySelectorAll('.slides section');
        slides.forEach(slide => {
          // Add SYDO color to headings
          const headings = slide.querySelectorAll('h1, h2, h3');
          headings.forEach(heading => {
            (heading as HTMLElement).style.color = themeColors.primary;
          });
          
          // Check for section title slides and add special styling
          if (slide.classList.contains('section-title')) {
            (slide as HTMLElement).style.background = `linear-gradient(135deg, ${themeColors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
            (slide as HTMLElement).style.borderRadius = '4px';
          }
          
          // Check for title slide and add special styling
          if (slide.classList.contains('title-slide')) {
            (slide as HTMLElement).style.background = 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)';
            (slide as HTMLElement).style.borderRadius = '4px';
          }
          
          // Add subtle background to regular slides
          if (!slide.classList.contains('has-dark-background') && 
              !slide.classList.contains('section-title') && 
              !slide.classList.contains('title-slide')) {
            (slide as HTMLElement).style.background = 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 100%)';
            (slide as HTMLElement).style.borderRadius = '4px';
            (slide as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
          }
        });
        
        // Check if the plugin globals are available
        const RevealLoadContent = (window as any).RevealLoadContent;
        const RevealAnimate = (window as any).RevealAnimate;
        const RevealAnything = (window as any).RevealAnything;
        const RevealChart = (window as any).RevealChart;

        // Collect available plugins
        const plugins = [Highlight, Notes, Markdown, Zoom, Math];
        
        // Add loaded plugins if they exist
        if (RevealLoadContent) plugins.push(RevealLoadContent);
        if (RevealAnimate) plugins.push(RevealAnimate);
        if (RevealAnything) plugins.push(RevealAnything);
        if (RevealChart) plugins.push(RevealChart);
        
        // Destroy existing deck if any
        if (deck) {
          deck.destroy();
        }
        
        // Initialize Reveal.js with enhanced features and plugins
        const newDeck = new Reveal(containerRef.current, {
          embedded: false, // Changed to false to allow full functionality
          margin: 0.1,
          height: 700,
          width: 960,
          controls: true,
          progress: true,
          center: true,
          hash: false,
          transition: transition,
          slideNumber: true,
          autoPlayMedia: true,
          autoAnimate: true,
          backgroundTransition: 'fade',
          plugins: plugins,
          // Plugin specific configuration
          animate: {
            autoplay: true
          },
          anything: {
            // Default config for anything plugin
          },
          chart: {
            defaults: {
              color: themeColors.text,
              scale: {
                beginAtZero: true,
                grid: { color: `${themeColors.primary}33` }
              },
            },
            line: { borderColor: [themeColors.primary, themeColors.secondary] },
            bar: { backgroundColor: [themeColors.primary, themeColors.secondary] },
            pie: { backgroundColor: [[themeColors.primary, themeColors.secondary, `${themeColors.primary}88`, `${themeColors.secondary}88`]] }
          }
        });
        
        await newDeck.initialize();
        setDeck(newDeck);
        console.log('Reveal.js initialized successfully with plugins');
      } catch (error) {
        console.error('Error initializing Reveal.js:', error);
      }
    };

    // Wait a brief moment to ensure plugins are loaded
    const timer = setTimeout(() => {
      loadReveal();
    }, 500);

    return () => clearTimeout(timer);
  }, [slidesHtml, themeColors, containerRef, transition]);

  return { deck };
};
