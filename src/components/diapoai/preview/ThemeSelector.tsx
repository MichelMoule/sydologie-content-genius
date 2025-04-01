
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeOption } from "../types/revealTypes";

interface ThemeSelectorProps {
  themes: ThemeOption[];
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector = ({ themes, currentTheme, onThemeChange }: ThemeSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          Thème
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem 
            key={t.value}
            onClick={() => onThemeChange(t.value)}
            className="flex items-center justify-between"
          >
            {t.name}
            {currentTheme === t.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
