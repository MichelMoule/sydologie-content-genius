
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignUp = () => {
    navigate("/auth", { state: { isSignUp: true } });
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div className="w-full px-4 py-12 md:py-20 md:pb-32 bg-[#EDE8E0]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-8 relative">
        <div className="w-full md:w-3/5 pt-4 md:pt-20">
          <div className="text-[#82C8A0] mb-4 text-sm uppercase tracking-wide font-dmsans">
            BIENVENUE SUR SYDOLOGIE.AI
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight font-dmsans">
            Découvrez nos outils utilisant{" "}
            <span className="text-[#82C8A0]">l'intelligence artificielle</span>{" "}
            au service de vos formations
          </h1>
          
          <div className="mt-8 md:mt-20 md:hidden">
            <p className="text-gray-600 mb-6 text-base font-dmsans">
              Nous sommes fiers de relancer Sydologie.ai suite à la demande des utilisateurs. Et le meilleur ? Tout est <strong>RGPD</strong> !
            </p>
            <div className="space-y-4 flex flex-col">
              <Button 
                className="bg-[#82C8A0] text-white hover:bg-[#82C8A0]/90 py-3 px-5 rounded-full text-base flex items-center gap-2 w-full md:w-auto"
                onClick={handleSignUp}
              >
                M'inscrire gratuitement
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 12H4.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button 
                variant="outline" 
                className="border-[#82C8A0] text-[#82C8A0] hover:bg-[#82C8A0]/10 py-3 px-5 rounded-full text-base w-full md:w-auto"
                onClick={handleSignIn}
              >
                Me connecter
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:w-2/5 hidden md:block">
          <div className="pt-28 py-[159px]">
            <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
              <Button 
                className="bg-[#82C8A0] text-white hover:bg-[#82C8A0]/90 py-3 px-5 rounded-full text-base flex items-center gap-2"
                onClick={handleSignUp}
              >
                M'inscrire gratuitement
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 12H4.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button 
                variant="outline" 
                className="border-[#82C8A0] text-[#82C8A0] hover:bg-[#82C8A0]/10 py-3 px-5 rounded-full text-base"
                onClick={handleSignIn}
              >
                Me connecter
              </Button>
            </div>
          </div>
        </div>

        {/* Robot image positioned to the right */}
        <div className="hidden lg:block absolute right-0 top-0 h-full" style={{
          transform: 'translateX(70%)'
        }}>
          <img src="/lovable-uploads/103c8caa-73e8-467a-a9f0-8489673a57ff.png" alt="Robot assistant" className="h-full max-h-[600px] object-contain" />
        </div>

        {/* Mobile robot image */}
        {isMobile && (
          <div className="w-full flex justify-center my-8">
            <img 
              src="/lovable-uploads/103c8caa-73e8-467a-a9f0-8489673a57ff.png" 
              alt="Robot assistant" 
              className="h-48 object-contain" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
