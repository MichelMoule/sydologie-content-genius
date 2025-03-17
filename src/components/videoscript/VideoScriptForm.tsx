
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const formSchema = z.object({
  topic: z.string().min(2, { message: "Le sujet est requis" }),
  targetAudience: z.string().optional(),
  duration: z.string().optional(),
  format: z.string().optional(),
  learningObjectives: z.string().optional(),
  tone: z.string().optional(),
  visualStyle: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

interface VideoScriptFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isGenerating: boolean;
}

export const VideoScriptForm = ({ onSubmit, isGenerating }: VideoScriptFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      targetAudience: "",
      duration: "",
      format: "",
      learningObjectives: "",
      tone: "",
      visualStyle: "",
      additionalInstructions: "",
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Générer un script de vidéo</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sujet de la vidéo*</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: L'intelligence artificielle en entreprise" {...field} />
                </FormControl>
                <FormDescription>
                  Le sujet principal de votre vidéo éducative
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public cible</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Adultes en formation professionnelle" {...field} />
                </FormControl>
                <FormDescription>
                  À qui s'adresse cette vidéo ?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée approximative</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 5-7 minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format de la vidéo</FormLabel>
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
                      <SelectItem value="Présentation explicative">Présentation explicative</SelectItem>
                      <SelectItem value="Tutoriel étape par étape">Tutoriel étape par étape</SelectItem>
                      <SelectItem value="Interview avec expert">Interview avec expert</SelectItem>
                      <SelectItem value="Débat / Discussion">Débat / Discussion</SelectItem>
                      <SelectItem value="Démonstration pratique">Démonstration pratique</SelectItem>
                      <SelectItem value="Narration avec animations">Narration avec animations</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Le style de présentation de votre vidéo
                  </FormDescription>
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
                    placeholder="Ex: Comprendre les bases de l'IA, Identifier les cas d'usage..." 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Que devront savoir les apprenants après avoir vu cette vidéo ?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ton</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Professionnel mais accessible" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visualStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style visuel</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Simple et épuré" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="additionalInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions supplémentaires</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ex: Inclure des exemples concrets..." 
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Génération en cours...
              </>
            ) : (
              "Générer le script"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
