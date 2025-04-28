
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiagramForm } from "@/components/diagram/DiagramForm";
import { supabase } from "@/integrations/supabase/client";
import { DiagramPreview } from "@/components/diagram/DiagramPreview";

const DiagramAI = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async (values: { 
    content: string; 
    type: 'suggestions' | 'generate';
    description?: string;
    format?: '1:1' | '16:9' | '9:16';
  }) => {
    try {
      setIsGenerating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour générer des schémas.",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-pedagogical-diagram', {
        body: values
      });

      if (error) throw error;

      if (values.type === 'suggestions') {
        setSuggestions(data.suggestions);
        toast({
          title: "Succès",
          description: "Les suggestions ont été générées avec succès.",
        });
      } else {
        setGeneratedImage(`data:image/png;base64,${data.image}`);
        toast({
          title: "Succès",
          description: "Le schéma a été généré avec succès.",
        });
      }
    } catch (error) {
      console.error("Error generating diagram:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-dmsans flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block">
          &lt; Outils
        </Link>
        
        <div className="flex flex-col space-y-8 mt-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold">DiagramAI</h1>
            <h2 className="text-3xl font-bold leading-tight">
              Générez des schémas pédagogiques avec l'IA
            </h2>
            <p className="text-lg">
              Créez facilement des schémas pédagogiques clairs et professionnels 
              à partir de vos contenus. Notre IA vous aide à visualiser vos concepts.
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <DiagramForm 
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
              suggestions={suggestions}
            />
            
            {generatedImage && (
              <DiagramPreview image={generatedImage} />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DiagramAI;
