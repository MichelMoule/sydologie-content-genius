
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

  // Load the necessary Reveal.js resources
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

  // Initialize or update Reveal when content changes
  useEffect(() => {
    const initializeRevealInstance = async () => {
      if (!containerRef.current || !slidesHtml || !isScriptLoaded.current) return;
      
      // If an existing deck is present, destroy it safely
      if (deck) {
        safeDestroyReveal(deck);
      }
      
      // Wait a moment for DOM to be ready after content changes
      const newDeck = await initializeReveal(
        containerRef.current,
        themeColors,
        transition
      );
      
      if (newDeck) {
        setDeck(newDeck);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeRevealInstance();
    }, 300);

    return () => {
      clearTimeout(timer);
      // No need to destroy deck here, we'll handle it in the next initialization
    };
  }, [containerRef, slidesHtml, themeColors, transition, deck]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (deck) {
        safeDestroyReveal(deck);
      }
    };
  }, [deck]);

  return { deck };
};
