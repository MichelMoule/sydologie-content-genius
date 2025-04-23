
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface SlideSpeakPreviewProps {
  presentationUrl: string;
}

export const SlideSpeakPreview = ({ presentationUrl }: SlideSpeakPreviewProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Téléchargement direct
      const link = document.createElement('a');
      link.href = presentationUrl;
      link.target = '_blank';
      link.download = 'presentation.pptx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Téléchargement démarré",
        description: "Votre présentation PowerPoint est en cours de téléchargement",
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement de la présentation",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const openInNewWindow = () => {
    window.open(presentationUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Votre présentation est prête</h2>
        
        <div className="flex flex-wrap gap-3 justify-end">
          <Button 
            variant="outline"
            onClick={openInNewWindow}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Ouvrir dans un nouvel onglet
          </Button>
          
          <Button 
            onClick={handleDownload}
            className="flex items-center gap-2"
            disabled={isDownloading}
          >
            <Download className="w-4 h-4" />
            Télécharger la présentation
          </Button>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-white shadow-md">
          <div className="aspect-video w-full flex items-center justify-center bg-gray-100">
            <iframe 
              src={presentationUrl} 
              className="w-full h-full"
              title="PowerPoint Presentation Preview"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
