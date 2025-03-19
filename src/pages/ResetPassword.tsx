
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si une erreur est présente dans l'URL
    const checkForErrors = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(location.search);
      
      // Vérifier le hash fragment pour les erreurs
      if (hash && hash.includes('error=')) {
        const errorParam = hash.split('error=')[1]?.split('&')[0];
        const errorDesc = hash.includes('error_description=') 
          ? decodeURIComponent(hash.split('error_description=')[1]?.split('&')[0]) 
          : null;
          
        if (errorParam === 'access_denied' || errorParam === 'otp_expired') {
          setError(errorDesc || "Le lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien.");
          return true;
        }
      }
      
      // Vérifier les paramètres d'URL pour les erreurs
      if (searchParams.get('error')) {
        const errorParam = searchParams.get('error');
        const errorDesc = searchParams.get('error_description');
        
        if (errorParam === 'access_denied' || errorParam === 'otp_expired') {
          setError(errorDesc || "Le lien de réinitialisation a expiré ou est invalide. Veuillez demander un nouveau lien.");
          return true;
        }
      }
      
      return false;
    };

    // Extraire le token de l'URL ou du hash fragment
    const getTokenFromUrl = () => {
      // D'abord essayer dans les paramètres de requête
      const searchParams = new URLSearchParams(location.search);
      const urlToken = searchParams.get("token");
      
      // Si pas dans les paramètres, essayer dans le hash fragment
      if (urlToken) {
        return urlToken;
      }
      
      const hash = window.location.hash;
      if (hash && hash.includes('access_token=')) {
        return hash.split('access_token=')[1]?.split('&')[0];
      }
      
      if (hash && hash.includes('token=')) {
        return hash.split('token=')[1]?.split('&')[0];
      }
      
      return null;
    };
    
    // Vérifier d'abord les erreurs
    const hasError = checkForErrors();
    if (hasError) {
      // Nettoyer l'URL en cas d'erreur
      window.history.replaceState({}, document.title, "/reset-password");
      return; // Ne pas continuer si une erreur est détectée
    }
    
    // Sinon, essayer d'extraire le token
    const extractedToken = getTokenFromUrl();
    
    if (extractedToken) {
      setToken(extractedToken);
      // Nettoyer l'URL après avoir extrait le token
      window.history.replaceState({}, document.title, "/reset-password");
      
      // Vérifier que nous sommes bien connectés avec ce token
      const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          // Si nous n'avons pas de session, essayer de se connecter avec le token
          try {
            await supabase.auth.setSession({
              access_token: extractedToken,
              refresh_token: extractedToken,
            });
            console.log("Session établie avec le token");
          } catch (sessionError) {
            console.error("Erreur lors de l'établissement de la session:", sessionError);
            setError("Impossible d'établir une session. Veuillez demander un nouveau lien de réinitialisation.");
          }
        }
      };
      
      checkSession();
    } else {
      setError("Ce lien de réinitialisation n'est pas valide ou a expiré. Veuillez demander un nouveau lien.");
    }
  }, [location, navigate, toast]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Vérifier si nous avons une session active
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Votre session a expiré. Veuillez demander un nouveau lien de réinitialisation.",
        });
        setIsLoading(false);
        return;
      }

      // Utiliser la méthode updateUser de Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
      });

      // Rediriger vers la page de connexion après une réinitialisation réussie
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.",
      });
      
      // Si l'erreur est liée à la session, proposer un nouveau lien
      if (error.message && (
        error.message.includes("session") || 
        error.message.includes("JWT") || 
        error.message.includes("token") || 
        error.message.includes("expired")
      )) {
        setError("Votre session a expiré. Veuillez demander un nouveau lien de réinitialisation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    // Rediriger vers la page d'authentification avec un état indiquant d'afficher le formulaire de récupération
    navigate("/auth", { 
      state: { 
        showForgotPassword: true,
        // On peut aussi passer l'email si on l'a, pour pré-remplir le formulaire
        email: "" 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Réinitialisation du mot de passe</CardTitle>
              <CardDescription>
                {error ? "Une erreur est survenue" : "Veuillez saisir votre nouveau mot de passe."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  <Button 
                    onClick={handleRequestNewLink}
                    className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-black"
                  >
                    Demander un nouveau lien
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-black"
                    disabled={isLoading}
                  >
                    {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
