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
    id: 3,
    name: "Glossaire",
    image: "/lovable-uploads/b293fc5f-d161-41c4-8889-8e2e574d9238.png",
    description: "Créez des glossaires pour définir les termes clés",
    path: "/outils/glossaire"
  },
  {
    id: 4,
    name: "Flashcards",
    image: "/lovable-uploads/323c4fdf-2153-4ef0-9c92-5ea24ab4bade.png",
    description: "Créez des cartes pour mémoriser vos contenus",
    path: "/outils/flashcards"
  },
  {
    id: 8,
    name: "FeedbaIck",
    image: "/lovable-uploads/54f5902a-b223-49d6-99d1-66627d855a79.png",
    description: "Analysez les retours récoltés après vos formations",
    path: "/outils/feedbaick"
  }
];

const Incontournables = () => {
  return (
    <section className="w-full py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold font-dmsans">
            <span className="text-[#1F5E40]">_</span>Les incontournables
          </h2>
          <Link to="/outils">
            <Button className="bg-[#1F5E40] hover:bg-[#1F5E40]/90 text-white font-medium px-4 md:px-6 py-2 md:py-3 font-dmsans w-full md:w-auto">
              Découvrir tous nos outils
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tools.map((tool) => (
            <Link 
              key={tool.id} 
              to={tool.path || "#"} 
              className="flex flex-col"
            >
              <div className="relative aspect-video mb-4">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 font-dmsans">
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
