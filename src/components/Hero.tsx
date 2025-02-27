
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8">
        <div className="md:w-1/2">
          <div className="text-[#0EA5E9] mb-4 text-lg font-unbounded">
            BIENVENUE SUR SYDOLOGIE.AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight font-unbounded">
            Découvrez nos outils utilisant{" "}
            <span className="text-[#0EA5E9]">l'intelligence artificielle</span>{" "}
            au service de vos formations
          </h1>
        </div>
        
        <div className="md:w-1/2 flex flex-col justify-end" style={{ paddingTop: "180px" }}>
          <p className="text-gray-600 mb-8 font-dmsans">
            Nous sommes fiers de relancer Sydologie.ai suite à la demande des utilisateurs. Et le meilleur ? Tout est <strong>RGPD</strong> !
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
            <Button 
              className="bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 px-8 py-6 text-lg font-dmsans"
            >
              M'inscrire gratuitement
            </Button>
            <Button 
              variant="outline" 
              className="border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10 px-8 py-6 text-lg font-dmsans"
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
