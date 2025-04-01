
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransitionOption } from "../types/revealTypes";

interface TransitionSelectorProps {
  transitions: TransitionOption[];
  currentTransition: string;
  onTransitionChange: (transition: string) => void;
}

export const TransitionSelector = ({ 
  transitions, 
  currentTransition, 
  onTransitionChange 
}: TransitionSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          Transition
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {transitions.map((t) => (
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
