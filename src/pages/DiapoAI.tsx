
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIForm } from "@/components/diapoai/DiapoAIForm";
import { OutlineSection } from "@/components/diapoai/types";
import { useToast } from "@/hooks/use-toast";
import { processSvgDiagrams } from "@/components/diapoai/utils/SvgProcessor";
import { DiapoAIHeader } from "@/components/diapoai/DiapoAIHeader";
import { DiapoAIPreview } from "@/components/diapoai/DiapoAIPreview";
import { HtmlExporter } from "@/components/diapoai/exporters/HtmlExporter";
import { ThemeColors } from "@/components/diapoai/types/ThemeColors";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
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
