import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import jsPDF from "jspdf";

const formSchema = z.object({
  trainingName: z.string().min(2, {
    message: "Le nom de la formation doit faire au moins 2 caractères.",
  }),
  questionText: z.string().min(10, {
    message: "La question doit faire au moins 10 caractères.",
  }),
  feedbackText: z.string().min(10, {
    message: "Le retour doit faire au moins 10 caractères.",
  }),
});

interface Theme {
  title: string;
  percentage: number;
  description: string;
  testimonials: string[];
  isNegative: boolean;
  improvements?: string[];
}

interface AnalysisData {
  subject: string;
  question: string;
  totalResponses: number;
  summary: string;
  themes: Theme[];
}

const FeedbaIck = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingName: "",
      questionText: "Comment avez-vous trouvé la formation ?",
      feedbackText: "",
    },
  });

  const generatePDF = () => {
    if (!analysis) return;

    const pdf = new jsPDF();
    let yPosition = 20;
    const lineHeight = 10;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.width;

    // Configuration des styles
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(155, 135, 245); // Couleur primaire #9b87f5

    // Titre principal
    pdf.text(`📊 ${analysis.subject}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Informations de base
    pdf.setFontSize(12);
    pdf.setTextColor(142, 145, 150); // Couleur neutre #8E9196
    pdf.text(`❓ Question posée : ${analysis.question}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`👥 Nombre de réponses : ${analysis.totalResponses}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Résumé global
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(126, 105, 171); // Couleur secondaire #7E69AB
    pdf.text("📝 Résumé global", margin, yPosition);
    yPosition += lineHeight;

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(34, 31, 38); // Couleur foncée #221F26
    const summaryLines = pdf.splitTextToSize(analysis.summary, pageWidth - 2 * margin);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += (summaryLines.length * lineHeight) + lineHeight;

    // Analyse par thème
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(126, 105, 171);
    pdf.text("🎯 Analyse par thème", margin, yPosition);
    yPosition += lineHeight * 2;

    analysis.themes.forEach((theme) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > pdf.internal.pageSize.height - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      const emoji = theme.isNegative ? "⚠️" : "✅";
      pdf.setFont("helvetica", "bold");
      pdf.text(`${emoji} ${theme.title} (${theme.percentage}%)`, margin, yPosition);
      yPosition += lineHeight;

      pdf.setFont("helvetica", "normal");
      const descLines = pdf.splitTextToSize(theme.description, pageWidth - 2 * margin);
      pdf.text(descLines, margin, yPosition);
      yPosition += (descLines.length * lineHeight) + lineHeight;

      // Témoignages
      pdf.setFont("helvetica", "italic");
      theme.testimonials.forEach((testimonial) => {
        if (yPosition > pdf.internal.pageSize.height - 40) {
          pdf.addPage();
          yPosition = 20;
        }
        const testLines = pdf.splitTextToSize(`"${testimonial}"`, pageWidth - 2 * margin - 10);
        pdf.text(testLines, margin + 5, yPosition);
        yPosition += (testLines.length * lineHeight) + 5;
      });

      // Suggestions d'amélioration pour les thèmes négatifs
      if (theme.isNegative && theme.improvements) {
        if (yPosition > pdf.internal.pageSize.height - 40) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFont("helvetica", "bold");
        pdf.text("💡 Suggestions d'amélioration:", margin, yPosition);
        yPosition += lineHeight;

        pdf.setFont("helvetica", "normal");
        theme.improvements.forEach((improvement) => {
          const impLines = pdf.splitTextToSize(`• ${improvement}`, pageWidth - 2 * margin - 10);
          pdf.text(impLines, margin + 5, yPosition);
          yPosition += (impLines.length * lineHeight) + 5;
        });
      }

      yPosition += lineHeight;
    });

    pdf.save(`analyse_${analysis.subject.toLowerCase().replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "PDF généré avec succès",
      description: "Le téléchargement devrait commencer automatiquement.",
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsAnalyzing(true);
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
      
      // Extract JSON from markdown response
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/outils" className="text-[#00FF00] hover:underline mb-8 inline-block">
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
          
          <div className="bg-white rounded-lg shadow-xl p-12 min-h-[600px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="trainingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la formation</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Formation Excel Avancé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="questionText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question posée aux apprenants</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Comment avez-vous trouvé la formation ?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="feedbackText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retour qualitatif</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Copiez-collez ici les retours qualitatifs de vos apprenants..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyse en cours..." : "Analyser les retours"}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>📊 Analyse des retours</span>
                {analysis && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={generatePDF}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger PDF
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            {analysis && (
              <div className="space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">{analysis.subject}</h2>
                  <p className="text-gray-600 mb-2">❓ Question posée : {analysis.question}</p>
                  <p className="text-gray-600">👥 Nombre de réponses : {analysis.totalResponses}</p>
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3 className="text-xl font-semibold mb-4">📝 Résumé global</h3>
                  <p>{analysis.summary}</p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">🎯 Analyse par thème</h3>
                  {analysis.themes.map((theme, index) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-lg ${
                        theme.isNegative ? 'bg-red-50' : 'bg-green-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold">
                          {theme.isNegative ? "⚠️" : "✅"} {theme.title}
                        </h4>
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-white">
                          {theme.percentage}%
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{theme.description}</p>
                      
                      <div className="space-y-2">
                        <h5 className="font-medium">💬 Témoignages représentatifs :</h5>
                        <ul className="list-disc pl-5 space-y-2">
                          {theme.testimonials.map((testimonial, tIndex) => (
                            <li key={tIndex} className="text-gray-600">
                              {testimonial}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {theme.isNegative && theme.improvements && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="font-medium mb-2">💡 Suggestions d'amélioration :</h5>
                          <ul className="list-disc pl-5 space-y-2">
                            {theme.improvements.map((improvement, iIndex) => (
                              <li key={iIndex} className="text-gray-600">
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FeedbaIck;
