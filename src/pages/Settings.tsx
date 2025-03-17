
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/auth");
        return;
      }
      setUser(data.user);
      setProfileData({
        fullName: data.user.user_metadata?.full_name || "",
        email: data.user.email || "",
      });
    };

    checkUser();
  }, [navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileData.fullName },
      });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations de profil ont été mises à jour avec succès.",
      });
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

  const handlePasswordUpdate = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const { error: deleteError } = await supabase.rpc('delete_user');
      
      if (deleteError) throw deleteError;
      
      await supabase.auth.signOut();
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur lors de la suppression",
        description: "Une erreur est survenue lors de la suppression de votre compte. Veuillez contacter le support.",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center font-dmsans">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#1F5E40]">Paramètres du compte</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="text-[#1F5E40]">Profil</TabsTrigger>
              <TabsTrigger value="security" className="text-[#1F5E40]">Sécurité</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">Informations du profil</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations personnelles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[#1F5E40]">Nom complet</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fullName: e.target.value })
                        }
                        placeholder="Votre nom complet"
                        className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#1F5E40]">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">
                        L'email ne peut pas être modifié.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#82C8A0] hover:bg-[#1F5E40] text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">Changer de mot de passe</CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe pour sécuriser votre compte.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-[#1F5E40]">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                        className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-[#1F5E40]">Confirmer le mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                        className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#82C8A0] hover:bg-[#1F5E40] text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">Supprimer le compte</CardTitle>
                  <CardDescription>
                    Cette action est irréversible et supprimera définitivement votre compte et toutes vos données.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        className="bg-sydologie-red hover:bg-sydologie-red/90"
                      >
                        Supprimer mon compte
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="font-dmsans">
                      <DialogHeader>
                        <DialogTitle className="text-[#1F5E40] font-dmsans">Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
                        <DialogDescription className="font-dmsans">
                          Cette action est irréversible. Toutes vos données seront définitivement supprimées de nos serveurs.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setDeleteDialogOpen(false)}
                          disabled={isLoading}
                          className="border-[#82C8A0] text-[#1F5E40] font-dmsans"
                        >
                          Annuler
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          className="bg-sydologie-red hover:bg-sydologie-red/90 font-dmsans"
                        >
                          {isLoading ? "Suppression..." : "Confirmer la suppression"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">Déconnexion</CardTitle>
                  <CardDescription>
                    Déconnectez-vous de votre compte.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline"
                    onClick={handleLogout}
                    className="border-[#82C8A0] text-[#1F5E40] hover:bg-[#82C8A0]/10"
                  >
                    Se déconnecter
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
