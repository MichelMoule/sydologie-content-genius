import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        toast({
          title: "Email de récupération envoyé !",
          description: "Veuillez vérifier votre email pour réinitialiser votre mot de passe.",
        });
        setIsForgotPassword(false);
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
            emailRedirectTo: `${window.location.origin}`,
          },
        });

        if (error) throw error;

        if (data.user) {
          const { error: prefsError } = await supabase
            .from('email_preferences')
            .insert([
              { user_id: data.user.id, marketing_emails: marketingConsent }
            ]);
          
          if (prefsError) {
            console.error("Failed to save email preferences:", prefsError);
          }
        }

        if (data.user && data.session) {
          toast({
            title: "Inscription réussie !",
            description: "Vous êtes maintenant connecté.",
          });
          navigate("/");
        } else {
          toast({
            title: "Inscription réussie !",
            description: "Veuillez vérifier votre email pour confirmer votre compte.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Connexion réussie !",
          description: "Vous êtes maintenant connecté.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <form onSubmit={handleSubmit} className="space-y-4 font-dmsans">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1F5E40]">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-black font-dmsans"
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien de récupération"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="text-sm text-[#72BB8E] hover:underline font-dmsans"
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 font-dmsans">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-[#1F5E40]">Nom complet</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#1F5E40]">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#1F5E40]">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
          />
        </div>

        {isSignUp && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="marketingConsent" 
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked === true)}
              className="border-[#82C8A0] data-[state=checked]:bg-[#1F5E40]"
            />
            <Label 
              htmlFor="marketingConsent" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              J'accepte de recevoir des emails concernant les nouveautés de Sydologie.ai
            </Label>
          </div>
        )}

        {!isSignUp && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-xs text-[#72BB8E] hover:underline font-dmsans"
            >
              Mot de passe oublié ?
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[#72BB8E] hover:bg-[#72BB8E]/90 text-black font-dmsans"
          disabled={isLoading}
        >
          {isLoading
            ? "Chargement..."
            : isSignUp
            ? "S'inscrire"
            : "Se connecter"}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1F5E40]">
              {isForgotPassword
                ? "Récupération de mot de passe"
                : isSignUp
                ? "Créer un compte"
                : "Se connecter"}
            </h1>
            <p className="text-muted-foreground mt-2 font-dmsans">
              {isForgotPassword
                ? "Entrez votre email pour recevoir un lien de réinitialisation"
                : isSignUp
                ? "Rejoignez la communauté Sydologie.ai"
                : "Connectez-vous à votre compte"}
            </p>
          </div>

          {renderForm()}

          {!isForgotPassword && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-[#72BB8E] hover:underline font-dmsans"
              >
                {isSignUp
                  ? "Déjà un compte ? Se connecter"
                  : "Pas encore de compte ? S'inscrire"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
