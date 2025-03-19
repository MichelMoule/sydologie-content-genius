
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <Button 
      variant="ghost" 
      className="text-white hover:text-[#82C8A0] hover:bg-white/20 font-medium"
      onClick={toggleLanguage}
    >
      {language === "fr" ? "EN" : "FR"}
    </Button>
  );
};

export default LanguageSelector;
