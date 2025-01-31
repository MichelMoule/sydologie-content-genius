import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";

const tools = [
  {
    id: 1,
    name: "FEEDBAICK",
    description: "ANALYSEZ LES RETOURS RÉCOLTÉS APRÈS VOS FORMATION",
    quote: '"An amazing tool" - John from Paris',
    images: [
      "/lovable-uploads/68794c7b-ae6c-4d5b-b6f2-757e45f8a8c1.png",
      "/lovable-uploads/15096693-685e-4df4-b6ab-a7a3d54d9a79.png"
    ],
    cta: "TESTEZ CET OUTIL",
    rating: 4
  },
  // Les autres outils seront ajoutés ici
];

const FeaturedTools = () => {
  return (
    <div className="container mx-auto py-16">
      <h2 className="text-3xl font-bold mb-12 font-unbounded">
        <span className="text-[#00FF00]">_</span>Nos outils à la une
      </h2>
      <div className="space-y-8">
        {tools.map((tool) => (
          <div key={tool.id} className="w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {tool.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full bg-sydologie-red rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-8">
                        <div className="w-1/4">
                          {/* Placeholder for the vintage machine illustration */}
                        </div>
                        <div className="w-1/2 text-white text-center">
                          <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-2xl">
                                {i < tool.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-4xl font-bold mb-4 font-unbounded">{tool.name}</h3>
                          <p className="text-xl mb-2 font-unbounded">{tool.description}</p>
                          <p className="text-lg italic">{tool.quote}</p>
                        </div>
                        <div className="w-1/4 flex flex-col items-end">
                          <div className="text-white mb-2">+ d'info</div>
                          <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-auto w-auto bg-transparent hover:bg-transparent border-none text-white" />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                className="text-[#00FF00] hover:text-[#00FF00]/90 font-unbounded"
              >
                {tool.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTools;