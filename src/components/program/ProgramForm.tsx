
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
  programName: z.string().min(2, {
    message: "Le nom du programme doit faire au moins 2 caractères.",
  }),
  subjectMatter: z.string().min(10, {
    message: "La matière du programme doit faire au moins 10 caractères.",
  }),
  targetAudience: z.string().min(5, {
    message: "Veuillez décrire le public cible (minimum 5 caractères).",
  }),
  duration: z.string().min(1, {
    message: "Veuillez spécifier une durée.",
  }),
  learningObjectives: z.string().min(10, {
    message: "Les objectifs d'apprentissage doivent faire au moins 10 caractères.",
  }),
  prerequisites: z.string().optional(),
  preferredFormat: z.string().min(1, {
    message: "Veuillez sélectionner un format préféré.",
  }),
  additionalRequirements: z.string().optional(),
});

interface ProgramFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isGenerating: boolean;
}

export const ProgramForm = ({ onSubmit, isGenerating }: ProgramFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programName: "",
      subjectMatter: "",
      targetAudience: "",
      duration: "",
      learningObjectives: "",
      prerequisites: "",
      preferredFormat: "modules",
      additionalRequirements: "",
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-xl p-12 min-h-[600px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="programName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du programme</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Formation Excel Avancé" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subjectMatter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matière ou sujet du programme</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ex: Formation approfondie sur Excel incluant les formules avancées, tableaux croisés dynamiques, etc."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public cible</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Professionnels, débutants, experts..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée totale</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3 jours, 21 heures, 2 semaines..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="learningObjectives"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objectifs d'apprentissage</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ex: À la fin de cette formation, les apprenants seront capables de..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="prerequisites"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prérequis (optionnel)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ex: Connaissance de base en informatique, expérience préalable avec..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preferredFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format préféré</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="modules">Modules</SelectItem>
                    <SelectItem value="sessions">Sessions</SelectItem>
                    <SelectItem value="jours">Journées</SelectItem>
                    <SelectItem value="semaines">Semaines</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additionalRequirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exigences ou précisions supplémentaires (optionnel)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ex: Inclure des études de cas, prévoir des exercices pratiques..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600" 
            disabled={isGenerating}
          >
            {isGenerating ? "Génération en cours..." : "Générer le programme"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
