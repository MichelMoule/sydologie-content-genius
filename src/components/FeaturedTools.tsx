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
    description: "Analysez les retours récoltés après vos formations",
    images: [
      "/lovable-uploads/68794c7b-ae6c-4d5b-b6f2-757e45f8a8c1.png",
      "/lovable-uploads/15096693-685e-4df4-b6ab-a7a3d54d9a79.png"
    ],
    cta: "TESTEZ CET OUTIL"
  },
  // Les autres outils seront ajoutés ici
];

const FeaturedTools = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-12 font-unbounded">
        <span className="text-[#00FF00]">_</span>Nos outils à la une
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <div key={tool.id} className="flex flex-col">
            <Carousel className="w-full">
              <CarouselContent>
                {tool.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${tool.name} view ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden" />
              <CarouselNext />
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