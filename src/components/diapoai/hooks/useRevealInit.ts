
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
      try {
        deck.configure({ transition });
      } catch (error) {
        console.error('Error updating transition:', error);
      }
    }
  }, [transition, deck]);

  // Safely destroy the deck if it exists
  const safeDestroyDeck = (deckInstance: any) => {
    if (!deckInstance || isDestroying.current) return;
    
    isDestroying.current = true;
    try {
      // Check if the deck has the required properties before destroying
      if (typeof deckInstance.destroy === 'function') {
        deckInstance.destroy();
      }
    } catch (error) {
      console.error('Error safely destroying deck:', error);
    } finally {
      isDestroying.current = false;
    }
  };

  // Dynamically load the plugins scripts
  useEffect(() => {
    const loadPluginsScripts = async () => {
      // Function to load a script
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

      try {
        // Load reveal.js core script first and wait for it to complete
        console.log('Loading Reveal.js core script');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js');
        console.log('Reveal.js core script loaded');
        
        // Ensure Reveal is available in window
        if (!(window as any).Reveal) {
          console.error('Reveal.js not found in window object after loading script');
          return;
        }
        
        // Load all necessary plugins in sequence
        console.log('Loading plugins scripts');
        
        // Load Reveal plugins first
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/markdown/markdown.js');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/highlight/highlight.js');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/notes/notes.js');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/math/math.js');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/zoom/zoom.js');
        
        // Then load external dependencies that plugins might need
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.2.0/chart.min.js');
        
        console.log('All necessary scripts loaded');
        
        // Now initialize Reveal directly (without trying to create a basic deck first)
        if (!hasInitialized.current) {
          console.log('Proceeding to initialization');
          initializeReveal();
        }
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    if (!hasInitialized.current) {
      loadPluginsScripts();
    }
    
    // Cleanup function
    return () => {
      if (deck) {
        console.log('Cleanup: Destroying existing Reveal instance');
        safeDestroyDeck(deck);
      }
    };
  }, []);

  // Main function to initialize Reveal.js with the slides content
  const initializeReveal = async () => {
    if (!containerRef.current || hasInitialized.current) return;
    
    try {
      console.log('Starting to initialize Reveal.js');
      
      // Import Reveal.js
      const Reveal = (window as any).Reveal;
      if (!Reveal) {
        console.error('Reveal.js not found in window object');
        return;
      }
      
      // Get the slides container
      const slidesContainer = containerRef.current.querySelector('.slides');
      if (!slidesContainer) {
        console.error('Slides container not found');
        return;
      }
      
      // Clear existing slides
      slidesContainer.innerHTML = '';
      
      console.log('Processing slides HTML');
      
      // Process the HTML content to separate individual slides
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = slidesHtml;
      
      // Look for section elements which represent individual slides
      const sectionElements = tempDiv.querySelectorAll('section');
      
      if (sectionElements.length === 0) {
        console.log('No section elements found, creating a single slide');
        const newSection = document.createElement('section');
        newSection.innerHTML = slidesHtml;
        slidesContainer.appendChild(newSection);
      } else {
        console.log(`Found ${sectionElements.length} slides, adding them individually`);
        sectionElements.forEach(section => {
          slidesContainer.appendChild(section.cloneNode(true));
        });
      }
      
      // Apply theme colors to slides
      const slides = containerRef.current.querySelectorAll('.slides section');
      slides.forEach(slide => {
        // Add theme colors to headings
        const headings = slide.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
          (heading as HTMLElement).style.color = themeColors.primary;
        });
        
        // Apply special styling to different slide types
        if (slide.classList.contains('section-title')) {
          (slide as HTMLElement).style.background = `linear-gradient(135deg, ${themeColors.primary}15 0%, rgba(255,255,255,0.9) 100%)`;
          (slide as HTMLElement).style.borderRadius = '4px';
        }
        
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
      
      // Safely destroy any existing instance
      if (deck) {
        safeDestroyDeck(deck);
      }
      
      // Initialize standard plugins
      const plugins = [];
      if ((window as any).RevealHighlight) plugins.push((window as any).RevealHighlight);
      if ((window as any).RevealMarkdown) plugins.push((window as any).RevealMarkdown);
      if ((window as any).RevealNotes) plugins.push((window as any).RevealNotes);
      if ((window as any).RevealMath) plugins.push((window as any).RevealMath);
      if ((window as any).RevealZoom) plugins.push((window as any).RevealZoom);
      
      console.log('Initializing new Reveal instance with configuration');
      // Configure and initialize Reveal.js
      const newDeck = new Reveal(containerRef.current, {
        embedded: false,
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
      });
      
      console.log('Calling initialize on Reveal instance');
      await newDeck.initialize();
      console.log('Reveal.js initialized successfully');
      
      // Set the new deck state
      setDeck(newDeck);
      hasInitialized.current = true;
      
    } catch (error) {
      console.error('Error in initializeReveal:', error);
    }
  };

  // Effect to re-initialize when slides content changes
  useEffect(() => {
    if (containerRef.current && slidesHtml) {
      console.log('Slides HTML changed, re-initializing');
      hasInitialized.current = false;
      
      // Safely destroy any existing instance before re-initializing
      if (deck) {
        safeDestroyDeck(deck);
      }
      
      // Wait for any async operations to complete
      setTimeout(() => {
        initializeReveal();
      }, 100);
    }
  }, [slidesHtml, themeColors, transition]);

  return { deck };
};
