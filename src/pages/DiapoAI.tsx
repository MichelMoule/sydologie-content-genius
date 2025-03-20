
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIForm } from "@/components/diapoai/DiapoAIForm";
import RevealPreview from "@/components/diapoai/RevealPreview";
import { OutlineSection } from "@/components/diapoai/types";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Presentation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { convertHtmlToPptx } from "@/components/diapoai/pptxExport";

// Theme color interface
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

const DiapoAI = () => {
  const [outline, setOutline] = useState<OutlineSection[] | null>(null);
  const [slidesHtml, setSlidesHtml] = useState<string | null>(null);
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#1B4D3E",
    secondary: "#FF9B7A",
    background: "#FFFFFF",
    text: "#333333"
  });
  const { toast } = useToast();

  const handleOutlineGenerated = (generatedOutline: OutlineSection[]) => {
    setOutline(generatedOutline);
    toast({
      title: "Plan généré avec succès",
      description: "Vous pouvez maintenant modifier le plan ou générer le diaporama.",
    });
  };

  const handleSlidesGenerated = (html: string) => {
    setSlidesHtml(html);
    toast({
      title: "Diaporama généré avec succès",
      description: "Vous pouvez maintenant visualiser et personnaliser votre diaporama.",
    });
  };

  const handleColorChange = (newColors: ThemeColors) => {
    setColors(newColors);
  };

  const downloadHtml = () => {
    if (!slidesHtml) return;

    // Create a full HTML document with additional styling
    const fullHtml = `
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
  <style>
    :root {
      --primary-color: ${colors.primary};
      --secondary-color: ${colors.secondary};
      --background-color: ${colors.background};
      --text-color: ${colors.text};
      --primary-color-rgb: ${hexToRgb(colors.primary)};
      --secondary-color-rgb: ${hexToRgb(colors.secondary)};
    }
    
    .reveal .slides { height: 100%; }
    body { 
      background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
      min-height: 100vh;
      color: var(--text-color);
    }
    .reveal h1, .reveal h2 { color: var(--primary-color); font-weight: 700; margin-bottom: 0.5em; }
    .reveal h3, .reveal h4 { color: var(--primary-color); font-weight: 600; }
    .reveal .highlight { color: var(--secondary-color); font-weight: 600; }
    .reveal .text-primary { color: var(--primary-color); }
    .reveal .text-secondary { color: var(--secondary-color); }
    
    /* Enhanced bullet points */
    .reveal ul { list-style-type: none; margin-left: 0; }
    .reveal ul li { 
      position: relative; 
      margin-bottom: 0.8em; 
      padding-left: 1.5em; 
    }
    .reveal ul li:before {
      content: "•"; 
      color: var(--secondary-color); 
      font-weight: bold; 
      font-size: 1.2em;
      position: absolute;
      left: 0;
    }
    
    /* Numbered lists */
    .reveal ol { 
      counter-reset: li;
      list-style: none;
      padding-left: 1em;
    }
    .reveal ol li {
      counter-increment: li;
      margin-bottom: 0.8em;
      position: relative;
      padding-left: 1.5em;
    }
    .reveal ol li:before {
      content: counter(li);
      color: var(--primary-color);
      font-weight: bold;
      background: rgba(var(--primary-color-rgb), 0.1);
      border-radius: 50%;
      width: 1.2em;
      height: 1.2em;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
    }
    
    /* Block quotes */
    .reveal blockquote { 
      border-left: 4px solid var(--secondary-color); 
      padding-left: 1em; 
      font-style: italic;
      background: rgba(var(--secondary-color-rgb), 0.1);
      padding: 1em;
      border-radius: 0 8px 8px 0;
    }
    
    /* Two-column layout */
    .reveal .columns {
      display: flex;
      justify-content: space-between;
      gap: 2em;
    }
    .reveal .column {
      flex: 1;
    }
    
    /* SVG diagrams */
    .reveal .svg-diagram {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      display: block;
    }
    
    .reveal .diagram-caption {
      text-align: center;
      font-style: italic;
      margin-top: 0.5em;
      color: var(--text-color);
      opacity: 0.8;
    }
    
    /* Image placeholders */
    .reveal .image-placeholder {
      background-color: #f0f0f0;
      border: 2px dashed #ccc;
      border-radius: 8px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      width: 80%;
      position: relative;
    }
    .reveal .image-placeholder:after {
      content: "Image illustrative";
      color: #888;
      font-style: italic;
    }
    
    /* Diagram styling */
    .reveal .diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1em auto;
      width: 90%;
    }
    .reveal .process-flow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .reveal .process-step {
      background: rgba(var(--primary-color-rgb), 0.1);
      border: 2px solid var(--primary-color);
      border-radius: 8px;
      padding: 0.5em 1em;
      text-align: center;
      min-width: 100px;
      position: relative;
    }
    .reveal .process-step:not(:last-child):after {
      content: "→";
      position: absolute;
      right: -1.5em;
      top: 50%;
      transform: translateY(-50%);
      color: var(--primary-color);
      font-size: 1.5em;
    }
    
    /* Tables */
    .reveal table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    .reveal table th {
      background-color: rgba(var(--primary-color-rgb), 0.2);
      color: var(--primary-color);
      font-weight: bold;
      text-align: left;
      padding: 0.5em;
      border: 1px solid rgba(var(--primary-color-rgb), 0.3);
    }
    .reveal table td {
      padding: 0.5em;
      border: 1px solid rgba(var(--primary-color-rgb), 0.2);
    }
    .reveal table tr:nth-child(even) {
      background-color: rgba(var(--primary-color-rgb), 0.05);
    }
    
    /* Section title slides */
    .reveal section.section-title {
      background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(255,255,255,0.9) 100%);
    }
    
    /* Title slide */
    .reveal section.title-slide {
      background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
    }
    
    /* Horizontal divider */
    .reveal hr {
      border: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, var(--primary-color), transparent);
      margin: 1em 0;
    }
  </style>
</head>
<body>
  ${slidesHtml}
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/notes/notes.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/markdown/markdown.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/highlight/highlight.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/zoom/zoom.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.5.0/plugin/math/math.js"></script>
  <script>
    Reveal.initialize({
      controls: true,
      progress: true,
      center: true,
      hash: false,
      slideNumber: true,
      plugins: [ RevealHighlight, RevealNotes, RevealMarkdown, RevealZoom, RevealMath ],
      autoAnimate: true,
      transition: 'slide',
      backgroundTransition: 'fade'
    });
  </script>
</body>
</html>
    `;

    // Create a Blob
    const blob = new Blob([fullHtml], { type: 'text/html' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diapoai-presentation.html';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const exportToPpt = async () => {
    if (!slidesHtml) return;
    
    try {
      toast({
        title: "Conversion en cours",
        description: "Création du fichier PowerPoint...",
      });
      
      const pptxBlob = await convertHtmlToPptx(slidesHtml, colors);
      
      // Create download link
      const url = window.URL.createObjectURL(pptxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diapoai-presentation.pptx';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export terminé",
        description: "Votre présentation PowerPoint a été téléchargée.",
      });
    } catch (error) {
      console.error("Error exporting to PPT:", error);
      toast({
        title: "Erreur lors de l'export",
        description: "Impossible de créer le fichier PowerPoint. Essayez le format HTML à la place.",
        variant: "destructive"
      });
    }
  };
  
  // Fonction utilitaire pour convertir une couleur hex en RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0, 0, 0";
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `${r}, ${g}, ${b}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <Presentation className="h-8 w-8 text-sydologie-green" />
              <div>
                <h1 className="text-3xl font-bold text-sydologie-green mb-2">DiapoAI</h1>
                <p className="text-lg text-gray-700">
                  Créez des présentations percutantes pour vos formations en quelques minutes
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            <DiapoAIForm 
              onOutlineGenerated={handleOutlineGenerated} 
              onSlidesGenerated={handleSlidesGenerated}
              onColorsChanged={handleColorChange}
            />
            
            {slidesHtml && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-sydologie-green flex items-center gap-2">
                    <Presentation className="h-5 w-5" />
                    Votre diaporama
                  </h3>
                  <div className="flex gap-2">
                    <Button onClick={downloadHtml} variant="outline" className="border-sydologie-green text-sydologie-green hover:bg-sydologie-green/10">
                      <FileDown className="mr-2 h-4 w-4" />
                      HTML
                    </Button>
                    <Button onClick={exportToPpt} variant="default" className="bg-sydologie-green hover:bg-sydologie-green/90">
                      <Download className="mr-2 h-4 w-4" />
                      PowerPoint
                    </Button>
                  </div>
                </div>
                <RevealPreview 
                  slidesHtml={slidesHtml} 
                  onExportPpt={exportToPpt}
                  onColorChange={handleColorChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DiapoAI;
