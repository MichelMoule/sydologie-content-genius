
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const tools = [
  {
    id: 1,
    name: "FEEDBAICK",
    description: "ANALYSEZ LES RETOURS RÉCOLTÉS APRÈS VOS FORMATION",
    quote: '"An amazing tool" - John from Paris',
    images: [
      "/lovable-uploads/54f5902a-b223-49d6-99d1-66627d855a79.png",
      "/lovable-uploads/17bf500e-81e6-4c34-8eab-a9c6f4f2a016.png"
    ],
    cta: "TESTEZ CET OUTIL",
    path: "/outils/feedbaick",
    rating: 4
  },
  {
    id: 2,
    name: "GLOSSAIRE",
    description: "CRÉEZ DES GLOSSAIRES POUR DÉFINIR LES TERMES CLÉS",
    quote: "Terminologie claire",
    images: [
      "/lovable-uploads/b293fc5f-d161-41c4-8889-8e2e574d9238.png",
      "/lovable-uploads/b293fc5f-d161-41c4-8889-8e2e574d9238.png"
    ],
    cta: "TESTEZ CET OUTIL",
    path: "/outils/glossaire",
    rating: 4
  },
  {
    id: 3,
    name: "FLASHCARDS",
    description: "CRÉEZ DES CARTES POUR MÉMORISER VOS CONTENUS",
    quote: "Premium qualiA.I.",
    images: [
      "/lovable-uploads/323c4fdf-2153-4ef0-9c92-5ea24ab4bade.png",
      "/lovable-uploads/f36a7d7c-eae6-49b4-a128-6d31511bacd9.png"
    ],
    cta: "TESTEZ CET OUTIL",
    path: "/outils/flashcards",
    rating: 4
  }
];

const FeaturedTools = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full max-w-none py-8 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-12 font-sans container mx-auto px-4">
        <span className="text-[#1F5E40]">_</span>Nos outils à la une
      </h2>
      <div className="space-y-6 md:space-y-0">
        {tools.map((tool, index) => (
          <div key={tool.id} className="w-full">
            <Carousel className="w-full relative">
              <CarouselContent>
                {tool.images.map((image, imageIndex) => (
                  <CarouselItem key={imageIndex}>
                    <div className="relative">
                      <img 
                        src={image} 
                        alt={`${tool.name} slide ${imageIndex + 1}`}
                        className="w-full h-auto"
                      />
                      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-center">
                        <Link to={tool.path || "#"}>
                          <Button 
                            variant="ghost" 
                            className="text-[#1F5E40] hover:text-[#1F5E40]/90 font-sans"
                          >
                            {tool.cta}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {!isMobile && (
                <>
                  {index === 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 bg-black/50 hover:bg-black/70 rounded-full border-none text-white transition-colors">
                        <ChevronRight className="h-8 w-8" />
                      </CarouselNext>
                    </div>
                  )}
                  {index === tools.length - 1 && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-12 w-12 bg-black/50 hover:bg-black/70 rounded-full border-none text-white transition-colors">
                        <ChevronLeft className="h-8 w-8" />
                      </CarouselPrevious>
                    </div>
                  )}
                  {index !== 0 && index !== tools.length - 1 && (
                    <>
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
                    </>
                  )}
                </>
              )}
              {isMobile && (
                <>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-8 w-8 bg-black/50 hover:bg-black/70 rounded-full border-none text-white transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </CarouselNext>
                  </div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-8 w-8 bg-black/50 hover:bg-black/70 rounded-full border-none text-white transition-colors">
                      <ChevronLeft className="h-5 w-5" />
                    </CarouselPrevious>
                  </div>
                </>
              )}
            </Carousel>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTools;
