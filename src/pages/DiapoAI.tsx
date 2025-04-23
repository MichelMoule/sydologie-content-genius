
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DiapoAIHeader } from "@/components/diapoai/DiapoAIHeader";
import { SlideSpeakForm } from "@/components/diapoai/SlideSpeakForm";
import { SlideSpeakPreview } from "@/components/diapoai/SlideSpeakPreview";

const DiapoAI = () => {
  const [presentationUrl, setPresentationUrl] = useState<string | null>(null);

  const handlePresentationGenerated = (url: string) => {
    setPresentationUrl(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-foreground flex flex-col font-dmsans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-auto">
        <div className="max-w-5xl mx-auto">
          <DiapoAIHeader />

          <div className="grid gap-8">
            <SlideSpeakForm onPresentationGenerated={handlePresentationGenerated} />
            
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
