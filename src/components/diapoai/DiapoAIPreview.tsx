
import { useState, useRef, useEffect } from "react";
import { RevealPreview } from "./RevealPreview";
import { PreviewControls } from "./preview/PreviewControls";
import { ThemeColors } from "./types/ThemeColors";
import { OutlineSection } from "./types";
import { useToast } from "@/hooks/use-toast";

interface DiapoAIPreviewProps {
  slidesHtml: string;
  outline?: OutlineSection[] | null;
  downloadHtml: () => void;
  onColorChange?: (colors: ThemeColors) => void;
  colors: ThemeColors;
}

export const DiapoAIPreview = ({
  slidesHtml,
  outline,
  downloadHtml,
  onColorChange,
  colors,
}: DiapoAIPreviewProps) => {
  const [transition, setTransition] = useState<string>("slide");
  const { toast } = useToast();
  
  const handleDownload = () => {
    try {
      downloadHtml();
    } catch (error) {
      console.error("Error downloading HTML:", error);
      toast({
        title: "Erreur lors du téléchargement",
        description: "Une erreur est survenue lors de la préparation du fichier HTML.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Prévisualisation du diaporama</h2>
        
        <PreviewControls
          onDownload={handleDownload}
          onTransitionChange={setTransition}
          colors={colors}
          onColorChange={onColorChange}
        />
        
        <div className="border rounded-lg overflow-hidden bg-white shadow-md">
          <RevealPreview 
            slidesHtml={slidesHtml} 
            transition={transition}
            colors={colors}
            outline={outline}
          />
        </div>
      </div>
    </div>
  );
};
