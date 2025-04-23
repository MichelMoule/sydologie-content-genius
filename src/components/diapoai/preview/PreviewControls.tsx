
import { ThemeSelector } from "./ThemeSelector";
import { TransitionSelector } from "./TransitionSelector";
import { ColorSelector } from "./ColorSelector";
import { ThemeOption, TransitionOption, transitions } from "../types/revealTypes";
import { ThemeColors } from "../types/ThemeColors";

interface PreviewControlsProps {
  onDownload?: () => void;
  onTransitionChange?: (transition: string) => void;
  colors: ThemeColors;
  onColorChange?: (colors: ThemeColors) => void;
}

export const PreviewControls = ({
  onDownload,
  onTransitionChange,
  colors,
  onColorChange,
}: PreviewControlsProps) => {
  // Handler to adapt the ColorSelector's per-property updates to the full object updates
  const handleColorChange = (colorType: keyof ThemeColors, color: string) => {
    if (onColorChange) {
      const updatedColors = {
        ...colors,
        [colorType]: color
      };
      onColorChange(updatedColors);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {onTransitionChange && (
        <TransitionSelector
          currentTransition="slide"
          onTransitionChange={onTransitionChange}
          transitions={transitions}
        />
      )}

      {onColorChange && (
        <ColorSelector 
          colors={colors} 
          onColorChange={handleColorChange}
        />
      )}
      
      {onDownload && (
        <button 
          onClick={onDownload}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          Télécharger
        </button>
      )}
    </div>
  );
};
