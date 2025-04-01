
import { ThemeColors } from "../../pptx/types";
import { generateStyles } from "./styles";

/**
 * Generate the complete HTML template for export
 */
export const generateHtmlTemplate = (slidesHtml: string, colors: ThemeColors): string => {
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
      ${slidesHtml}
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
        RevealMath, 
        RevealLoadContent, 
        RevealAnimate, 
        RevealAnything, 
        RevealChart 
      ]
    });
  </script>
</body>
</html>
  `;
};
