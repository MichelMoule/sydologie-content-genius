
import { ThemeColors } from "../../types/ThemeColors";
import { generateStyles } from "./styles";

/**
 * Generate the complete HTML template for export
 */
export const generateHtmlTemplate = (slidesHtml: string, colors: ThemeColors): string => {
  // Ensure the slidesHtml has proper section tags if needed
  let processedHtml = slidesHtml;
  
  // If no section tags exist, we need to wrap the content
  if (!processedHtml.includes('<section')) {
    // Split the content by h1, h2 tags to create individual slides
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3');
    
    // If no headings, wrap everything in one section
    if (headings.length === 0) {
      processedHtml = `<section>${processedHtml}</section>`;
    } else {
      // Create a new structure with sections based on headings
      let newHtml = '';
      let currentSection = '';
      let inSection = false;
      
      for (let i = 0; i < tempDiv.childNodes.length; i++) {
        const node = tempDiv.childNodes[i];
        const nodeContent = node.nodeType === 1 ? (node as Element).outerHTML : node.textContent;
        
        // If this is a heading and not inside a section, start a new section
        if ((node.nodeType === 1 && ['H1', 'H2', 'H3'].includes((node as Element).tagName)) && inSection) {
          // Close previous section if needed
          if (currentSection) {
            newHtml += `<section>${currentSection}</section>`;
            currentSection = '';
          }
          
          currentSection += nodeContent;
          inSection = true;
        } 
        // If we're inside a section or this is the first content
        else {
          // Start a section if this is the first content
          if (!inSection) {
            inSection = true;
          }
          
          currentSection += nodeContent || '';
        }
      }
      
      // Add the last section
      if (currentSection) {
        newHtml += `<section>${currentSection}</section>`;
      }
      
      processedHtml = newHtml || `<section>${processedHtml}</section>`;
    }
  }
  
  // Now create the full HTML template
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diaporama SYDO généré par DiapoAI</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/theme/white.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/highlight/monokai.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap">
  
  <!-- Load SVG.js required for the Animate plugin -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.min.js"></script>
  
  <!-- Load Chart.js required for the Chart plugin -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.2.0/chart.min.js"></script>
  
  <style>
  ${generateStyles(colors)}
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${processedHtml}
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/notes/notes.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/markdown/markdown.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/highlight/highlight.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/zoom/zoom.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/math/math.js"></script>
  
  <!-- Add RevealJS plugins -->
  <script src="https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/loadcontent/plugin.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/animate/plugin.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/anything/plugin.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js-plugins@latest/chart/plugin.js"></script>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      Reveal.initialize({
        controls: true,
        progress: true,
        center: true,
        hash: false,
        slideNumber: true,
        autoAnimate: true,
        transition: 'slide',
        backgroundTransition: 'fade',
        // Add plugin configuration
        animate: {
          autoplay: true
        },
        chart: {
          defaults: {
            color: '${colors.text}',
            scale: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
              grid: { color: '${colors.primary}33' }
            },
          },
          line: { borderColor: ['${colors.primary}', '${colors.secondary}', '${colors.primary}88'] },
          bar: { backgroundColor: ['${colors.primary}', '${colors.secondary}', '${colors.primary}88'] },
          pie: { backgroundColor: [['${colors.primary}', '${colors.secondary}', '${colors.primary}88', '${colors.secondary}88']] },
        },
        plugins: [ 
          RevealHighlight, 
          RevealNotes, 
          RevealMarkdown, 
          RevealZoom, 
          RevealMath
        ]
      });
      
      // Add the remaining plugins after Reveal is initialized
      if (typeof RevealLoadContent !== 'undefined') Reveal.registerPlugin(RevealLoadContent);
      if (typeof RevealAnimate !== 'undefined') Reveal.registerPlugin(RevealAnimate);
      if (typeof RevealAnything !== 'undefined') Reveal.registerPlugin(RevealAnything);
      if (typeof RevealChart !== 'undefined') Reveal.registerPlugin(RevealChart);
    });
  </script>
</body>
</html>
  `;
};
