
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const tools = [
  {
    id: 1,
    name: "ProgrAImme",
    image: "/lovable-uploads/11f4232d-1b7a-4f8d-b618-46ab72d881b5.png",
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
    image: "/lovable-uploads/dca74049-15ef-475b-8004-d0e8846712c3.png",
    description: "Créez des quiz personnalisés pour vos apprenants.",
    path: "/outils/quiz"
  },
  {
    id: 4,
    name: "Flashcards",
    image: "/lovable-uploads/323c4fdf-2153-4ef0-9c92-5ea24ab4bade.png",
    description: "Créez des cartes pour mémoriser vos contenus",
    path: "/outils/flashcards"
  }
];

const Incontournables = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold font-sans">
            <span className="text-[#1F5E40]">_</span>Les incontournables
          </h2>
          <Link to="/outils">
            <Button className="bg-[#1F5E40] hover:bg-[#1F5E40]/90 text-white font-medium px-6 py-3 font-dmsans">
              Découvrir tous nos outils
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tools.map((tool) => (
            <Link key={tool.id} to={tool.path || "#"} className="flex flex-col">
              <div className="relative aspect-video mb-4">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-sans">
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
