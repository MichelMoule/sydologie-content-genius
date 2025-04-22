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
  }, []);

  // Initialize Reveal.js only when necessary
  useEffect(() => {
    // Avoid multiple initializations in short succession
    if (isInitializing.current) return;
    
    // Debounce initialization (only initialize after time gap)
    const now = Date.now();
    if (now - lastInitTime.current < 2000) return;
    
    const initializeRevealInstance = async () => {
      if (!containerRef.current || !isScriptLoaded.current) return;
      
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
          console.log('Reveal.js initialized successfully');
          
          // Single sync attempt with delay
          setTimeout(() => {
            try {
              newDeck.sync();
              newDeck.slide(0);
            } catch (e) {
              console.warn('Error during initial sync:', e);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error during Reveal initialization:', error);
      } finally {
        isInitializing.current = false;
      }
    };

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeRevealInstance();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
    
  // Only depend on slidesHtml changes to trigger initialization
  // themeColors and transition are accessed via refs to prevent loops
  }, [containerRef, slidesHtml]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (deck) {
        safeDestroyReveal(deck);
      }
    };
  }, []);

  return { deck };
};
