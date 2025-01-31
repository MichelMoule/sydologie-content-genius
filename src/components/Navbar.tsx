import { Button } from "./ui/button";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-sydologie-green text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-serif">
              Sydologie
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-sydologie-coral transition-colors">
              Le mag'
            </a>
            <a href="#" className="hover:text-sydologie-coral transition-colors">
              Test d'outils
            </a>
            <a href="#" className="hover:text-sydologie-coral transition-colors">
              Dossiers
            </a>
            <a href="#" className="hover:text-sydologie-coral transition-colors">
              Livres blancs
            </a>
            <a href="#" className="hover:text-sydologie-coral transition-colors">
              Formations
            </a>
            <a href="#" className="hover:text-sydologie-coral transition-colors">
              Contact
            </a>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-sydologie-coral">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-sydologie-green"
            >
              Newsletter
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;