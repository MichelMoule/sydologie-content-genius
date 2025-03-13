
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { LightbulbIcon } from "lucide-react";

const tools = {
  conception: [
    {
      id: 1,
      name: "ProgrAImme",
      description: "Créez des programmes de formation personnalisés",
      image: "/lovable-uploads/11f4232d-1b7a-4f8d-b618-46ab72d881b5.png",
      path: "/outils/program"
    },
    {
      id: 2,
      name: "Quiiiiiz?",
      description: "Créez des quiz personnalisés pour vos apprenants",
      image: "/lovable-uploads/dca74049-15ef-475b-8004-d0e8846712c3.png",
      path: "/outils/quiz"
    },
    {
      id: 3,
      name: "Scrypto-vidéo",
      description: "Créez des scripts pour vos vidéos de formation",
      image: "/lovable-uploads/b7521456-bfcc-47d0-837b-5652b28664aa.png",
      path: "/outils/videoscript"
    },
    {
      id: 4,
      name: "Flashcards",
      description: "Créez des cartes pour mémoriser vos contenus",
      image: "/lovable-uploads/323c4fdf-2153-4ef0-9c92-5ea24ab4bade.png",
      path: "/outils/flashcards"
    }
  ],
  realisation: [
    {
      id: 5,
      name: "VulgArIsation",
      description: "Clarifiez vos contenus de formation complexes",
      image: "/lovable-uploads/5746b7f3-ddfa-46a9-adfe-93ea42150077.png",
      path: "/outils/vulgarisation"
    },
    {
      id: 6,
      name: "RésumA.I.",
      description: "Générez des résumés de vos contenus de formation",
      image: "/lovable-uploads/bca4e58f-deae-4e0d-b948-e4424fe1821e.png",
      path: "/outils/resume"
    },
    {
      id: 7,
      name: "Glossaire",
      description: "Créez des glossaires pour définir les termes clés",
      image: "/lovable-uploads/b293fc5f-d161-41c4-8889-8e2e574d9238.png",
      path: "/outils/glossaire"
    }
  ],
  analyse: [
    {
      id: 8,
      name: "FeedbaIck",
      description: "Analysez les retours récoltés après vos formations",
      image: "/lovable-uploads/fbe2b17e-21b8-415a-92ef-8187313ff78d.png",
      path: "/outils/feedbaick"
    }
  ]
};

const Outils = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex gap-8">
          <div className="w-1/6">
            <h1 className="text-[#1F5E40] text-6xl font-bold rotate-[-90deg] translate-y-20 whitespace-nowrap font-sans">
              OUTILS
            </h1>
          </div>
          <div className="w-5/6">
            <h2 className="text-4xl font-bold mb-8 font-dmsans">
              Nous développons des outils pour vous aidez dans la conception, la réalisation et l'analyse de vos formations.
            </h2>
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
              <Link 
                to="/outils/suggestions" 
                className="ml-auto bg-[#1F5E40] text-white px-4 py-2 rounded-md hover:bg-[#1F5E40]/90 whitespace-nowrap font-dmsans"
              >
                Voir les propositions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Sections */}
      <div className="container mx-auto px-4 pb-16">
        {/* Conception Tools */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-8 font-dmsans">
            <span className="text-[#1F5E40]">_</span>Nos outils de conception
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.conception.map((tool) => (
              <Link 
                key={tool.id} 
                to={tool.path || "#"} 
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold mb-2 font-dmsans">
                  <span className="text-[#1F5E40]">_</span>
                  {tool.name}
                </h4>
                <p className="text-gray-700 font-dmsans">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Realisation Tools */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-8 font-dmsans">
            <span className="text-[#1F5E40]">_</span>Nos outils pour la réalisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.realisation.map((tool) => (
              <Link 
                key={tool.id} 
                to={tool.path || "#"} 
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold mb-2 font-dmsans">
                  <span className="text-[#1F5E40]">_</span>
                  {tool.name}
                </h4>
                <p className="text-gray-700 font-dmsans">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Analysis Tools */}
        <section>
          <h3 className="text-2xl font-bold mb-8 font-dmsans">
            <span className="text-[#1F5E40]">_</span>Nos outils d'analyse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.analyse.map((tool) => (
              <Link 
                key={tool.id} 
                to={tool.path || "#"} 
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-bold mb-2 font-dmsans">
                  <span className="text-[#1F5E40]">_</span>
                  {tool.name}
                </h4>
                <p className="text-gray-700 font-dmsans">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Outils;
