
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import RevealPreview from "./RevealPreview";
import { ThemeColors } from "./pptx/types";
import { Presentation } from "lucide-react";

interface DiapoAIPreviewProps {
  slidesHtml: string | null;
  downloadHtml: () => void;
  exportToPpt: () => void;
  onColorChange: (colors: ThemeColors) => void;
  colors: ThemeColors;
}

export const DiapoAIPreview = ({
  slidesHtml,
  downloadHtml,
  exportToPpt,
  onColorChange,
  colors
}: DiapoAIPreviewProps) => {
  if (!slidesHtml) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-sydologie-green flex items-center gap-2 font-dmsans">
          <Presentation className="h-5 w-5" />
          Votre diaporama
        </h3>
        <div className="flex gap-2">
          <Button onClick={downloadHtml} variant="outline" className="border-sydologie-green text-sydologie-green hover:bg-sydologie-green/10 font-dmsans">
            <FileDown className="mr-2 h-4 w-4" />
            HTML
          </Button>
          <Button onClick={exportToPpt} variant="default" className="bg-sydologie-green hover:bg-sydologie-green/90 font-dmsans">
            <Download className="mr-2 h-4 w-4" />
            PowerPoint
          </Button>
        </div>
      </div>
      <RevealPreview 
        slidesHtml={slidesHtml} 
        onExportPpt={exportToPpt}
        onColorChange={onColorChange}
      />
    </div>
  );
};
