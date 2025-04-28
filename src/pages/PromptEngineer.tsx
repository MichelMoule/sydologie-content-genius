
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PromptForm } from "@/components/prompt/PromptForm";
import { PromptResult } from "@/components/prompt/PromptResult";
import { Text } from "lucide-react";
import type { PromptResult as PromptResultType } from "@/components/prompt/types";

const PromptEngineer = () => {
  const [promptResult, setPromptResult] = useState<PromptResultType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePromptGenerating = (status: boolean) => {
    setIsGenerating(status);
  };

  const handlePromptGenerated = (result: PromptResultType) => {
    setPromptResult(result);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        <Link to="/outils" className="text-sydologie-green hover:underline mb-8 inline-block font-dmsans">&lt; Outils</Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Text className="h-8 w-8 text-sydologie-green" />
              <div>
                <h1 className="text-3xl font-bold text-sydologie-green mb-2 font-dmsans">PromptEngineer</h1>
                <p className="text-lg text-gray-700 font-dmsans">
                  Créez des prompts optimisés pour vos projets en quelques minutes
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            <PromptForm 
              onPromptGenerating={handlePromptGenerating}
              onPromptGenerated={handlePromptGenerated} 
            />
            
            {!promptResult && !isGenerating && (
              <Alert className="bg-muted border border-muted-foreground/20">
                <Text className="h-5 w-5" />
                <AlertDescription className="font-dmsans">
                  Créez votre prompt en remplissant le formulaire ci-dessus. L'IA vous aidera à construire un prompt performant et adapté à vos besoins.
                </AlertDescription>
              </Alert>
            )}
            
            {promptResult && (
              <PromptResult result={promptResult} />
            )}

            {/* Information supplémentaire */}
            <div className="bg-muted rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 font-dmsans">Comment créer un bon prompt ?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2 font-dmsans">Les principes fondamentaux</h3>
                  <ul className="list-disc space-y-2 pl-5 font-dmsans">
                    <li>Soyez précis et spécifique dans vos demandes</li>
                    <li>Fournissez du contexte pour aider l'IA à comprendre</li>
                    <li>Structurez votre prompt avec des sections claires</li>
                    <li>Précisez le format de réponse attendu</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2 font-dmsans">Adaptez selon votre besoin</h3>
                  <ul className="list-disc space-y-2 pl-5 font-dmsans">
                    <li>Utilisez un ton adapté à votre audience</li>
                    <li>Ajustez le niveau de détail requis</li>
                    <li>Donnez des exemples si nécessaire</li>
                    <li>Itérez et affinez votre prompt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PromptEngineer;
