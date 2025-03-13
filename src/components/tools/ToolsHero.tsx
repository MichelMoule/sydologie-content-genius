
import { Link } from "react-router-dom";
import { LightbulbIcon } from "lucide-react";

const ToolsHero = () => {
  return (
    <div className="bg-[#F2FCE2] py-16">
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/6">
            <h1 className="text-[#1F5E40] text-5xl md:text-6xl font-bold md:rotate-[-90deg] md:translate-y-20 whitespace-nowrap font-sans">
              OUTILS
            </h1>
          </div>
          <div className="md:w-5/6 space-y-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 font-dmsans text-[#403E43]">
                Nous développons des outils pour vous aider dans la conception, la réalisation et l'analyse de vos formations.
              </h2>
              <p className="text-lg md:text-2xl font-dmsans">
                <Link to="/contact" className="text-[#1F5E40] hover:underline">
                  Contactez-nous
                </Link>{" "}
                pour toute demande d'outil sur mesure.
              </p>
            </div>
            
            <div className="mt-6 flex flex-col md:flex-row items-start md:items-center bg-white p-4 rounded-lg shadow-sm">
              <div className="mr-4 bg-[#1F5E40]/20 p-3 rounded-full">
                <LightbulbIcon className="h-6 w-6 text-[#1F5E40]" />
              </div>
              <div className="font-dmsans mt-2 md:mt-0">
                <p className="font-bold">Une idée d'outil ?</p>
                <p className="text-gray-600">Contribuez au développement de sydologie.ai en proposant de nouvelles fonctionnalités</p>
              </div>
              <Link 
                to="/outils/suggestions" 
                className="mt-4 md:mt-0 md:ml-auto bg-[#1F5E40] text-white px-4 py-2 rounded-md hover:bg-[#1F5E40]/90 whitespace-nowrap font-dmsans"
              >
                Voir les propositions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToolsHero;
