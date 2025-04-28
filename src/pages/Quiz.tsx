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
import { Download, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizForm, formSchema } from "@/components/quiz/QuizForm";
import { QuizAnalysis } from "@/components/quiz/QuizAnalysis";
import { QuizData } from "@/components/quiz/types";
import { generateQuizPDF } from "@/components/quiz/QuizPDF";
import { supabase } from "@/integrations/supabase/client";

const Quiz = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<QuizData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quizName, setQuizName] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsAnalyzing(true);
      setQuizName(values.quizName);
      
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour générer un quiz.",
        });
        return;
      }

      if (values.courseFile) {
        const file = values.courseFile as File;
        if (file.size > 5 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Le fichier est trop volumineux. Limite: 5MB."
          });
          setIsAnalyzing(false);
          return;
        }

        const fileExtension = file.name.toLowerCase().split('.').pop();
        if (fileExtension !== 'docx' && fileExtension !== 'txt') {
          toast({
            variant: "destructive",
            title: "Format non supporté",
            description: "Veuillez sélectionner un fichier Word (.docx) ou texte (.txt)"
          });
          setIsAnalyzing(false);
          return;
        }
      }

      const { data: quizData, error: quizError } = await supabase.functions.invoke('generate-quiz', {
        body: values,
      });

      if (quizError) throw quizError;
      
      setAnalysis(quizData.quiz);
      setIsDialogOpen(true);

      toast({
        title: "Succès",
        description: "Votre quiz a été généré avec succès.",
      });

    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération du quiz.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!analysis) return;
    generateQuizPDF(analysis, quizName);
    
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
            <ListChecks className="h-8 w-8 text-sydologie-green" />
            <div>
              <h1 className="text-3xl font-bold text-sydologie-green mb-2 font-dmsans">QUIIIIIZ?</h1>
              <p className="text-lg text-gray-700 font-dmsans">
                Créez des quiz interactifs pour évaluer vos apprenants en quelques minutes
              </p>
            </div>
          </div>
        </div>
          
        <div className="flex flex-col space-y-8 mt-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold font-dmsans">QUIIIIIZ?</h1>
            <h2 className="text-3xl font-bold leading-tight font-dmsans">
              Vous souhaitez créer rapidement un quiz pour évaluer vos apprenants ?
            </h2>
            <p className="text-lg font-dmsans">
              Utilisez notre outil pour générer automatiquement des quiz pertinents basés sur vos contenus de formation.
            </p>
            <p className="text-lg font-dmsans">
              Notre système d'IA vous aide à créer des questions variées et adaptées à votre contenu.
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <QuizForm onSubmit={onSubmit} isAnalyzing={isAnalyzing} />
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
                <span>❓ {quizName}</span>
                {analysis && (
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
            {analysis && <QuizAnalysis quiz={analysis} />}
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
};

export default Quiz;
