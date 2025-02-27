import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Newsletter = () => {
  return (
    <section className="w-full bg-[#1EFF02] py-24">
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Votre@email.com"
                className="bg-white text-black placeholder:text-gray-500"
              />
              <Button 
                variant="outline"
                className="bg-white text-black hover:bg-black hover:text-white transition-colors"
              >
                M'inscrire à la newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;