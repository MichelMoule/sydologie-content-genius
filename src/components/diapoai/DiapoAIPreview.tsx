
import { Presentation } from "lucide-react";
import RevealPreview from "./RevealPreview";
import { ThemeColors } from "./types/ThemeColors";

interface DiapoAIPreviewProps {
  slidesHtml: string | null;
  downloadHtml: () => void;
  colors: ThemeColors;
  onColorChange: (colors: ThemeColors) => void;
}

export const DiapoAIPreview = ({
  slidesHtml,
  downloadHtml,
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
      </div>
      <RevealPreview 
        slidesHtml={slidesHtml} 
        onColorChange={onColorChange}
      />
    </div>
  );
};
