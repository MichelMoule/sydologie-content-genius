
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  onExport: () => void;
  label?: string;
  icon?: React.ReactNode;
  variant?: "outline" | "default" | "secondary" | "destructive" | "ghost" | "link";
}

export const ExportButton = ({ 
  onExport, 
  label = "Exporter PPT", 
  icon = <Download className="mr-2 h-4 w-4" />,
  variant = "outline"
}: ExportButtonProps) => {
  return (
    <Button 
      variant={variant} 
      className="flex items-center"
      onClick={onExport}
    >
      {icon}
      {label}
    </Button>
  );
};
