import { Button } from "./ui/button";
import { User, LogOut, Settings, Menu, X, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-[#82C8A0] text-[#EDE8E0] relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-sans flex items-center font-bold">
              Sydologie<span className="text-[#1F5E40] font-bold">.ai</span>
            </Link>
          </div>

          <div className="md:hidden">
            <Button 
              variant="ghost" 
              className="text-white hover:text-[#82C8A0] hover:bg-white/20" 
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="hidden md:flex space-x-8 font-dmsans text-lg font-medium">
            <Link to="/outils" className="hover:text-white transition-colors">
              Outils
            </Link>
            <Link to="/formations" className="hover:text-white transition-colors">
              Formations
            </Link>
            <Link to="/outils/suggestions" className="hover:text-white transition-colors flex items-center">
              Propositions
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              Nous contacter
            </Link>
            <a 
              href="https://discord.gg/sC44FXg2pE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center"
            >
              <MessageCircle className="h-6 w-6" />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-2 font-dmsans">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/settings">
                  <Button variant="ghost" className="text-white hover:text-[#82C8A0] hover:bg-white/20 font-medium">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" className="text-white hover:text-[#82C8A0] hover:bg-white/20 font-medium" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:text-[#82C8A0] hover:bg-white/20 font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Me connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-[#82C8A0] shadow-lg z-50">
          <div className="px-4 py-4 space-y-4 font-dmsans">
            <Link 
              to="/outils" 
              className="block py-2 px-3 text-xl hover:bg-white/10 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Outils
            </Link>
            <Link 
              to="/formations" 
              className="block py-2 px-3 text-xl hover:bg-white/10 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Formations
            </Link>
            <Link 
              to="/outils/suggestions" 
              className="block py-2 px-3 text-xl hover:bg-white/10 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Propositions
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 px-3 text-xl hover:bg-white/10 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nous contacter
            </Link>

            <a 
              href="https://discord.gg/sC44FXg2pE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center py-2 px-3 text-xl hover:bg-white/10 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Discord
            </a>

            <div className="pt-4 border-t border-white/20">
              {user ? (
                <div className="space-y-2">
                  <Link 
                    to="/settings" 
                    className="flex items-center py-2 px-3 text-xl hover:bg-white/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Paramètres
                  </Link>
                  <button 
                    className="flex items-center w-full py-2 px-3 text-xl hover:bg-white/10 rounded-lg text-left"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="flex items-center py-2 px-3 text-xl hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-5 w-5" />
                  Me connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
