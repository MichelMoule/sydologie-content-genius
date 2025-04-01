
import { useState, useEffect, useRef } from 'react';
import { ThemeColors } from '../pptx/types';

export const useRevealInit = (
  containerRef: React.RefObject<HTMLDivElement>,
  slidesHtml: string,
  themeColors: ThemeColors,
  transition: string
) => {
  const [deck, setDeck] = useState<any>(null);
  const hasInitialized = useRef(false);
  const isDestroying = useRef(false);
  const scriptLoadingInProgress = useRef(false);

  // Safely destroy an existing deck
  const safeDestroyDeck = () => {
    const Reveal = (window as any).Reveal;
    if (!Reveal || isDestroying.current) return;
    
    try {
      isDestroying.current = true;
      console.log('Attempting to safely destroy Reveal instance');
      
      // Get all instances and destroy them
      const revealElement = document.querySelector('.reveal');
      if (revealElement) {
        // Clear inner HTML to prevent lingering event handlers
        const slidesContainer = revealElement.querySelector('.slides');
        if (slidesContainer) {
          slidesContainer.innerHTML = '<section><h2>Chargement du diaporama...</h2><p>La prévisualisation apparaîtra dans quelques instants.</p></section>';
        }
      }
      
      // Reset the state
      setDeck(null);
      hasInitialized.current = false;
    } catch (error) {
      console.error('Error during deck destruction:', error);
    } finally {
      isDestroying.current = false;
    }
  };

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
    
    // Update configuration if deck exists
    if (deck && typeof deck.configure === 'function') {
      try {
        deck.configure({ transition });
      } catch (error) {
        console.error('Error updating transition:', error);
      }
    }
    
    return () => {};
  }, [transition, deck]);

  // Initialize Reveal
  const initializeReveal = async () => {
    if (!containerRef.current || hasInitialized.current) return;
    
    try {
      console.log('Starting Reveal.js initialization');
      const Reveal = (window as any).Reveal;
      
      if (!Reveal) {
        console.error('Reveal.js not found in window object');
        return;
      }
      
      // Get slides container
      const slidesContainer = containerRef.current.querySelector('.slides');
      if (!slidesContainer) {
        console.error('Slides container not found');
        return;
      }
      
      // Clear and prepare slides content
      slidesContainer.innerHTML = '';
      
      // Process slides HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = slidesHtml;
      
      // Add slides to container
      const sectionElements = tempDiv.querySelectorAll('section');
      
      if (sectionElements.length === 0) {
        console.log('No sections found, creating a single slide');
        const newSection = document.createElement('section');
        newSection.innerHTML = slidesHtml;
        slidesContainer.appendChild(newSection);
      } else {
        console.log(`Found ${sectionElements.length} slides, adding them`);
        sectionElements.forEach(section => {
          slidesContainer.appendChild(section.cloneNode(true));
        });
      }
      
      // Apply theme colors
      applyThemeColors(containerRef.current, themeColors);
      
      // Create new instance with simple configuration
      console.log('Initializing new Reveal instance');
      const config = {
        embedded: false,
        controls: true,
        progress: true,
        center: true,
        hash: false,
        transition: transition,
        slideNumber: true,
        plugins: [] // Simplified plugin handling
      };
      
      const newDeck = new Reveal(containerRef.current, config);
      await newDeck.initialize();
      console.log('Reveal.js initialized successfully');
      
      setDeck(newDeck);
      hasInitialized.current = true;
    } catch (error) {
      console.error('Error initializing Reveal:', error);
      hasInitialized.current = false;
    }
  };

  // Apply theme colors to slides
  const applyThemeColors = (container: HTMLDivElement, colors: ThemeColors) => {
    const slides = container.querySelectorAll('.slides section');
    slides.forEach(slide => {
      // Style headings
      const headings = slide.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        (heading as HTMLElement).style.color = colors.primary;
      });
      
      // Style slide based on class
      if (slide.classList.contains('section-title')) {
        (slide as HTMLElement).style.background = `linear-gradient(135deg, ${colors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
        (slide as HTMLElement).style.borderRadius = '4px';
      } else if (slide.classList.contains('title-slide')) {
        (slide as HTMLElement).style.background = 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)';
        (slide as HTMLElement).style.borderRadius = '4px';
      } else if (!slide.classList.contains('has-dark-background')) {
        (slide as HTMLElement).style.background = 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 100%)';
        (slide as HTMLElement).style.borderRadius = '4px';
        (slide as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      }
    });
  };

  // Load necessary scripts
  useEffect(() => {
    const loadScripts = async () => {
      if (scriptLoadingInProgress.current) return;
      scriptLoadingInProgress.current = true;
      
      try {
        console.log('Loading Reveal.js scripts');
        // Load Reveal.js core first
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js');
        
        // Proceed with initialization after script is loaded
        setTimeout(() => {
          initializeReveal();
          scriptLoadingInProgress.current = false;
        }, 100);
      } catch (error) {
        console.error('Error loading scripts:', error);
        scriptLoadingInProgress.current = false;
      }
    };
    
    // Load a script and return a promise
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };
    
    // Start loading scripts if not initialized
    if (!hasInitialized.current) {
      loadScripts();
    }
    
    // Cleanup function
    return () => {
      if (hasInitialized.current) {
        safeDestroyDeck();
      }
    };
  }, []);

  // Reinitialize when content changes
  useEffect(() => {
    if (!containerRef.current || !slidesHtml) return;
    
    console.log('Slides HTML changed, reinitializing');
    safeDestroyDeck();
    
    // Reset state
    hasInitialized.current = false;
    
    // Wait a bit before reinitializing
    setTimeout(() => {
      initializeReveal();
    }, 300);
  }, [slidesHtml, themeColors, transition]);

  return { deck };
};
