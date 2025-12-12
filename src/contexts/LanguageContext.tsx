import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("kariyeer_language");
      const candidate = (saved as Language) || "tr";
      // translations yoksa da güvenli olsun
      if (!translations?.[candidate]) return "tr";
      return candidate;
    } catch (e) {
      // localStorage erişimi kapalıysa fallback
      return "tr";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kariyeer_language", language);
    } catch (e) {
      // localStorage erişimi kapalıysa sessiz geç
    }
  }, [language]);

  const t = (key: string): string => {
    try {
      const langTable = translations?.[language] || translations?.tr;
      return (langTable?.[key as keyof typeof translations.tr] as any) || key;
    } catch (e) {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  // ✅ PROD’DA CRASH ENGELLE (Provider yoksa fallback)
  if (context === undefined) {
    return {
      language: "tr" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    } as LanguageContextType;
  }

  return context;
};
