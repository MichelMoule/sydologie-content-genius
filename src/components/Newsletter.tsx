
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Redirect to Substack with the email prefilled
    const substackUrl = `https://sydologie.substack.com/subscribe?email=${encodeURIComponent(email)}&simple=true&utm_source=website`;
    window.open(substackUrl, '_blank');
    
    toast({
      title: "Merci !",
      description: "Vous allez être redirigé vers notre page d'inscription Substack",
    });
    
    // Reset form
    setEmail("");
    setIsSubmitting(false);
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
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Votre@email.com"
                className="bg-white text-black placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                variant="outline"
                className="bg-white text-black hover:bg-black hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "En cours..." : "M'inscrire à la newsletter"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
