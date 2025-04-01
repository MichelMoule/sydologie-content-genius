
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  onExport: () => void;
}

export const ExportButton = ({ onExport }: ExportButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center"
      onClick={onExport}
    >
      <Download className="mr-2 h-4 w-4" />
      Exporter PPT
    </Button>
  );
};
