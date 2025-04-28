
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SchemAIHeader } from "@/components/schemai/SchemAIHeader";
import { DiagramForm } from "@/components/diagram/DiagramForm";
import { DiagramPreview } from "@/components/diagram/DiagramPreview";
import { supabase } from "@/integrations/supabase/client";

const SchemAI = () => {
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleFormSubmit = async (values: any) => {
    try {
      setIsGenerating(true);
      console.log("Form values:", values);
      
      if (values.type === "suggestions") {
        // Call the edge function to get suggestions
        const { data, error } = await supabase.functions.invoke('generate-pedagogical-diagram', {
          body: { 
            content: values.content,
            type: 'suggestions'
          }
        });

        if (error) {
          throw new Error(`Erreur API: ${error.message}`);
        }

        if (data?.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          toast.success("Suggestions générées avec succès");
        } else {
          throw new Error("Format de réponse invalide");
        }
      } else {
        // Call the edge function to generate the diagram
        const content = values.description || values.content;
        const format = values.format || "16:9";

        const { data, error } = await supabase.functions.invoke('generate-pedagogical-diagram', {
          body: { 
            content: content,
            type: 'generate',
            format: format
          }
        });

        if (error) {
          throw new Error(`Erreur API: ${error.message}`);
        }

        if (data?.image) {
          // Create a URL from the base64 image data
          const imageUrl = `data:image/png;base64,${data.image}`;
          setDiagramUrl(imageUrl);
          toast.success("Schéma généré avec succès");
        } else {
          throw new Error("L'image n'a pas pu être générée");
        }
      }
    } catch (error) {
      console.error("Error generating diagram:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur s'est produite lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block">&lt; Outils</Link>
        
        <div className="max-w-5xl mx-auto space-y-6">
          <SchemAIHeader />

          <div className="grid gap-8">
            <DiagramForm 
              onSubmit={handleFormSubmit}
              isGenerating={isGenerating}
              suggestions={suggestions}
            />
            
            {!diagramUrl && !isGenerating && (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-muted-foreground">
                  Entrez votre contenu et générez votre schéma pour le visualiser ici
                </p>
              </div>
            )}
            
            {diagramUrl && <DiagramPreview diagramUrl={diagramUrl} />}

            <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Découvrez SchemAI en vidéo</h2>
              <div className="aspect-video w-full rounded-md overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/Y49H6_dL9qs"
                  title="Présentation de SchemAI"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SchemAI;
