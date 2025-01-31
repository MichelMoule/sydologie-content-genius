import { Button } from "./ui/button";
import { User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-sans flex items-center">
              Sydologie<span className="text-[#00FF00]">.ai</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-[#00FF00] transition-colors">
              _Outils
            </a>
            <a href="#" className="hover:text-[#00FF00] transition-colors">
              _Actualités
            </a>
            <a href="#" className="hover:text-[#00FF00] transition-colors">
              _Formations
            </a>
            <a href="#" className="hover:text-[#00FF00] transition-colors">
              Nous contacter
            </a>
          </div>

          {/* Login Button */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              className="text-[#00FF00] hover:text-white hover:bg-[#00FF00]/20"
            >
              <User className="mr-2 h-4 w-4" />
              Me connecter
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;