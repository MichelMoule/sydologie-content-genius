import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizForm, formSchema } from "@/components/quiz/QuizForm";
import { QuizAnalysis } from "@/components/quiz/QuizAnalysis";
import { QuizData } from "@/components/quiz/types";
import { generateQuizPDF } from "@/components/quiz/QuizPDF";

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

      // TODO: Implement quiz generation logic with AI
      const mockQuizData: QuizData = {
        questions: [
          {
            question: "Question exemple 1",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0
          },
          {
            question: "Question exemple 2",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 1
          }
        ]
      };

      setAnalysis(mockQuizData);
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block">
          &lt; Outils
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold">QUIIIIIZ?</h1>
            
            <h2 className="text-3xl font-bold leading-tight">
              Vous souhaitez créer rapidement un quiz pour évaluer vos apprenants ?
            </h2>
            
            <p className="text-lg">
              Utilisez notre outil pour générer automatiquement des quiz pertinents basés sur vos contenus de formation.
            </p>
            
            <p className="text-lg">
              Notre système d'IA vous aide à créer des questions variées et adaptées à votre contenu.
            </p>
          </div>
          
          <QuizForm onSubmit={onSubmit} isAnalyzing={isAnalyzing} />
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
                <span>❓ {quizName}</span>
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
            {analysis && <QuizAnalysis quiz={analysis} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Quiz;