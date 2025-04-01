
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
        
        // Initialize Reveal with basic configuration first, before loading plugins
        // This ensures that Reveal.getConfig() is available for plugins
        console.log('Initializing Reveal with basic configuration');
        const basicDeck = new (window as any).Reveal(containerRef.current, {
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
        });
        
        // Load the plugins but don't initialize them yet
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
        
        // Now load the custom plugins, ensuring Reveal.js is initialized first
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/loadcontent/plugin.js');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/anything/plugin.js');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chart/plugin.js');
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/animate/plugin.js');
        
        console.log('All scripts loaded successfully');
        
        // Destroy the basic deck as we'll create a full one now
        try {
          basicDeck.destroy();
        } catch (error) {
          console.error('Error destroying basic deck:', error);
        }
        
        // Now initialize Reveal with full configuration and content
        console.log('Proceeding to full initialization');
        initializeReveal();
      } catch (error) {
        console.error('Error loading plugin scripts:', error);
      }
    };

    if (!hasInitialized.current) {
      loadPluginsScripts();
    }
    
    // Cleanup function
    return () => {
      if (deck) {
        console.log('Destroying existing Reveal instance');
        try {
          deck.destroy();
        } catch (error) {
          console.error('Error destroying deck:', error);
        }
      }
    };
  }, []);

  // Main function to initialize Reveal.js with the slides content
  const initializeReveal = async () => {
    if (!containerRef.current || hasInitialized.current) return;
    
    try {
      console.log('Starting to initialize Reveal.js');
      
      // Import Reveal.js and plugins
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
      
      // Collect available plugins
      const RevealPlugins = {
        RevealHighlight: (window as any).RevealHighlight,
        RevealMarkdown: (window as any).RevealMarkdown,
        RevealNotes: (window as any).RevealNotes,
        RevealMath: (window as any).RevealMath,
        RevealZoom: (window as any).RevealZoom,
      };
      
      // We need to add these manually to avoid the error
      const CustomPlugins = [
        { id: 'loadcontent', src: 'https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/loadcontent/plugin.js' },
        { id: 'animate', src: 'https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/animate/plugin.js' },
        { id: 'anything', src: 'https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/anything/plugin.js' },
        { id: 'chart', src: 'https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chart/plugin.js' }
      ];
      
      // Collect core plugins that loaded successfully
      const plugins = [];
      if (RevealPlugins.RevealHighlight) plugins.push(RevealPlugins.RevealHighlight);
      if (RevealPlugins.RevealMarkdown) plugins.push(RevealPlugins.RevealMarkdown);
      if (RevealPlugins.RevealNotes) plugins.push(RevealPlugins.RevealNotes);
      if (RevealPlugins.RevealMath) plugins.push(RevealPlugins.RevealMath);
      if (RevealPlugins.RevealZoom) plugins.push(RevealPlugins.RevealZoom);
      
      console.log('Destroying any existing Reveal instance');
      if (deck) {
        try {
          deck.destroy();
        } catch (error) {
          console.error('Error destroying existing Reveal instance:', error);
        }
      }
      
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
      newDeck.initialize().then(() => {
        console.log('Reveal.js initialized successfully');
        
        // After initialization, we'll manually add the custom plugins
        // This approach helps avoid the "getConfig is not a function" error
        console.log('Adding custom plugins after initialization');
        
        // We need to modify the window.RevealAnimate initialization
        // to not call Reveal.getConfig() directly
        try {
          if ((window as any).RevealAnimate) {
            (window as any).RevealAnimate.init(newDeck);
            console.log('RevealAnimate plugin added manually');
          }
          
          if ((window as any).RevealAnything) {
            (window as any).RevealAnything.init(newDeck);
            console.log('RevealAnything plugin added manually');
          }
          
          if ((window as any).RevealChart) {
            (window as any).RevealChart.init(newDeck);
            console.log('RevealChart plugin added manually');
          }
        } catch (error) {
          console.error('Error initializing custom plugins:', error);
        }
        
        setDeck(newDeck);
        hasInitialized.current = true;
      }).catch((error: any) => {
        console.error('Error during Reveal.js initialization:', error);
      });
      
    } catch (error) {
      console.error('Error in initializeReveal:', error);
    }
  };

  // Effect to re-initialize when slides content changes
  useEffect(() => {
    if (containerRef.current && slidesHtml) {
      console.log('Slides HTML changed, re-initializing');
      hasInitialized.current = false;
      
      // Wait for any async operations to complete
      setTimeout(() => {
        initializeReveal();
      }, 100);
    }
  }, [slidesHtml, themeColors, transition]);

  return { deck };
};
