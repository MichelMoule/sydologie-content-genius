
import { Calendar } from "lucide-react";

const FeaturedContent = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center space-x-3 mb-6 md:mb-8">
        <div className="w-8 h-8 bg-sydologie-green rounded-full flex items-center justify-center">
          <span className="text-white text-xl">→</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif">A la une</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Main Featured Article */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src="/lovable-uploads/5f2017ce-5cb8-42f0-a6e1-09371d6eb395.png" 
            alt="Featured Article" 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-serif mb-2">
              L'IA façonne vos croyances : en êtes-vous vraiment conscient ?
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              27 janvier, 2025
            </div>
            <p className="mt-4 text-gray-600 text-sm md:text-base">
              Ce premier article d'une longue série explorera les fondations psychologiques
              nécessaires pour comprendre comment les chatbots IA s'apprêtent à devenir...
            </p>
          </div>
        </div>

        {/* Secondary Featured Articles */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-serif mb-2">
              L'IA et apprentissage : entre fantasmes et réalités
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              20 janvier, 2025
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Entre les prophéties prédisant la fin des enseignants et les
              rêves d'un apprentissage personnalisé pour tous, le sujet ne manque...
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-serif mb-2">
              En bref
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              15 janvier, 2025
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Découvrez les dernières actualités et mises à jour dans le monde de
              l'éducation et de l'intelligence artificielle...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent;
