
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIForm } from "@/components/diapoai/DiapoAIForm";
import RevealPreview from "@/components/diapoai/RevealPreview";
import { OutlineSection } from "@/components/diapoai/types";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Presentation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DiapoAI = () => {
  const [outline, setOutline] = useState<OutlineSection[] | null>(null);
  const [slidesHtml, setSlidesHtml] = useState<string | null>(null);
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
    .reveal .slides { height: 100%; }
    body { 
      background: linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%);
      min-height: 100vh;
    }
    .reveal h1, .reveal h2 { color: #1B4D3E; font-weight: 700; margin-bottom: 0.5em; }
    .reveal h3, .reveal h4 { color: #1B4D3E; font-weight: 600; }
    .reveal .highlight { color: #FF9B7A; font-weight: 600; }
    .reveal .text-primary { color: #1B4D3E; }
    .reveal .text-secondary { color: #FF9B7A; }
    
    /* Enhanced bullet points */
    .reveal ul { list-style-type: none; margin-left: 0; }
    .reveal ul li { 
      position: relative; 
      margin-bottom: 0.8em; 
      padding-left: 1.5em; 
    }
    .reveal ul li:before {
      content: "•"; 
      color: #FF9B7A; 
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
      color: #1B4D3E;
      font-weight: bold;
      background: rgba(27,77,62,0.1);
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
      border-left: 4px solid #FF9B7A; 
      padding-left: 1em; 
      font-style: italic;
      background: rgba(255,155,122,0.1);
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
      background: rgba(27,77,62,0.1);
      border: 2px solid #1B4D3E;
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
      color: #1B4D3E;
      font-size: 1.5em;
    }
    
    /* Tables */
    .reveal table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    .reveal table th {
      background-color: rgba(27,77,62,0.2);
      color: #1B4D3E;
      font-weight: bold;
      text-align: left;
      padding: 0.5em;
      border: 1px solid rgba(27,77,62,0.3);
    }
    .reveal table td {
      padding: 0.5em;
      border: 1px solid rgba(27,77,62,0.2);
    }
    .reveal table tr:nth-child(even) {
      background-color: rgba(27,77,62,0.05);
    }
    
    /* Section title slides */
    .reveal section.section-title {
      background: linear-gradient(135deg, rgba(27,77,62,0.1) 0%, rgba(255,255,255,0.9) 100%);
    }
    
    /* Title slide */
    .reveal section.title-slide {
      background: linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%);
    }
    
    /* Horizontal divider */
    .reveal hr {
      border: 0;
      height: 2px;
      background: linear-gradient(to right, transparent, #1B4D3E, transparent);
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
            />
            
            {slidesHtml && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-sydologie-green flex items-center gap-2">
                    <Presentation className="h-5 w-5" />
                    Votre diaporama
                  </h3>
                  <Button onClick={downloadHtml} variant="outline" className="border-sydologie-green text-sydologie-green hover:bg-sydologie-green/10">
                    <FileDown className="mr-2 h-4 w-4" />
                    Télécharger HTML
                  </Button>
                </div>
                <RevealPreview slidesHtml={slidesHtml} />
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
