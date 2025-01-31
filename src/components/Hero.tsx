import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8">
        <div className="md:w-1/2">
          <div className="text-[#00FF00] mb-4 text-lg font-unbounded">
            BIENVENUE SUR SYDOLOGIE.AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight font-unbounded">
            Découvrez nos outils utilisant{" "}
            <span className="text-[#00FF00]">l'intelligence artificielle</span>{" "}
            au service de vos formations
          </h1>
        </div>
        
        <div className="md:w-1/2 flex flex-col justify-end" style={{ paddingTop: "180px" }}>
          <p className="text-gray-600 mb-8 font-unbounded">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
            <Button 
              className="bg-[#00FF00] text-black hover:bg-[#00FF00]/90 px-8 py-6 text-lg font-unbounded"
            >
              M'inscrire gratuitement
            </Button>
            <Button 
              variant="outline" 
              className="border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10 px-8 py-6 text-lg font-unbounded"
            >
              Me connecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;