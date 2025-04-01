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
  const initAttempts = useRef(0);
  const maxAttempts = 5; // Increase max attempts for better reliability

  // Keep track of the latest slidesHtml without triggering re-renders
  useEffect(() => {
    slidesRef.current = slidesHtml;
  }, [slidesHtml]);

  // Load the necessary Reveal.js resources only once
  useEffect(() => {
    loadRevealCss();
    
    if (!isScriptLoaded.current) {
      loadRevealScript()
        .then(() => {
          isScriptLoaded.current = true;
          console.log('Script Reveal.js loaded successfully');
        })
        .catch(error => {
          console.error('Failed to load Reveal.js:', error);
        });
    }
  }, []);

  // Initialize Reveal.js only when content or config changes
  useEffect(() => {
    const initializeRevealInstance = async () => {
      if (!containerRef.current || !slidesHtml || !isScriptLoaded.current || isInitializing.current) return;
      
      isInitializing.current = true;
      
      try {
        // If an existing deck is present, destroy it safely
        if (deck) {
          safeDestroyReveal(deck);
        }
        
        // Initialize new deck
        const newDeck = await initializeReveal(
          containerRef.current,
          themeColors,
          transition
        );
        
        if (newDeck) {
          setDeck(newDeck);
          initAttempts.current = 0; // Reset attempt counter on success
          console.log('Reveal.js initialized successfully');
        } else if (initAttempts.current < maxAttempts) {
          // If initialization failed, retry with increasing delay
          initAttempts.current++;
          const delay = 300 * Math.pow(1.5, initAttempts.current); // Exponential backoff
          console.warn(`Initialization attempt ${initAttempts.current} failed, retrying in ${delay}ms`);
          setTimeout(initializeRevealInstance, delay);
        } else {
          console.error(`Failed to initialize Reveal.js after ${maxAttempts} attempts`);
        }
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
  }, [containerRef, slidesHtml, themeColors, transition, deck]);

  // Add a robust sync mechanism to handle navigation issues
  useEffect(() => {
    if (deck) {
      // Multiple sync attempts with increasing delays for reliability
      const syncTimers = [500, 1000, 2000].map((delay, index) => {
        return setTimeout(() => {
          try {
            deck.sync();
            if (index === 0) { // Only reset to first slide on first sync
              deck.slide(0); // Ensure we start at the first slide
            }
            console.log(`Sync attempt ${index + 1} successful`);
          } catch (e) {
            console.warn(`Error syncing Reveal.js deck on attempt ${index + 1}:`, e);
          }
        }, delay);
      });
      
      return () => syncTimers.forEach(timer => clearTimeout(timer));
    }
  }, [deck]);

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
