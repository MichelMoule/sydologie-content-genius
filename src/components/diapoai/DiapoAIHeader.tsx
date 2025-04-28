
import { Presentation } from "lucide-react";

export const DiapoAIHeader = () => {
  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Presentation className="h-8 w-8 text-sydologie-green" />
        <div>
          <h1 className="text-3xl font-bold text-sydologie-green mb-2 font-dmsans">DiapoAI</h1>
          <p className="text-lg text-gray-700 font-dmsans">
            Créez des présentations percutantes pour vos formations en quelques minutes
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-600">Propulsé par</p>
        <img 
          src="/lovable-uploads/add91aaa-29b6-4d20-b3d2-ce7dd35edc3b.png" 
          alt="SlideSpeak Logo" 
          className="h-8" 
        />
      </div>
    </div>
  );
};
