import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl">
        <div className="text-[#00FF00] mb-4 text-lg">
          BIENVENUE SUR SYDOLOGIE.AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
          Découvrez nos outils utilisant{" "}
          <span className="text-[#00FF00]">l'intelligence artificielle</span>{" "}
          au service de vos formations
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
          <Button 
            className="bg-[#00FF00] text-black hover:bg-[#00FF00]/90 px-8 py-6 text-lg"
          >
            M'inscrire gratuitement
          </Button>
          <Button 
            variant="outline" 
            className="border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10 px-8 py-6 text-lg"
          >
            Me connecter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;