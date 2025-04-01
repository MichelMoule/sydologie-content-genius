
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIForm } from "@/components/diapoai/DiapoAIForm";
import { OutlineSection } from "@/components/diapoai/types";
import { useToast } from "@/hooks/use-toast";
import { convertHtmlToPptx } from "@/components/diapoai/pptxExport";
import { ThemeColors } from "@/components/diapoai/pptx/types";
import { processSvgDiagrams } from "@/components/diapoai/utils/SvgProcessor";
import { DiapoAIHeader } from "@/components/diapoai/DiapoAIHeader";
import { DiapoAIPreview } from "@/components/diapoai/DiapoAIPreview";
import { HtmlExporter } from "@/components/diapoai/exporters/HtmlExporter";

const DiapoAI = () => {
  const [outline, setOutline] = useState<OutlineSection[] | null>(null);
  const [slidesHtml, setSlidesHtml] = useState<string | null>(null);
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#1B4D3E",    // Sydologie green
    secondary: "#FF9B7A",  // Sydologie coral
    background: "#FFFFFF", // White background
    text: "#333333"        // Dark gray for text
  });
  const { toast } = useToast();
  const htmlExporter = slidesHtml ? HtmlExporter({ slidesHtml, colors }) : null;

  const handleOutlineGenerated = (generatedOutline: OutlineSection[]) => {
    setOutline(generatedOutline);
    toast({
      title: "Plan généré avec succès",
      description: "Vous pouvez maintenant modifier le plan ou générer le diaporama.",
    });
  };

  const handleSlidesGenerated = (html: string) => {
    const processedHtml = processSvgDiagrams(html);
    setSlidesHtml(processedHtml);
    toast({
      title: "Diaporama généré avec succès",
      description: "Vous pouvez maintenant visualiser et personnaliser votre diaporama.",
    });
  };

  const handleColorChange = (newColors: ThemeColors) => {
    setColors(newColors);
  };

  const exportToPpt = async () => {
    if (!slidesHtml) return;
    
    try {
      toast({
        title: "Conversion en cours",
        description: "Création du fichier PowerPoint...",
      });
      
      const processedHtml = processSvgDiagrams(slidesHtml);
      console.log('Processed HTML for PPT export (first 100 chars):', processedHtml.substring(0, 100));
      
      const pptxBlob = await convertHtmlToPptx(processedHtml, colors);
      
      const url = window.URL.createObjectURL(pptxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diapoai-presentation.pptx';
      document.body.appendChild(a);
      a.click();
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <DiapoAIHeader />

          <div className="grid gap-8">
            <DiapoAIForm 
              onOutlineGenerated={handleOutlineGenerated} 
              onSlidesGenerated={handleSlidesGenerated}
              onColorsChanged={handleColorChange}
            />
            
            {slidesHtml && (
              <DiapoAIPreview
                slidesHtml={slidesHtml}
                downloadHtml={htmlExporter?.downloadHtml || (() => {})}
                exportToPpt={exportToPpt}
                onColorChange={handleColorChange}
                colors={colors}
              />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DiapoAI;
