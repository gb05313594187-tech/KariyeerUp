// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectLanguage(): Language {
  try {
    const nav = (navigator?.language || "").toLowerCase(); // örn: "tr-tr", "en-us", "fr-fr", "ar-tn"
    if (nav.startsWith("tr")) return "tr";
    if (nav.startsWith("ar")) return "ar";
    if (nav.startsWith("fr")) return "fr";
    return "en";
  } catch {
    return "tr";
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("kariyeer_language");
      const candidate = (saved as Language) || null;

      // 1) Kullanıcı daha önce seçtiyse onu kullan
      if (candidate && translations?.[candidate]) return candidate;

      // 2) İlk açılış: tarayıcı diline göre seç
      const detected = detectLanguage();
      if (!translations?.[detected]) return "tr";
      return detected;
    } catch (e) {
      // localStorage erişimi kapalıysa fallback + detect
      const detected = detectLanguage();
      if (!translations?.[detected]) return "tr";
      return detected;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kariyeer_language", language);
    } catch (e) {}
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
