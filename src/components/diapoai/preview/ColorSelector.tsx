
import { PaintBucket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeColors } from "../pptx/types";

interface ColorSelectorProps {
  colors: ThemeColors;
  onColorChange: (colorType: keyof ThemeColors, color: string) => void;
}

export const ColorSelector = ({ colors, onColorChange }: ColorSelectorProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <PaintBucket className="mr-2 h-4 w-4" />
          Couleurs
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Personnalisation des couleurs</h4>
            <p className="text-sm text-muted-foreground">
              Choisissez les couleurs de votre diaporama
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="primaryColor">Couleur principale</Label>
              <div className="col-span-2 flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-md border" 
                  style={{ backgroundColor: colors.primary }}
                />
                <Input
                  id="primaryColor"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => onColorChange('primary', e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="secondaryColor">Couleur d'accent</Label>
              <div className="col-span-2 flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-md border" 
                  style={{ backgroundColor: colors.secondary }}
                />
                <Input
                  id="secondaryColor"
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => onColorChange('secondary', e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="textColor">Couleur du texte</Label>
              <div className="col-span-2 flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-md border" 
                  style={{ backgroundColor: colors.text }}
                />
                <Input
                  id="textColor"
                  type="color"
                  value={colors.text}
                  onChange={(e) => onColorChange('text', e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
              <Label htmlFor="backgroundColor">Couleur de fond</Label>
              <div className="col-span-2 flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-md border" 
                  style={{ backgroundColor: colors.background }}
                />
                <Input
                  id="backgroundColor"
                  type="color"
                  value={colors.background}
                  onChange={(e) => onColorChange('background', e.target.value)}
                  className="w-full h-8"
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
