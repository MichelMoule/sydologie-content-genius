import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const tools = [
  {
    id: 1,
    name: "FEEDBAICK",
    description: "ANALYSEZ LES RETOURS RÉCOLTÉS APRÈS VOS FORMATION",
    quote: '"An amazing tool" - John from Paris',
    images: [
      "/lovable-uploads/fbe2b17e-21b8-415a-92ef-8187313ff78d.png",
      "/lovable-uploads/17bf500e-81e6-4c34-8eab-a9c6f4f2a016.png"
    ],
    cta: "TESTEZ CET OUTIL",
    rating: 4
  },
  // Les autres outils seront ajoutés ici
];

const FeaturedTools = () => {
  return (
    <div className="w-full max-w-none py-16">
      <h2 className="text-3xl font-bold mb-12 font-unbounded container mx-auto">
        <span className="text-[#00FF00]">_</span>Nos outils à la une
      </h2>
      <div className="space-y-8">
        {tools.map((tool) => (
          <div key={tool.id} className="w-full">
            <Carousel className="w-full relative">
              <CarouselContent>
                {tool.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative">
                      <img 
                        src={image} 
                        alt={`${tool.name} slide ${index + 1}`}
                        className="w-full h-auto"
                      />
                      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-center">
                        <Button 
                          variant="ghost" 
                          className="text-[#00FF00] hover:text-[#00FF00]/90 font-unbounded"
                        >
                          {tool.cta}
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 bg-black/50 hover:bg-black/70 rounded-full border-none text-white transition-colors">
                  <ChevronRight className="h-8 w-8" />
                </CarouselNext>
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 bg-black/50 hover:bg-black/70 rounded-full border-none text-white transition-colors">
                  <ChevronLeft className="h-8 w-8" />
                </CarouselPrevious>
              </div>
            </Carousel>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTools;