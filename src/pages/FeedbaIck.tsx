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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

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

const FeedbaIck = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingName: "",
      questionText: "Comment avez-vous trouvé la formation ?",
      feedbackText: "",
    },
  });

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

      // Analyze feedback using Azure OpenAI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-feedback', {
        body: {
          feedbackText: values.feedbackText,
          questionText: values.questionText,
        },
      });

      if (analysisError) throw analysisError;
      
      const aiAnalysis = analysisData.analysis;
      setAnalysis(aiAnalysis);

      // Save feedback and analysis to database
      const { error } = await supabase.from("training_feedback").insert({
        user_id: user.id,
        training_name: values.trainingName,
        question_text: values.questionText,
        feedback_text: values.feedbackText,
        ai_analysis: aiAnalysis,
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
          {/* Left Column */}
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

            {analysis && (
              <Alert className="mt-6">
                <AlertTitle className="text-xl">Analyse IA du retour</AlertTitle>
                <AlertDescription className="mt-2 whitespace-pre-wrap text-base">
                  {analysis}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          {/* Right Column - Feedback Form */}
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
      </div>
    </div>
  );
};

export default FeedbaIck;