
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIForm } from "@/components/diapoai/DiapoAIForm";
import RevealPreview from "@/components/diapoai/RevealPreview";
import { OutlineSection } from "@/components/diapoai/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
      description: "Vous pouvez maintenant visualiser votre diaporama.",
    });
  };

  const downloadHtml = () => {
    if (!slidesHtml) return;

    // Create a full HTML document
    const fullHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diaporama généré par DiapoAI</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/theme/white.css">
  <style>
    .reveal .slides { height: 100%; }
  </style>
</head>
<body>
  ${slidesHtml}
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@4.3.1/dist/reveal.js"></script>
  <script>
    Reveal.initialize({
      controls: true,
      progress: true,
      center: true,
      hash: false,
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1B4D3E] mb-2">DiapoAI</h1>
            <p className="text-lg text-gray-700">
              Créez des présentations percutantes pour vos formations en quelques minutes
            </p>
          </div>

          <div className="grid gap-8">
            <DiapoAIForm 
              onOutlineGenerated={handleOutlineGenerated} 
              onSlidesGenerated={handleSlidesGenerated} 
            />
            
            {slidesHtml && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Votre diaporama</h3>
                  <Button onClick={downloadHtml} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
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
