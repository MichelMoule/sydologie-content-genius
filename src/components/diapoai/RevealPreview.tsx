
import React, { useRef, useState, useEffect } from 'react';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import { useToast } from '@/hooks/use-toast';
import { ThemeColors } from './pptx/types';
import { themes, transitions } from './types/revealTypes';
import { useRevealInit } from './hooks/useRevealInit';
import { PreviewControls } from './preview/PreviewControls';
import { SlidesContainer } from './preview/SlidesContainer';

interface RevealPreviewProps {
  slidesHtml: string;
  onExportPpt?: () => void;
  onColorChange?: (colors: ThemeColors) => void;
}

const RevealPreview = ({ slidesHtml, onExportPpt, onColorChange }: RevealPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState('white');
  const [transition, setTransition] = useState('slide');
  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primary: "#1B4D3E",
    secondary: "#FF9B7A",
    background: "#FFFFFF",
    text: "#333333"
  });
  const { toast } = useToast();
  
  // Initialiser Reveal.js
  const { deck } = useRevealInit(containerRef, slidesHtml, themeColors, transition);

  // Afficher un toast quand la prévisualisation est prête
  useEffect(() => {
    if (deck) {
      toast({
        title: "Prévisualisation prête",
        description: "Utilisez les flèches ou cliquez pour naviguer entre les diapositives."
      });
    }
  }, [deck, toast]);

  // Gérer les changements de couleurs
  const handleColorChange = (colorType: keyof ThemeColors, color: string) => {
    const newColors = { ...themeColors, [colorType]: color };
    setThemeColors(newColors);
    
    if (onColorChange) {
      onColorChange(newColors);
    }
    
    toast({
      title: "Couleurs mises à jour",
      description: "Les couleurs du diaporama ont été changées."
    });
  };

  return (
    <div className="space-y-4">
      <PreviewControls 
        themes={themes}
        transitions={transitions}
        currentTheme={theme}
        currentTransition={transition}
        colors={themeColors}
        onThemeChange={setTheme}
        onTransitionChange={setTransition}
        onColorChange={handleColorChange}
        onExportPpt={onExportPpt}
      />
      
      <SlidesContainer ref={containerRef} slidesHtml={slidesHtml} />
      
      <div className="text-sm text-muted-foreground mt-2">
        <p>Utilisez les flèches du clavier ou cliquez sur les côtés pour naviguer entre les diapositives.</p>
        <p>Les diapositives sont chargées mais peuvent apparaître vides jusqu'à ce que vous naviguiez.</p>
      </div>
    </div>
  );
};

export default RevealPreview;
