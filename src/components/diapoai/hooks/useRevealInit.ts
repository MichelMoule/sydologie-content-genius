
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
      deck.configure({ transition });
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
        // Load reveal.js core script first
        await loadScript('https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js');
        
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
        
        console.log('All scripts loaded successfully');
        
        // Initialize Reveal after all scripts are loaded
        initializeReveal();
      } catch (error) {
        console.error('Error loading plugin scripts:', error);
      }
    };

    loadPluginsScripts();
    
    // Cleanup function
    return () => {
      if (deck) {
        console.log('Destroying existing Reveal instance');
        deck.destroy();
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
      
      // Check if plugins are available
      const RevealHighlight = (window as any).RevealHighlight;
      const RevealMarkdown = (window as any).RevealMarkdown;
      const RevealNotes = (window as any).RevealNotes;
      const RevealMath = (window as any).RevealMath;
      const RevealZoom = (window as any).RevealZoom;
      const RevealLoadContent = (window as any).RevealLoadContent;
      const RevealAnimate = (window as any).RevealAnimate;
      const RevealAnything = (window as any).RevealAnything;
      const RevealChart = (window as any).RevealChart;
      
      // Collect available plugins
      const plugins = [];
      
      if (RevealHighlight) plugins.push(RevealHighlight);
      if (RevealMarkdown) plugins.push(RevealMarkdown);
      if (RevealNotes) plugins.push(RevealNotes);
      if (RevealMath) plugins.push(RevealMath);
      if (RevealZoom) plugins.push(RevealZoom);
      if (RevealLoadContent) plugins.push(RevealLoadContent);
      if (RevealAnimate) plugins.push(RevealAnimate);
      if (RevealAnything) plugins.push(RevealAnything);
      if (RevealChart) plugins.push(RevealChart);
      
      console.log('Destroying any existing Reveal instance');
      if (deck) {
        deck.destroy();
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
      
      console.log('Calling initialize on Reveal instance');
      newDeck.initialize().then(() => {
        console.log('Reveal.js initialized successfully');
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
