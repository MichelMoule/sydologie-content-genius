import { useState, useEffect, useRef } from 'react';
import { ThemeColors } from '../pptx/types';
import { loadRevealCss, loadRevealScript } from './reveal/loaders';
import { safeDestroyReveal, initializeReveal } from './reveal/initManager';

export const useRevealInit = (
  containerRef: React.RefObject<HTMLDivElement>,
  slidesHtml: string,
  themeColors: ThemeColors,
  transition: string
) => {
  const [deck, setDeck] = useState<any>(null);
  const isScriptLoaded = useRef(false);
  const isInitializing = useRef(false);
  const slidesRef = useRef(slidesHtml);
  const colorsRef = useRef(themeColors);
  const transitionRef = useRef(transition);
  const initAttempts = useRef(0);
  const maxAttempts = 3;
  const lastInitTime = useRef(0);
  const initCompletedRef = useRef(false);
  const debounceTimerRef = useRef<any>(null);

  // Keep track of the latest props without triggering re-renders
  useEffect(() => {
    slidesRef.current = slidesHtml;
    colorsRef.current = themeColors;
    transitionRef.current = transition;
  }, [slidesHtml, themeColors, transition]);

  // Load the necessary Reveal.js resources only once
  useEffect(() => {
    const loadScripts = async () => {
      try {
        await loadRevealCss();
        if (!isScriptLoaded.current) {
          await loadRevealScript();
          isScriptLoaded.current = true;
          console.log('Script Reveal.js loaded successfully');
        }
      } catch (error) {
        console.error('Failed to load Reveal.js resources:', error);
      }
    };
    
    loadScripts();
    
    // Cleanup function to clear any pending timers
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Initialize Reveal.js only when necessary with strong debouncing
  useEffect(() => {
    // Skip if already initializing or initialization completed
    if (isInitializing.current) return;
    
    // Check if container exists first
    if (!containerRef.current) return;
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a strong debounce to avoid multiple initializations
    debounceTimerRef.current = setTimeout(() => {
      const initializeRevealInstance = async () => {
        if (!containerRef.current || !isScriptLoaded.current) return;
        
        // Don't re-initialize if the HTML hasn't changed and we already have a deck
        if (deck && initCompletedRef.current && lastInitTime.current > 0) {
          console.log('Skipping initialization - already initialized');
          return;
        }
        
        isInitializing.current = true;
        lastInitTime.current = Date.now();
        
        try {
          // Safely destroy existing deck if present
          if (deck) {
            console.log('Cleaning up previous deck before initialization');
            safeDestroyReveal(deck);
          }
          
          // Initialize new deck
          const newDeck = await initializeReveal(
            containerRef.current,
            colorsRef.current,
            transitionRef.current
          );
          
          if (newDeck) {
            setDeck(newDeck);
            initAttempts.current = 0;
            initCompletedRef.current = true;
            console.log('Reveal.js initialized successfully');
            
            // Force slide visibility with a delay
            setTimeout(() => {
              try {
                // Ensure slides are properly displayed
                newDeck.sync();
                newDeck.slide(0);
                
                // Force-show all slides content in preview
                const slideSections = containerRef.current?.querySelectorAll('.reveal .slides section');
                if (slideSections) {
                  slideSections.forEach((section: Element) => {
                    (section as HTMLElement).style.opacity = '1';
                    (section as HTMLElement).style.visibility = 'visible';
                    (section as HTMLElement).style.overflow = 'visible';
                    (section as HTMLElement).style.height = 'auto';
                  });
                }
              } catch (e) {
                console.warn('Error during initial sync:', e);
              }
            }, 300);
          }
        } catch (error) {
          console.error('Error during Reveal initialization:', error);
        } finally {
          isInitializing.current = false;
        }
      };

      initializeRevealInstance();
    }, 1000); // Long debounce of 1 second to prevent multiple initializations
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    
  // Only depend on containerRef to trigger initialization
  // slidesHtml, themeColors, and transition are accessed via refs
  }, [containerRef]); 

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (deck) {
        safeDestroyReveal(deck);
      }
    };
  }, []);

  return { deck };
};
