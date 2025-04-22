
import { ThemeSelector } from "./ThemeSelector";
import { TransitionSelector } from "./TransitionSelector";
import { ColorSelector } from "./ColorSelector";
import { ThemeOption, TransitionOption } from "../types/revealTypes";
import { ThemeColors } from "../types/ThemeColors";

interface PreviewControlsProps {
  themes: ThemeOption[];
  transitions: TransitionOption[];
  currentTheme: string;
  currentTransition: string;
  colors: ThemeColors;
  onThemeChange: (theme: string) => void;
  onTransitionChange: (transition: string) => void;
  onColorChange: (colorType: keyof ThemeColors, color: string) => void;
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
    </div>
  );
};
