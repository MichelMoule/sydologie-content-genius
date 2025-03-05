
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { LightbulbIcon } from "lucide-react";

const tools = {
  conception: [
    {
      id: 1,
      name: "ProgrAImme",
      description: "Créez des programmes de formation personnalisés",
      image: "/lovable-uploads/2c950e55-b356-4720-84ea-a6231962e14d.png",
      path: "/outils/program"
    },
    {
      id: 2,
      name: "Quiiiiiz?",
      description: "Créez des quiz personnalisés pour vos apprenants",
      image: "/lovable-uploads/716e18bb-8160-42f9-8fb7-ec0f88d754ae.png",
      path: "/outils/quiz"
    },
    {
      id: 3,
      name: "Scrypto-vidéo",
      description: "Créez des scripts pour vos vidéos de formation",
      image: "/lovable-uploads/59464221-fdcc-4f6c-a58f-c27fcd17a54e.png",
      path: "/outils/videoscript"
    }
  ],
  realisation: [
    {
      id: 4,
      name: "VulgArIsation",
      description: "Clarifiez vos contenus de formation complexes",
      image: "/lovable-uploads/d21e80f7-bd87-4b90-9276-ad35db75f87a.png"
    },
    {
      id: 5,
      name: "RésumA.I.",
      description: "Générez des résumés de vos contenus de formation",
      image: "/lovable-uploads/0e8c9ea4-a2c6-457b-8ef0-e77b8572ec93.png"
    },
    {
      id: 6,
      name: "Flashcards",
      description: "Créez des cartes pour mémoriser vos contenus",
      image: "/lovable-uploads/716e18bb-8160-42f9-8fb7-ec0f88d754ae.png",
      path: "/outils/flashcards"
    }
  ],
  analyse: [
    {
      id: 7,
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
            <h1 className="text-[#0EA5E9] text-6xl font-bold rotate-[-90deg] translate-y-20 whitespace-nowrap">
              OUTILS
            </h1>
          </div>
          <div className="w-5/6">
            <h2 className="text-4xl font-bold mb-8">
              Nous développons des outils pour vous aidez dans la conception, la réalisation et l'analyse de vos formations.
            </h2>
            <p className="text-2xl mb-4">
              <Link to="/contact" className="text-[#0EA5E9] hover:underline">
                Contactez-nous
              </Link>{" "}
              pour toute demande d'outil sur mesure.
            </p>
            <div className="mt-6 flex items-center bg-gray-100 p-4 rounded-lg">
              <div className="mr-4 bg-[#00FF00]/20 p-3 rounded-full">
                <LightbulbIcon className="h-6 w-6 text-[#00FF00]" />
              </div>
              <div>
                <p className="font-bold">Une idée d'outil ?</p>
                <p className="text-gray-600">Contribuez au développement de sydologie.ai en proposant de nouvelles fonctionnalités</p>
              </div>
              <Link 
                to="/outils/suggestions" 
                className="ml-auto bg-[#00FF00] text-black px-4 py-2 rounded-md hover:bg-[#00FF00]/90 whitespace-nowrap"
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
          <h3 className="text-2xl font-bold mb-8">
            <span className="text-[#0EA5E9]">_</span>Nos outils de conception
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
                <h4 className="text-xl font-bold mb-2">
                  <span className="text-[#0EA5E9]">_</span>
                  {tool.name}
                </h4>
                <p className="text-gray-700">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Realisation Tools */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-8">
            <span className="text-[#0EA5E9]">_</span>Nos outils pour la réalisation
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
                <h4 className="text-xl font-bold mb-2">
                  <span className="text-[#0EA5E9]">_</span>
                  {tool.name}
                </h4>
                <p className="text-gray-700">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Analysis Tools */}
        <section>
          <h3 className="text-2xl font-bold mb-8">
            <span className="text-[#0EA5E9]">_</span>Nos outils d'analyse
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
                <h4 className="text-xl font-bold mb-2">
                  <span className="text-[#0EA5E9]">_</span>
                  {tool.name}
                </h4>
                <p className="text-gray-700">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Outils;
