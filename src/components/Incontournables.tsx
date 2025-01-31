import { Button } from "./ui/button";

const tools = [
  {
    id: 1,
    name: "ProgrAImme",
    image: "/lovable-uploads/2c950e55-b356-4720-84ea-a6231962e14d.png",
    description: "Créez des programmes de formation personnalisés"
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
    description: "Créez des quiz personnalisés pour vos apprenants."
  }
];

const Incontournables = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            <span className="text-[#00FF00]">_</span>Les incontournables
          </h2>
          <Button className="bg-[#00FF00] hover:bg-[#00DD00] text-black font-medium px-6 py-3">
            Découvrir tous nos outils
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div key={tool.id} className="flex flex-col">
              <div className="relative aspect-video mb-4">
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                <span className="text-[#00FF00]">_</span>{tool.name}
              </h3>
              <p className="text-gray-700">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Incontournables;