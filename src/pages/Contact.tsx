import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left side - Form */}
        <div className="flex-1">
          <h1 className="text-7xl font-bold mb-8">CONTACT</h1>
          <p className="text-sm mb-8">Les champs marqués d'une étoile * sont obligatoires</p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block">
                  <span className="text-[#00FF00]">_</span>Nom*
                </label>
                <Input 
                  type="text" 
                  required 
                  className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                />
              </div>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-[#00FF00]">_</span>Prénom*
                </label>
                <Input 
                  type="text" 
                  required 
                  className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block">
                  <span className="text-[#00FF00]">_</span>Téléphone*
                </label>
                <Input 
                  type="tel" 
                  required 
                  className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                />
              </div>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-[#00FF00]">_</span>Adresse mail*
                </label>
                <Input 
                  type="email" 
                  required 
                  className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block">
                <span className="text-[#00FF00]">_</span>Le sujet de votre demande*
              </label>
              <Input 
                type="text" 
                required 
                className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
              />
            </div>

            <div className="space-y-2">
              <Textarea 
                placeholder="Tapez votre demande ici" 
                className="min-h-[200px] border rounded-md" 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full md:w-auto px-8 py-2 bg-gray-200 text-black hover:bg-gray-300"
            >
              Envoyer
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              Ce site est protégé par reCAPTCHA et les règles de confidentialité et Google et les Conditions d'utilisation
            </p>
          </form>
        </div>

        {/* Right side - Contact Info */}
        <div className="md:w-[400px] bg-[#00FF00] p-8">
          <div className="space-y-4">
            <p className="font-bold">SYDO</p>
            <p>31 rue Buréteau</p>
            <p>69 001 LYON</p>
            <p className="mt-8">_06 16 57 25 13</p>
            <p>contact@sydo.fr</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;