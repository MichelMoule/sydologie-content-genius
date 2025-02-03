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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const formSchema = z.object({
  quizName: z.string().min(2, {
    message: "Le nom du quiz doit faire au moins 2 caractères.",
  }),
  courseContent: z.string().min(50, {
    message: "Le contenu du cours doit faire au moins 50 caractères.",
  }),
  difficultyLevel: z.string(),
  numberOfQuestions: z.number().min(1).max(20),
});

interface QuizFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isAnalyzing: boolean;
}

export const QuizForm = ({ onSubmit, isAnalyzing }: QuizFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizName: "",
      courseContent: "",
      difficultyLevel: "intermediaire",
      numberOfQuestions: 10,
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-xl p-12 min-h-[600px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="quizName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du quiz</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Quiz Excel Avancé - Module 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="courseContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu du cours</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Copiez-collez ici le contenu de votre cours..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="difficultyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau de difficulté</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="debutant">Débutant</SelectItem>
                    <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                    <SelectItem value="avance">Avancé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="numberOfQuestions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de questions</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={20} 
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? "Génération en cours..." : "Générer le quiz"}
          </Button>
        </form>
      </Form>
    </div>
  );
};