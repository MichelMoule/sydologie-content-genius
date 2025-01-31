import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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

export const formSchema = z.object({
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

interface FeedbackFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isAnalyzing: boolean;
}

export const FeedbackForm = ({ onSubmit, isAnalyzing }: FeedbackFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingName: "",
      questionText: "Comment avez-vous trouvé la formation ?",
      feedbackText: "",
    },
  });

  return (
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
  );
};