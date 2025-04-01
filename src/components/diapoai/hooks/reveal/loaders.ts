/**
 * Loads the Reveal.js CSS stylesheet
 */
export const loadRevealCss = () => {
  const linkId = 'reveal-theme-link';
  let link = document.getElementById(linkId) as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/white.css';
    document.head.appendChild(link);
  }
};

/**
 * Loads the Reveal.js script
 */
export const loadRevealScript = () => {
  return new Promise<void>((resolve, reject) => {
    // Check if Reveal is already available in the global scope
    if ((window as any).Reveal) {
      return resolve();
    }
    
    // Otherwise load the script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js';
    script.async = true;
    script.onload = () => {
      console.log('Script Reveal.js loaded successfully');
      resolve();
    };
    script.onerror = (e) => {
      console.error('Error loading Reveal.js', e);
      reject(new Error('Error loading Reveal.js script'));
    };
    document.head.appendChild(script);
  });
};
