
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { useLanguage } from "@/hooks/use-language";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [hashPresent, setHashPresent] = useState(false);

  useEffect(() => {
    // Check if we have a hash in the URL (indicates reset password flow)
    const hash = window.location.hash;
    if (hash && hash.substring(1).split('&').some(param => param.startsWith('type=recovery'))) {
      setHashPresent(true);
    } else {
      // No hash means the user accessed this page directly (not through email link)
      toast({
        variant: "destructive",
        title: t("resetPassword.unauthorized.title"),
        description: t("resetPassword.unauthorized.description"),
      });
      navigate("/auth");
    }
  }, [navigate, toast, t]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: t("resetPassword.error.title"),
        description: t("resetPassword.error.passwordMismatch"),
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
        title: t("resetPassword.success.title"),
        description: t("resetPassword.success.description"),
      });

      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("resetPassword.error.title"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hashPresent) {
    return <div className="min-h-screen flex items-center justify-center">{t("resetPassword.redirecting")}</div>;
  }

  return (
    <div className="min-h-screen bg-background font-dmsans">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t("resetPassword.title")}</CardTitle>
              <CardDescription>
                {t("resetPassword.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("resetPassword.newPassword")}</Label>
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
                  <Label htmlFor="confirmPassword">{t("resetPassword.confirmPassword")}</Label>
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
                  {isLoading ? t("resetPassword.resetting") : t("resetPassword.reset")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
