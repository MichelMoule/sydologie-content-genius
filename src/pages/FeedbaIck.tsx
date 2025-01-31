import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackForm, formSchema } from "@/components/feedback/FeedbackForm";
import { FeedbackAnalysis } from "@/components/feedback/FeedbackAnalysis";
import { AnalysisData } from "@/components/feedback/types";
import { generateFeedbackPDF } from "@/components/feedback/FeedbackPDF";

const FeedbaIck = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainingName, setTrainingName] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsAnalyzing(true);
      setTrainingName(values.trainingName);
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour soumettre un retour.",
        });
        return;
      }

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-feedback', {
        body: {
          feedbackText: values.feedbackText,
          questionText: values.questionText,
        },
      });

      if (analysisError) throw analysisError;
      
      const jsonMatch = analysisData.analysis.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("Format de réponse invalide");
      }
      
      const parsedAnalysis: AnalysisData = JSON.parse(jsonMatch[1]);
      setAnalysis(parsedAnalysis);
      setIsDialogOpen(true);

      const { error } = await supabase.from("training_feedback").insert({
        user_id: user.id,
        training_name: values.trainingName,
        question_text: values.questionText,
        feedback_text: values.feedbackText,
        ai_analysis: analysisData.analysis,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre retour a été enregistré et analysé avec succès.",
      });

    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du retour.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!analysis) return;
    
    generateFeedbackPDF(analysis, trainingName);
    
    toast({
      title: "PDF généré avec succès",
      description: "Le téléchargement devrait commencer automatiquement.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block">
          &lt; Outils
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold">FEEDBAICK</h1>
            
            <h2 className="text-3xl font-bold leading-tight">
              Vous avez reçu des centaines de retours suite à votre dernière formation et ne savez pas comment les traiter rapidement ?
            </h2>
            
            <p className="text-lg">
              Utilisez notre outil pour analyser rapidement les retours de vos apprenants et obtenir une synthèse claire et actionnable.
            </p>
            
            <p className="text-lg">
              Notre système d'IA vous aide à identifier les points clés et les tendances dans les retours qualitatifs de vos formations.
            </p>
          </div>
          
          <FeedbackForm onSubmit={onSubmit} isAnalyzing={isAnalyzing} />
        </div>

        <Dialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
          modal={true}
        >
          <DialogContent 
            className="max-w-[90vw] w-[1200px] max-h-[90vh] overflow-y-auto"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>📊 {trainingName}</span>
                {analysis && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            {analysis && <FeedbackAnalysis analysis={analysis} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FeedbaIck;