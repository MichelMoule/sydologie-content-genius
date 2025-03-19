
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Newsletter from "@/components/Newsletter";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/hooks/use-language";

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Form state
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    sujet: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://hook.eu2.make.com/7ax3edkvu9soz7b24wy68gt9p5wo6tw6", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Échec de l'envoi du message");
      }
    } catch (error) {
      toast({
        title: t("contact.errorTitle"),
        description: t("contact.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col font-dmsans">
        <Navbar />
        <div className="flex-1 bg-[#72BB8E] flex flex-col items-center justify-center px-4">
          <h1 className="text-7xl font-bold text-center mb-8 max-w-3xl text-white">
            {t("contact.success.title")}
          </h1>
          <p className="text-center mb-8 max-w-xl text-white">
            {t("contact.success.message")}
          </p>
          <Link 
            to="/"
            className="bg-white px-6 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {t("contact.success.backButton")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 font-dmsans">
        <div className="flex flex-col md:flex-row gap-12 min-h-[600px]">
          {/* Left side - Form */}
          <div className="flex-1">
            <h1 className="text-7xl font-bold mb-8">{t("contact.title")}</h1>
            <p className="text-sm mb-8">{t("contact.requiredFields")}</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[#72BB8E]">_</span>{t("contact.form.lastName")}*
                  </label>
                  <Input 
                    type="text" 
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required 
                    className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[#72BB8E]">_</span>{t("contact.form.firstName")}*
                  </label>
                  <Input 
                    type="text" 
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required 
                    className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[#72BB8E]">_</span>{t("contact.form.phone")}*
                  </label>
                  <Input 
                    type="tel" 
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required 
                    className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[#72BB8E]">_</span>{t("contact.form.email")}*
                  </label>
                  <Input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block">
                  <span className="text-[#72BB8E]">_</span>{t("contact.form.subject")}*
                </label>
                <Input 
                  type="text" 
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required 
                  className="w-full border-t-0 border-x-0 border-b border-black rounded-none focus-visible:ring-0 px-0" 
                />
              </div>

              <div className="space-y-2">
                <Textarea 
                  placeholder={t("contact.form.messagePlaceholder")} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-[200px] border rounded-md font-dmsans" 
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full md:w-auto px-8 py-2 bg-[#72BB8E] text-black hover:bg-[#72BB8E]/90 font-dmsans"
              >
                {isLoading ? t("contact.form.sending") : t("contact.form.send")}
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                {t("contact.form.privacyNotice")}
              </p>
            </form>
          </div>

          {/* Right side - Contact Info */}
          <div className="md:w-[400px] bg-[#72BB8E] p-8 h-full font-dmsans">
            <div className="space-y-4">
              <p className="font-bold">SYDO</p>
              <p>31 rue Burdeau</p>
              <p>69001 LYON</p>
              <p className="mt-8">_06 16 57 25 13</p>
              <p>contact@sydo.fr</p>
            </div>
          </div>
        </div>
      </div>
      <Newsletter />
    </>
  );
};

export default Contact;
