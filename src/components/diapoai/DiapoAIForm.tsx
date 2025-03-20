
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OutlineEditor from "./OutlineEditor";
import { useToast } from "@/hooks/use-toast";

// Theme color interface
interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const formSchema = z.object({
  content: z.string().min(10, { message: "Le contenu est requis (minimum 10 caractères)" }),
});

interface DiapoAIFormProps {
  onOutlineGenerated: (outline: any) => void;
  onSlidesGenerated: (slidesHtml: string) => void;
  onColorsChanged?: (colors: ThemeColors) => void;
}

export const DiapoAIForm = ({ onOutlineGenerated, onSlidesGenerated, onColorsChanged }: DiapoAIFormProps) => {
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [outline, setOutline] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [fileContent, setFileContent] = useState("");
  const [colors, setColors] = useState<ThemeColors>({
    primary: "#1B4D3E",
    secondary: "#FF9B7A",
    background: "#FFFFFF",
    text: "#333333"
  });
  
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a docx file
    if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast({
        title: "Format non supporté",
        description: "Veuillez télécharger un fichier .docx",
        variant: "destructive"
      });
      return;
    }

    // Simple file reader for text extraction (in a real app, you'd want to parse docx properly)
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      form.setValue("content", content);
    };
    reader.readAsText(file);
  };

  const generateOutline = async (values: z.infer<typeof formSchema>) => {
    setIsGeneratingOutline(true);
    try {
      console.log("Generating outline with content:", values.content.substring(0, 100) + "...");
      
      const { data, error } = await supabase.functions.invoke('generate-diapo', {
        body: { content: values.content, step: 'outline' },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Outline generated:", data);
      
      if (!data.outline) {
        throw new Error("La réponse ne contient pas de plan valide");
      }

      setOutline(data.outline);
      onOutlineGenerated(data.outline);
      setActiveTab("outline");
      
      toast({
        title: "Plan généré avec succès",
        description: "Vous pouvez maintenant modifier le plan avant de générer le diaporama",
      });
    } catch (error) {
      console.error("Error generating outline:", error);
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération du plan.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const generateSlides = async () => {
    if (!outline) {
      toast({
        title: "Plan manquant",
        description: "Veuillez d'abord générer un plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingSlides(true);
    try {
      console.log("Generating slides with outline:", outline);
      console.log("Using colors:", colors);
      
      const { data, error } = await supabase.functions.invoke('generate-diapo', {
        body: { 
          content: form.getValues("content"), 
          outline: outline, 
          colors: colors,
          step: 'slides' 
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Slides generated:", data);
      
      if (!data.slidesHtml) {
        throw new Error("La réponse ne contient pas de contenu HTML valide");
      }

      onSlidesGenerated(data.slidesHtml);
      setActiveTab("preview");
      
      toast({
        title: "Diaporama généré avec succès",
        description: "Vous pouvez maintenant visualiser votre diaporama",
      });
    } catch (error) {
      console.error("Error generating slides:", error);
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération des diapositives.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  const updateOutline = (newOutline: any[]) => {
    setOutline(newOutline);
  };

  const updateColors = (newColors: ThemeColors) => {
    setColors(newColors);
    if (onColorsChanged) {
      onColorsChanged(newColors);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="outline" disabled={!outline}>
            Plan
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!outline}>
            Prévisualisation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="p-6">
          <h3 className="text-xl font-semibold mb-4">Contenu de la formation</h3>
          
          <div className="mb-6">
            <div className="flex flex-col space-y-2 mb-4">
              <Label htmlFor="docxFile">Importer un fichier DOCX (optionnel)</Label>
              <Input 
                id="docxFile" 
                type="file" 
                accept=".docx" 
                onChange={handleFileUpload} 
                className="max-w-md"
              />
              <p className="text-sm text-muted-foreground">
                Ou saisissez directement votre contenu ci-dessous
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(generateOutline)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu de formation*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Saisissez ou collez votre contenu de formation ici..." 
                        className="min-h-[300px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Le contenu qui servira de base pour votre diaporama
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isGeneratingOutline}
              >
                {isGeneratingOutline ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Génération du plan en cours...
                  </>
                ) : (
                  "Générer le plan"
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="outline" className="p-6">
          <h3 className="text-xl font-semibold mb-4">Plan du diaporama</h3>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              {outline && <OutlineEditor outline={outline} onChange={updateOutline} />}
            </CardContent>
          </Card>
          
          <Button 
            onClick={generateSlides} 
            className="w-full" 
            disabled={isGeneratingSlides || !outline}
          >
            {isGeneratingSlides ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Génération des diapositives en cours...
              </>
            ) : (
              "Générer le diaporama"
            )}
          </Button>
        </TabsContent>

        <TabsContent value="preview" className="p-6">
          <h3 className="text-xl font-semibold mb-4">Prévisualisation du diaporama</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Le diaporama a été généré. Vous pouvez le visualiser ci-dessous.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
