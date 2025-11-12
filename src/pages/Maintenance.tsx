import { Wrench } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F5E40] to-[#2d7a5a] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-[#1F5E40]/10 p-6 rounded-full">
            <Wrench className="h-16 w-16 text-[#1F5E40] animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-[#1F5E40] mb-4 font-dmsans">
          Site en maintenance
        </h1>
        
        <p className="text-xl text-gray-700 mb-6 font-dmsans">
          Nous travaillons actuellement à améliorer votre expérience.
        </p>
        
        <p className="text-lg text-gray-600 font-dmsans">
          Le site sera bientôt de retour avec de nouvelles fonctionnalités !
        </p>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-dmsans">
            Pour toute question urgente, contactez-nous à{" "}
            <a 
              href="mailto:contact@sydologie.ai" 
              className="text-[#1F5E40] hover:underline font-medium"
            >
              contact@sydologie.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
