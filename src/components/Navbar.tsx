
import { Button } from "./ui/button";
import { User, LogOut, LightbulbIcon, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
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
  };
  
  return <nav className="bg-[#82C8A0] text-[#EDE8E0]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-sans flex items-center font-bold">
              Sydologie<span className="text-[#1F5E40] font-bold">.ai</span>
            </Link>
          </div>

          {/* Navigation Links */}
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
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 font-dmsans">
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
    </nav>;
};

export default Navbar;
