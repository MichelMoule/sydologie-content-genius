
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIHeader } from "@/components/diapoai/DiapoAIHeader";
import { SlideSpeakForm } from "@/components/diapoai/SlideSpeakForm";
import { SlideSpeakPreview } from "@/components/diapoai/SlideSpeakPreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Gift } from "lucide-react";

const DiapoAI = () => {
  const [presentationUrl, setPresentationUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePresentationGenerating = (status: boolean) => {
    setIsGenerating(status);
  };

  const handlePresentationGenerated = (url: string) => {
    setPresentationUrl(url);
    setIsGenerating(false);
  };

  return <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <DiapoAIHeader />

          <Alert className="bg-yellow-50 border-yellow-200">
            <InfoIcon className="h-5 w-5 text-yellow-600" />
            <AlertTitle>Informations importantes</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>
                Cet outil utilise l'API de <a href="https://slidespeak.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SlideSpeak</a>. Veuillez noter que :
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Les présentations sont limitées à 10 diapositives maximum</li>
                <li>Le service n'est pas conforme RGPD car les données sont traitées hors UE</li>
                <li>Nous prenons en charge le coût de la solution pour vous <Gift className="inline-block w-4 h-4 ml-1" /></li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid gap-8">
            <SlideSpeakForm onPresentationGenerating={handlePresentationGenerating} onPresentationGenerated={handlePresentationGenerated} />
            
            {!presentationUrl && !isGenerating && (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-muted-foreground">
                  Entrez votre contenu et générz votre présentation pour la visualiser ici
                </p>
              </div>
            )}
            
            {presentationUrl && <SlideSpeakPreview presentationUrl={presentationUrl} />}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>;
};

export default DiapoAI;
