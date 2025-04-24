import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Text } from "lucide-react";
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: 'generate' as const,
      need: "",
    } as any,
  });

  // Questions dynamiques basées sur le besoin initial
  const generateQuestionsForNeed = async (need: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: { action: 'generate_questions', need },
      });

      if (error) throw error;

      setQuestionState({
        currentQuestionIndex: 0,
        questions: data.questions,
        answers: [],
      });
    } catch (error) {
      console.error('Erreur lors de la génération des questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les questions complémentaires",
        variant: "destructive",
      });
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!questionState) return;

    const newAnswers = [
      ...questionState.answers,
      { 
        questionId: questionState.questions[questionState.currentQuestionIndex].id, 
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

  const generateFinalPrompt = async (data: PromptFormData & { answers: QuestionAnswer[] }) => {
    setIsLoading(true);
    onPromptGenerating(true);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('generate-prompt', {
        body: { ...data, action: 'generate_prompt' },
      });

      if (error) throw error;

      onPromptGenerated(responseData.data);
      toast({
        title: "Succès !",
        description: "Votre prompt a été généré avec succès.",
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
      setIsLoading(true);
      onPromptGenerating(true);
      
      try {
        const { data: responseData, error } = await supabase.functions.invoke('generate-prompt', {
          body: { ...data, action: 'improve_prompt' },
        });

        if (error) throw error;

        onPromptGenerated(responseData.data);
        toast({
          title: "Succès !",
          description: "Votre prompt a été analysé avec succès.",
        });
      } catch (error) {
        console.error("Erreur lors de l'amélioration du prompt:", error);
        toast({
          title: "Erreur",
          description: error instanceof Error ? error.message : "Une erreur est survenue",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        onPromptGenerating(false);
      }
    }
  };

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

                  <FormField
                    control={form.control}
                    name="context"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contexte (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informations complémentaires sur le contexte d'utilisation"
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Fournissez du contexte pour un prompt plus précis
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Public cible (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Professionnels, débutants..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ton souhaité (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Formel, conversationnel..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complexity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Niveau de complexité</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un niveau" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Simple">Simple</SelectItem>
                              <SelectItem value="Moyen">Moyen</SelectItem>
                              <SelectItem value="Avancé">Avancé</SelectItem>
                              <SelectItem value="Expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
