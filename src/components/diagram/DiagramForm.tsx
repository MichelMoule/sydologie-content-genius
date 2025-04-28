
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(10, "Le contenu doit faire au moins 10 caractères"),
  type: z.enum(["suggestions", "generate"]),
  description: z.string().optional(),
  format: z.enum(["1:1", "16:9", "9:16"]).optional(),
});

interface DiagramFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isGenerating: boolean;
  suggestions: string[];
}

export function DiagramForm({ onSubmit, isGenerating, suggestions }: DiagramFormProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      type: "suggestions",
      format: "16:9",
    },
  });

  const type = form.watch("type");

  const handleSubmit = form.handleSubmit((values) => {
    if (values.type === "generate" && selectedSuggestion) {
      onSubmit({ ...values, description: selectedSuggestion });
    } else {
      onSubmit(values);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu pédagogique</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez le concept que vous souhaitez illustrer..."
                  className="h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suggestions" id="suggestions" />
                    <label htmlFor="suggestions">Générer des suggestions</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="generate" id="generate" />
                    <label htmlFor="generate">Générer un schéma</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "generate" && (
          <>
            {suggestions.length > 0 && (
              <FormItem>
                <FormLabel>Suggestions disponibles</FormLabel>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedSuggestion === suggestion
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary"
                      }`}
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1:1">Carré (1:1)</SelectItem>
                      <SelectItem value="16:9">Paysage (16:9)</SelectItem>
                      <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {type === "suggestions" 
              ? "L'IA va analyser votre contenu et proposer différentes façons de le représenter visuellement."
              : "L'IA va générer une image à partir de la description sélectionnée."}
          </AlertDescription>
        </Alert>

        <Button type="submit" className="w-full" disabled={isGenerating}>
          {isGenerating ? "Génération en cours..." : type === "suggestions" ? "Générer des suggestions" : "Générer le schéma"}
        </Button>
      </form>
    </Form>
  );
}
