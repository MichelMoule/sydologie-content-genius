
import { ThemeSelector } from "./ThemeSelector";
import { TransitionSelector } from "./TransitionSelector";
import { ColorSelector } from "./ColorSelector";
import { ExportButton } from "./ExportButton";
import { ThemeOption, TransitionOption } from "../types/revealTypes";
import { ThemeColors } from "../pptx/types";

interface PreviewControlsProps {
  themes: ThemeOption[];
  transitions: TransitionOption[];
  currentTheme: string;
  currentTransition: string;
  colors: ThemeColors;
  onThemeChange: (theme: string) => void;
  onTransitionChange: (transition: string) => void;
  onColorChange: (colorType: keyof ThemeColors, color: string) => void;
  onExportPpt?: () => void;
}

export const PreviewControls = ({
  themes,
  transitions,
  currentTheme,
  currentTransition,
  colors,
  onThemeChange,
  onTransitionChange,
  onColorChange,
  onExportPpt
}: PreviewControlsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <ThemeSelector 
        themes={themes} 
        currentTheme={currentTheme} 
        onThemeChange={onThemeChange} 
      />
      
      <TransitionSelector 
        transitions={transitions} 
        currentTransition={currentTransition} 
        onTransitionChange={onTransitionChange} 
      />

      <ColorSelector 
        colors={colors} 
        onColorChange={onColorChange} 
      />

      {onExportPpt && <ExportButton onExport={onExportPpt} />}
    </div>
  );
};
