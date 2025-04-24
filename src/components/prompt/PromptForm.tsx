
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Text } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PromptFormData, PromptResult, Question, QuestionAnswer, QuestionsState } from "./types";
import { PromptQuestionnaire } from "./PromptQuestionnaire";

// Schéma simplifié pour le formulaire initial
const generateSchema = z.object({
  mode: z.literal('generate'),
  need: z.string().min(10, "Le besoin doit contenir au moins 10 caractères"),
});

const improveSchema = z.object({
  mode: z.literal('improve'),
  need: z.string().min(10, "Le besoin doit contenir au moins 10 caractères"),
  prompt: z.string().min(20, "Le prompt doit contenir au moins 20 caractères"),
});

const formSchema = z.discriminatedUnion("mode", [
  generateSchema,
  improveSchema,
]);

interface PromptFormProps {
  onPromptGenerating: (status: boolean) => void;
  onPromptGenerated: (result: PromptResult) => void;
}

export function PromptForm({ onPromptGenerating, onPromptGenerated }: PromptFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'generate' | 'improve'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [questionState, setQuestionState] = useState<QuestionsState | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'generate' | 'improve');
    
    // Reset the form with the appropriate default values based on the tab
    form.reset({
      mode: value as 'generate' | 'improve',
      need: "",
      ...(value === 'improve' ? { prompt: "" } : {})
    });
    
    // Reset question state when switching tabs
    setQuestionState(null);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: 'generate' as const,
      need: "",
    },
  });

  // Questions dynamiques basées sur le besoin initial
  const generateQuestionsForNeed = async (need: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: { action: 'generate_questions', need },
      });

      if (error) throw error;

      if (data && Array.isArray(data.questions)) {
        setQuestionState({
          currentQuestionIndex: 0,
          questions: data.questions,
          answers: [],
        });
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (error) {
      console.error('Erreur lors de la génération des questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les questions complémentaires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!questionState || !questionState.questions || questionState.questions.length === 0) return;

    const currentQuestion = questionState.questions[questionState.currentQuestionIndex];
    if (!currentQuestion) return;

    const newAnswers = [
      ...questionState.answers,
      { 
        questionId: currentQuestion.id, 
        answer 
      }
    ];

    if (questionState.currentQuestionIndex + 1 < questionState.questions.length) {
      // Passer à la question suivante
      setQuestionState({
        ...questionState,
        currentQuestionIndex: questionState.currentQuestionIndex + 1,
        answers: newAnswers,
      });
    } else {
      // Toutes les questions ont été répondues, générer le prompt final
      await generateFinalPrompt({
        mode: 'generate',
        need: form.getValues('need'),
        answers: newAnswers,
      });
    }
  };

  const generateFinalPrompt = async (data: PromptFormData & { answers?: QuestionAnswer[] }) => {
    setIsLoading(true);
    onPromptGenerating(true);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('generate-prompt', {
        body: { 
          ...data, 
          action: data.mode === 'generate' ? 'generate_prompt' : 'improve_prompt' 
        },
      });

      if (error) throw error;

      onPromptGenerated(responseData);
      toast({
        title: "Succès !",
        description: `Votre prompt a été ${data.mode === 'generate' ? 'généré' : 'analysé'} avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la génération du prompt:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onPromptGenerating(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.mode === 'generate') {
      await generateQuestionsForNeed(data.need);
    } else {
      await generateFinalPrompt(data as PromptFormData);
    }
  };

  // If we're showing questions, render the questionnaire
  if (questionState && questionState.questions && questionState.questions.length > 0) {
    const currentQuestion = questionState.questions[questionState.currentQuestionIndex];
    const isLastQuestion = questionState.currentQuestionIndex === questionState.questions.length - 1;
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Quelques questions complémentaires</h3>
        {currentQuestion && (
          <PromptQuestionnaire
            question={currentQuestion}
            onAnswer={handleAnswer}
            isLastQuestion={isLastQuestion}
          />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold">Générateur de prompts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Créez ou améliorez vos prompts pour obtenir de meilleurs résultats avec l'IA
        </p>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Créer un prompt</TabsTrigger>
            <TabsTrigger value="improve">Améliorer un prompt</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <TabsContent value="generate">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="need"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quel est votre besoin ?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Exemple : Je veux générer une description de produit convaincante"
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Décrivez précisément ce que vous souhaitez obtenir
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="improve">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Votre prompt actuel</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Collez ici le prompt que vous souhaitez améliorer"
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Nous analyserons ce prompt et proposerons des améliorations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="need"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quel est votre besoin ?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez ce que vous essayez d'accomplir avec ce prompt"
                            className="h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Cette information nous aidera à mieux comprendre votre objectif
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    activeTab === 'generate' ? "Générer le prompt" : "Améliorer le prompt"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}
