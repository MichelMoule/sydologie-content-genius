
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-4 md:py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-gray-600 font-dmsans text-sm md:text-base">
              © {new Date().getFullYear()} Sydologie.ai - Tous droits réservés
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 text-gray-600 font-dmsans text-sm md:text-base items-center">
            <Link to="/contact" className="hover:text-[#82C8A0]">
              Nous contacter
            </Link>
            <Link 
              to="/legal" 
              className="flex items-center hover:text-[#82C8A0]"
            >
              <FileText className="h-4 w-4 mr-1" />
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
