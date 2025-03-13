
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-32 bg-[#EDE8E0]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-8 relative">
        <div className="md:w-1/2">
          <div className="text-[#82C8A0] mb-4 text-lg font-unbounded">
            BIENVENUE SUR SYDOLOGIE.AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight font-unbounded">
            Découvrez nos outils utilisant{" "}
            <span className="text-[#82C8A0]">l'intelligence artificielle</span>{" "}
            au service de vos formations
          </h1>
        </div>
        
        <div className="md:w-1/2 flex flex-col justify-end" style={{ paddingTop: "180px" }}>
          <p className="text-gray-600 mb-8 font-dmsans">
            Nous sommes fiers de relancer Sydologie.ai suite à la demande des utilisateurs. Et le meilleur ? Tout est <strong>RGPD</strong> !
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
            <Button 
              className="bg-[#82C8A0] text-white hover:bg-[#82C8A0]/90 px-8 py-6 text-lg font-dmsans"
            >
              M'inscrire gratuitement
            </Button>
            <Button 
              variant="outline" 
              className="border-[#82C8A0] text-[#82C8A0] hover:bg-[#82C8A0]/10 px-8 py-6 text-lg font-dmsans"
            >
              Me connecter
            </Button>
          </div>
        </div>

        {/* Robot image positioned to the right */}
        <div className="hidden lg:block absolute right-0 top-0 h-full" style={{ transform: 'translateX(40%)' }}>
          <img 
            src="/lovable-uploads/103c8caa-73e8-467a-a9f0-8489673a57ff.png" 
            alt="Robot assistant" 
            className="h-full max-h-[600px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
