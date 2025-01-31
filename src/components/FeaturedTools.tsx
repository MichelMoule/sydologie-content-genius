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
      "/lovable-uploads/cad45245-f1db-4a54-a2c5-1bc18b47967f.png",
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
                    <img 
                      src={image} 
                      alt={`${tool.name} slide ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-auto w-auto bg-transparent hover:bg-transparent border-none text-white" />
              </div>
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
