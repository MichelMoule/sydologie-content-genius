
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SchemAIHeader } from "@/components/schemai/SchemAIHeader";
import { DiagramForm } from "@/components/diagram/DiagramForm";
import { DiagramPreview } from "@/components/diagram/DiagramPreview";

const SchemAI = () => {
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleFormSubmit = async (values: any) => {
    try {
      setIsGenerating(true);
      console.log("Form values:", values);
      
      if (values.type === "suggestions") {
        // Simulate API call for suggestions
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockSuggestions = [
          "Un schéma circulaire montrant le cycle d'apprentissage",
          "Un diagramme en arborescence illustrant les concepts clés",
          "Une représentation en organigramme des étapes du processus"
        ];
        setSuggestions(mockSuggestions);
        toast.success("Suggestions générées avec succès");
      } else {
        // Simulate API call for diagram generation
        await new Promise(resolve => setTimeout(resolve, 2500));
        // Placeholder URL - in a real app, this would come from your API
        setDiagramUrl("https://placehold.co/600x400/png?text=Schéma+généré");
        toast.success("Schéma généré avec succès");
      }
    } catch (error) {
      console.error("Error generating diagram:", error);
      toast.error("Une erreur s'est produite lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
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
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SchemAI;
