
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
import { QuizForm, formSchema } from "@/components/quiz/QuizForm";
import { QuizAnalysis } from "@/components/quiz/QuizAnalysis";
import { QuizData } from "@/components/quiz/types";
import { generateQuizPDF } from "@/components/quiz/QuizPDF";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/use-language";

const Quiz = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
          title: t("error"),
          description: t("quiz.loginRequired"),
        });
        return;
      }

      // Add file validation
      if (values.courseFile) {
        const file = values.courseFile as File;
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            variant: "destructive",
            title: t("error"),
            description: t("quiz.fileTooLarge"),
          });
          setIsAnalyzing(false);
          return;
        }

        const fileExtension = file.name.toLowerCase().split('.').pop();
        if (fileExtension !== 'docx' && fileExtension !== 'txt') {
          toast({
            variant: "destructive",
            title: t("quiz.unsupportedFormat"),
            description: t("quiz.fileTypeError"),
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
        title: t("success"),
        description: t("quiz.successMessage"),
      });

    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("quiz.errorMessage"),
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!analysis) return;
    generateQuizPDF(analysis, quizName);
    
    toast({
      title: t("success"),
      description: t("quiz.pdfSuccess"),
    });
  };

  return (
    <div className="min-h-screen bg-background font-dmsans flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block font-dmsans">
          &lt; {t("tools.backToTools")}
        </Link>
        
        <div className="flex flex-col space-y-8 mt-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold font-dmsans">{t("quiz.title")}</h1>
            <h2 className="text-3xl font-bold leading-tight font-dmsans">
              {t("quiz.subtitle")}
            </h2>
            <p className="text-lg font-dmsans">
              {t("quiz.description1")}
            </p>
            <p className="text-lg font-dmsans">
              {t("quiz.description2")}
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
                    {t("quiz.form.download")}
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
