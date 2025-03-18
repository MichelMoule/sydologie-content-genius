
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const { toast } = useToast();

  const handleRedirectToSubstack = () => {
    // Direct redirect to Substack
    const substackUrl = "https://sydologie.substack.com/subscribe?utm_source=website&simple=true";
    window.open(substackUrl, '_blank');
    
    toast({
      title: "Redirection",
      description: "Vous allez être redirigé vers notre page d'inscription Substack",
    });
  };

  return (
    <section className="w-full bg-[#72BB8E] py-24 font-dmsans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-black max-w-xl">
              Ne manquez pas l'arrivée de nos nouveaux outils et les dernières actualités,
            </h2>
          </div>
          <div className="space-y-6">
            <h3 className="text-4xl font-bold text-white">
              inscrivez vous à notre newsletter !
            </h3>
            <div className="flex justify-start">
              <Button 
                onClick={handleRedirectToSubstack}
                variant="outline"
                className="bg-white text-black hover:bg-black hover:text-white transition-colors"
                size="lg"
              >
                S'inscrire à la newsletter Substack
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
