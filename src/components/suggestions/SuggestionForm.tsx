import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(10, {
    message: "La description doit contenir au moins 10 caractères.",
  }),
  category: z.string({
    required_error: "Veuillez sélectionner une catégorie.",
  }),
  username: z.string().min(2, {
    message: "Le pseudo doit contenir au moins 2 caractères.",
  }),
});

type ToolSuggestion = {
  id: string;
  name: string;
  description: string;
  website: string;
  category: string;
  submitted_by: string;
  created_at: string;
  status: string;
  upvotes_count: number;
  downvotes_count: number;
  user_vote?: string | null;
};

type SuggestionFormProps = {
  setSuggestions: React.Dispatch<React.SetStateAction<ToolSuggestion[]>>;
  user: any;
  navigate: NavigateFunction;
};

const SuggestionForm = ({ setSuggestions, user, navigate }: SuggestionFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('Vous devez être connecté pour proposer un outil');
      navigate('/auth');
      return;
    }
    
    setSubmitting(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: values.username })
        .eq('id', user.id);
        
      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
      }
      
      const { data, error } = await supabase
        .from('tool_suggestions')
        .insert([
          {
            name: values.name,
            description: values.description,
            website: "",
            category: values.category,
            submitted_by: user.id
          }
        ])
        .select();
      
      if (error) throw error;
      
      form.reset();
      toast.success('Votre suggestion a été soumise avec succès!');
      
      if (data && data[0]) {
        setSuggestions(prev => [...prev, {
          ...data[0],
          upvotes_count: 0,
          downvotes_count: 0,
          username: values.username
        }]);
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la soumission de votre suggestion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4 font-dmsans">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-dmsans">Votre pseudo</FormLabel>
              <FormControl>
                <Input placeholder="Pseudo affiché avec votre suggestion" {...field} className="font-dmsans" />
              </FormControl>
              <FormDescription className="font-dmsans">
                Ce pseudo sera affiché publiquement avec votre suggestion
              </FormDescription>
              <FormMessage className="font-dmsans" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-dmsans">Nom de l'outil</FormLabel>
              <FormControl>
                <Input placeholder="ex: Générateur de scénarios pédagogiques" {...field} className="font-dmsans" />
              </FormControl>
              <FormMessage className="font-dmsans" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-dmsans">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Décrivez brièvement l'outil et son utilité..." 
                  {...field} 
                  className="font-dmsans"
                />
              </FormControl>
              <FormMessage className="font-dmsans" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-dmsans">Catégorie</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="font-dmsans">
                    <SelectValue placeholder="Sélectionner une catégorie" className="font-dmsans" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="font-dmsans">
                  <SelectItem value="conception" className="font-dmsans">Conception</SelectItem>
                  <SelectItem value="realisation" className="font-dmsans">Réalisation</SelectItem>
                  <SelectItem value="analyse" className="font-dmsans">Analyse</SelectItem>
                  <SelectItem value="autre" className="font-dmsans">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="font-dmsans" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-[#9b87f5] text-white hover:bg-[#8B5CF6] font-dmsans"
          disabled={submitting}
        >
          {submitting ? 'Envoi en cours...' : 'Soumettre ma proposition'}
        </Button>
        
        {!user && (
          <FormDescription className="text-yellow-600 font-dmsans">
            Vous devez être connecté pour proposer un outil.
          </FormDescription>
        )}
      </form>
    </Form>
  );
};

export default SuggestionForm;
