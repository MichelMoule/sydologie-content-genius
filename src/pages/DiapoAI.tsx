
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIHeader } from "@/components/diapoai/DiapoAIHeader";
import { SlideSpeakForm } from "@/components/diapoai/SlideSpeakForm";
import { SlideSpeakPreview } from "@/components/diapoai/SlideSpeakPreview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Presentation } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        <div className="max-w-5xl mx-auto">
          <DiapoAIHeader />

          <div className="grid gap-8">
            <SlideSpeakForm 
              onPresentationGenerating={handlePresentationGenerating}
              onPresentationGenerated={handlePresentationGenerated} 
            />
            
            {!presentationUrl && !isGenerating && (
              <Alert className="bg-muted border border-muted-foreground/20">
                <Presentation className="h-5 w-5" />
                <AlertDescription>
                  Générez votre première présentation PowerPoint en remplissant le formulaire ci-dessus.
                </AlertDescription>
              </Alert>
            )}
            
            {presentationUrl && (
              <SlideSpeakPreview presentationUrl={presentationUrl} />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DiapoAI;
