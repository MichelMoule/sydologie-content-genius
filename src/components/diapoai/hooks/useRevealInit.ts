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
        } else if (initAttempts.current < 3) {
          // If initialization failed, retry up to 3 times
          initAttempts.current++;
          setTimeout(initializeRevealInstance, 300 * initAttempts.current); // Increasing delay
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
  }, [containerRef, slidesHtml, themeColors, transition]);

  // Add a sync mechanism to handle navigation issues
  useEffect(() => {
    if (deck) {
      const syncTimer = setTimeout(() => {
        try {
          deck.sync();
          deck.slide(0); // Ensure we start at the first slide
        } catch (e) {
          console.warn('Error syncing Reveal.js deck:', e);
        }
      }, 500);
      
      return () => clearTimeout(syncTimer);
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
