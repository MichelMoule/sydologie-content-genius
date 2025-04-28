
import { ImageIcon } from "lucide-react";

export const SchemAIHeader = () => {
  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="h-8 w-8 text-sydologie-green" />
        <div>
          <h1 className="text-3xl font-bold text-sydologie-green mb-2 font-dmsans">SchemAI</h1>
          <p className="text-lg text-gray-700 font-dmsans">
            Créez des schémas pédagogiques pour vos formations en quelques minutes
          </p>
        </div>
      </div>
    </div>
  );
};
