
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DiagramPreviewProps {
  image: string;
}

export function DiagramPreview({ image }: DiagramPreviewProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `schema_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <img 
              src={image} 
              alt="Schéma généré"
              className="w-full h-full object-contain"
            />
          </div>
          
          <Button 
            onClick={handleDownload}
            className="w-full"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger le schéma
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
