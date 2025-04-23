
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { transitions } from "../types/revealTypes";

interface TransitionSelectorProps {
  currentTransition: string;
  onTransitionChange: (transition: string) => void;
}

export const TransitionSelector = ({ 
  currentTransition, 
  onTransitionChange 
}: TransitionSelectorProps) => {
  // Make sure transitions is defined and has a default if it's not
  const safeTransitions = transitions || [];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          Transition
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {safeTransitions.map((t) => (
          <DropdownMenuItem 
            key={t.value}
            onClick={() => onTransitionChange(t.value)}
            className="flex items-center justify-between"
          >
            {t.name}
            {currentTransition === t.value && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
