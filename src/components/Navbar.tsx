
import { Button } from "./ui/button";
import { User, LogOut, Library } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-sans flex items-center">
              Sydologie<span className="text-[#00FF00]">.ai</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/outils" className="hover:text-[#00FF00] transition-colors">
              _Outils
            </Link>
            <Link to="/actualites" className="hover:text-[#00FF00] transition-colors">
              _Actualités
            </Link>
            <Link to="/formations" className="hover:text-[#00FF00] transition-colors">
              _Formations
            </Link>
            <Link to="/annuaire" className="hover:text-[#00FF00] transition-colors flex items-center">
              <Library className="mr-2 h-4 w-4" />
              Annuaire
            </Link>
            <Link to="/contact" className="hover:text-[#00FF00] transition-colors">
              Nous contacter
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <Button
                variant="ghost"
                className="text-[#00FF00] hover:text-white hover:bg-[#00FF00]/20"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="text-[#00FF00] hover:text-white hover:bg-[#00FF00]/20"
                >
                  <User className="mr-2 h-4 w-4" />
                  Me connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
