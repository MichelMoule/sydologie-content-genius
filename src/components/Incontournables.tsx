
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const tools = [
  {
    id: 1,
    name: "ProgrAImme",
    image: "/lovable-uploads/2c950e55-b356-4720-84ea-a6231962e14d.png",
    description: "Créez des programmes de formation personnalisés",
    path: "/outils/program"
  },
  {
    id: 2,
    name: "VulgArIsation",
    image: "/lovable-uploads/d21e80f7-bd87-4b90-9276-ad35db75f87a.png",
    description: "Clarifiez vos contenus de formation complexes."
  },
  {
    id: 3,
    name: "Quiiiiiz?",
    image: "/lovable-uploads/716e18bb-8160-42f9-8fb7-ec0f88d754ae.png",
    description: "Créez des quiz personnalisés pour vos apprenants.",
    path: "/outils/quiz"
  }
];

const Incontournables = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold font-dmsans">
            <span className="text-[#1F5E40]">_</span>Les incontournables
          </h2>
          <Link to="/outils">
            <Button className="bg-[#1F5E40] hover:bg-[#1F5E40]/90 text-white font-medium px-6 py-3 font-dmsans">
              Découvrir tous nos outils
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link key={tool.id} to={tool.path || "#"} className="flex flex-col">
              <div className="relative aspect-video mb-4">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-dmsans">
                <span className="text-[#1F5E40]">_</span>{tool.name}
              </h3>
              <p className="text-gray-700 font-dmsans">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Incontournables;
