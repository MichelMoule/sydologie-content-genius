
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SchemAIHeader } from "@/components/schemai/SchemAIHeader";
import { DiagramForm } from "@/components/diagram/DiagramForm";
import { DiagramPreview } from "@/components/diagram/DiagramPreview";

const SchemAI = () => {
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDiagramGenerating = (status: boolean) => {
    setIsGenerating(status);
  };

  const handleDiagramGenerated = (url: string) => {
    setDiagramUrl(url);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <SchemAIHeader />

          <div className="grid gap-8">
            <DiagramForm 
              onDiagramGenerating={handleDiagramGenerating} 
              onDiagramGenerated={handleDiagramGenerated}
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
