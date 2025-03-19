
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
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
import { useLanguage } from "@/hooks/use-language";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
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
  const [marketingEmails, setMarketingEmails] = useState(false);

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

      // Get email preferences
      const { data: prefsData, error } = await supabase
        .from('email_preferences')
        .select('marketing_emails')
        .eq('user_id', data.user.id)
        .single();

      if (prefsData) {
        setMarketingEmails(prefsData.marketing_emails);
      } else if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error fetching email preferences:", error);
      }
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
        title: t("settings.profile.success"),
        description: t("settings.profile.success"),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPreferencesUpdate = async (value: boolean) => {
    setIsLoading(true);
    try {
      if (!user) return;

      // Check if preference record exists
      const { data: existingPref } = await supabase
        .from('email_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;
      
      if (existingPref) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('email_preferences')
          .update({ marketing_emails: value })
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('email_preferences')
          .insert([{ user_id: user.id, marketing_emails: value }]);
        error = insertError;
      }

      if (error) throw error;

      setMarketingEmails(value);
      toast({
        title: t("settings.preferences.success"),
        description: t("settings.preferences.success"),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error"),
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
        title: t("error"),
        description: t("settings.security.password.mismatchError"),
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
        title: t("settings.security.password.success"),
        description: t("settings.security.password.success"),
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error"),
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
        title: t("settings.security.logout.success"),
        description: t("settings.security.logout.success"),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error"),
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
        title: t("settings.security.deleteAccount.success"),
        description: t("settings.security.deleteAccount.success"),
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("settings.security.deleteAccount.error"),
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center font-dmsans">{t("loading")}</div>;
  }

  return (
    <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#1F5E40]">{t("settings.title")}</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="text-[#1F5E40]">{t("settings.tabs.profile")}</TabsTrigger>
              <TabsTrigger value="preferences" className="text-[#1F5E40]">{t("settings.tabs.preferences")}</TabsTrigger>
              <TabsTrigger value="security" className="text-[#1F5E40]">{t("settings.tabs.security")}</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">{t("settings.profile.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.profile.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[#1F5E40]">{t("settings.profile.fullName")}</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fullName: e.target.value })
                        }
                        placeholder={t("settings.profile.fullNamePlaceholder")}
                        className="border-[#82C8A0] focus-visible:ring-[#1F5E40]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#1F5E40]">{t("settings.profile.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("settings.profile.emailCannotChange")}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#82C8A0] hover:bg-[#1F5E40] text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? t("settings.profile.updating") : t("settings.profile.updateProfile")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">{t("settings.preferences.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.preferences.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[#1F5E40]">{t("settings.preferences.marketingEmails")}</Label>
                        <p className="text-xs text-muted-foreground">
                          {t("settings.preferences.marketingDescription")}
                        </p>
                      </div>
                      <Switch
                        checked={marketingEmails}
                        onCheckedChange={handleEmailPreferencesUpdate}
                        disabled={isLoading}
                        className="data-[state=checked]:bg-[#1F5E40]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">{t("settings.security.password.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.security.password.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-[#1F5E40]">{t("settings.security.password.newPassword")}</Label>
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
                      <Label htmlFor="confirmPassword" className="text-[#1F5E40]">{t("settings.security.password.confirmPassword")}</Label>
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
                      {isLoading ? t("settings.security.password.updating") : t("settings.security.password.updatePassword")}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">{t("settings.security.deleteAccount.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.security.deleteAccount.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        className="bg-sydologie-red hover:bg-sydologie-red/90"
                      >
                        {t("settings.security.deleteAccount.button")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="font-dmsans">
                      <DialogHeader>
                        <DialogTitle className="text-[#1F5E40] font-dmsans">{t("settings.security.deleteAccount.confirm")}</DialogTitle>
                        <DialogDescription className="font-dmsans">
                          {t("settings.security.deleteAccount.confirmDescription")}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setDeleteDialogOpen(false)}
                          disabled={isLoading}
                          className="border-[#82C8A0] text-[#1F5E40] font-dmsans"
                        >
                          {t("settings.security.deleteAccount.cancel")}
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={isLoading}
                          className="bg-sydologie-red hover:bg-sydologie-red/90 font-dmsans"
                        >
                          {isLoading ? t("settings.security.deleteAccount.deleting") : t("settings.security.deleteAccount.confirmDelete")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#1F5E40]">{t("settings.security.logout.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.security.logout.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline"
                    onClick={handleLogout}
                    className="border-[#82C8A0] text-[#1F5E40] hover:bg-[#82C8A0]/10"
                  >
                    {t("settings.security.logout.button")}
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
