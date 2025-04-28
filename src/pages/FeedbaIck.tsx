import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackForm, formSchema } from "@/components/feedback/FeedbackForm";
import { FeedbackAnalysis } from "@/components/feedback/FeedbackAnalysis";
import { AnalysisData } from "@/components/feedback/types";
import { generateFeedbackPDF } from "@/components/feedback/FeedbackPDF";
const FeedbaIck = () => {
  const {
    toast
  } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainingName, setTrainingName] = useState("");
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsAnalyzing(true);
      setTrainingName(values.trainingName);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour soumettre un retour."
        });
        return;
      }
      const {
        data: analysisData,
        error: analysisError
      } = await supabase.functions.invoke('analyze-feedback', {
        body: {
          feedbackText: values.feedbackText,
          questionText: values.questionText
        }
      });
      if (analysisError) throw analysisError;
      const jsonMatch = analysisData.analysis.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("Format de réponse invalide");
      }
      const parsedAnalysis: AnalysisData = JSON.parse(jsonMatch[1]);
      setAnalysis(parsedAnalysis);
      setIsDialogOpen(true);
      const {
        error
      } = await supabase.from("training_feedback").insert({
        user_id: user.id,
        training_name: values.trainingName,
        question_text: values.questionText,
        feedback_text: values.feedbackText,
        ai_analysis: analysisData.analysis
      });
      if (error) throw error;
      toast({
        title: "Succès",
        description: "Votre retour a été enregistré et analysé avec succès."
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du retour."
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
      description: "Le téléchargement devrait commencer automatiquement."
    });
  };
  return <div className="min-h-screen bg-background font-dmsans flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block font-dmsans">
          &lt; Outils
        </Link>
        
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-8 w-8 text-sydologie-green" />
            <div>
              <h1 className="text-3xl font-bold text-sydologie-green mb-2 font-dmsans">FEEDBAICK</h1>
              <p className="text-lg text-gray-700 font-dmsans">
                Analysez rapidement les retours de vos formations avec l'IA
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-8 mt-8">
          
          
          <div className="w-full max-w-4xl mx-auto">
            <FeedbackForm onSubmit={onSubmit} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
          <DialogContent className="max-w-[90vw] w-[1200px] max-h-[90vh] overflow-y-auto font-dmsans" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center font-dmsans">
                <span>📊 {trainingName}</span>
                {analysis && <Button variant="outline" size="sm" className="ml-4 font-dmsans" onClick={handleDownloadPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>}
              </DialogTitle>
            </DialogHeader>
            {analysis && <FeedbackAnalysis analysis={analysis} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>;
};
export default FeedbaIck;