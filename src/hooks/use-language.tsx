
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "@/i18n/translations/en.json";
import frTranslations from "@/i18n/translations/fr.json";

type Language = "fr" | "en";
type Translations = typeof frTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage || "fr";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    // Force re-render of components when language changes
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const getTranslation = (): Translations => {
    return language === "fr" ? frTranslations : enTranslations;
  };

  const translate = (key: string): string => {
    const translations = getTranslation();
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
