import { Link } from "react-router-dom";
import { LightbulbIcon } from "lucide-react";
const ToolsHero = () => {
  return <section className="container mx-auto px-4 py-24">
      <div className="flex gap-8">
        <div className="w-1/6">
          <h1 className="text-[#1F5E40] font-bold translate-y-20 whitespace-nowrap font-sans text-4xl"></h1>
        </div>
        <div className="w-5/6">
          <h2 className="text-4xl font-bold mb-8 font-dmsans">Nous développons des outils pour vous aider dans la conception, la réalisation et l'analyse de vos formations.</h2>
          <p className="text-2xl mb-4 font-dmsans">
            <Link to="/contact" className="text-[#1F5E40] hover:underline">
              Contactez-nous
            </Link>{" "}
            pour toute demande d'outil sur mesure.
          </p>
          <div className="mt-6 flex items-center bg-gray-100 p-4 rounded-lg">
            <div className="mr-4 bg-[#1F5E40]/20 p-3 rounded-full">
              <LightbulbIcon className="h-6 w-6 text-[#1F5E40]" />
            </div>
            <div className="font-dmsans">
              <p className="font-bold">Une idée d'outil ?</p>
              <p className="text-gray-600">Contribuez au développement de sydologie.ai en proposant de nouvelles fonctionnalités</p>
            </div>
            <Link to="/outils/suggestions" className="ml-auto bg-[#1F5E40] text-white px-4 py-2 rounded-md hover:bg-[#1F5E40]/90 whitespace-nowrap font-dmsans">
              Voir les propositions
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default ToolsHero;