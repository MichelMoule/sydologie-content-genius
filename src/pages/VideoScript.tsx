import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoScriptForm, formSchema } from "@/components/videoscript/VideoScriptForm";
import { VideoScriptAnalysis } from "@/components/videoscript/VideoScriptAnalysis";
import { VideoScriptData } from "@/components/videoscript/types";
import { generateVideoScriptPDF } from "@/components/videoscript/VideoScriptPDF";
import { supabase } from "@/integrations/supabase/client";

const VideoScript = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptData, setScriptData] = useState<VideoScriptData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scriptName, setScriptName] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsGenerating(true);
      setScriptName(values.topic);
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour générer un script vidéo.",
        });
        return;
      }

      // Set default values for empty fields
      const enhancedValues = {
        ...values,
        targetAudience: values.targetAudience || "Adultes en formation professionnelle",
        duration: values.duration || "5-7 minutes",
        format: values.format || "Présentation explicative",
        tone: values.tone || "Professionnel mais accessible",
        visualStyle: values.visualStyle || "Simple et épuré"
      };

      const { data: scriptResult, error: scriptError } = await supabase.functions.invoke('generate-video-script', {
        body: enhancedValues,
      });

      if (scriptError) throw scriptError;
      
      setScriptData(scriptResult.script);
      setIsDialogOpen(true);

      toast({
        title: "Succès",
        description: "Votre script vidéo a été généré avec succès.",
      });

    } catch (error) {
      console.error("Error generating video script:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du script vidéo.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!scriptData) return;
    generateVideoScriptPDF(scriptData, scriptName);
    
    toast({
      title: "PDF généré avec succès",
      description: "Le téléchargement devrait commencer automatiquement.",
    });
  };

  return (
    <div className="min-h-screen bg-background font-dmsans flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block font-dmsans">
          &lt; Outils
        </Link>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <VideoIcon className="h-8 w-8 text-sydologie-green" />
            <div>
              <h1 className="text-3xl font-bold text-sydologie-green mb-2 font-dmsans">Scrypto-vidéo</h1>
              <p className="text-lg text-gray-700 font-dmsans">
                Créez facilement des scripts pour vos vidéos pédagogiques en quelques minutes
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-8 mt-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold font-dmsans">Scrypto-vidéo</h1>
            <h2 className="text-3xl font-bold leading-tight font-dmsans">
              Créez facilement des scripts pour vos vidéos pédagogiques
            </h2>
            <p className="text-lg font-dmsans">
              Utilisez notre outil pour générer automatiquement des scripts de vidéos éducatives 
              basés sur vos besoins spécifiques.
            </p>
            <p className="text-lg font-dmsans">
              Notre système d'IA vous aide à structurer votre contenu avec des sections claires, 
              du texte de narration et des suggestions visuelles.
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <VideoScriptForm onSubmit={onSubmit} isGenerating={isGenerating} />
          </div>
        </div>

        <Dialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          modal={true}
        >
          <DialogContent 
            className="max-w-[90vw] w-[1200px] max-h-[90vh] overflow-y-auto font-dmsans"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center font-dmsans">
                <span>🎬 {scriptName}</span>
                {scriptData && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4 font-dmsans"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            {scriptData && <VideoScriptAnalysis script={scriptData} />}
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoScript;
