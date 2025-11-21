import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

type Language = 'en' | 'vi';

type Translations = { [key: string]: string };
type AllTranslations = {
  en: Translations;
  vi: Translations;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : 'en';
    return (storedLang === 'en' || storedLang === 'vi') ? storedLang : 'en';
  });
  
  const [translations, setTranslations] = useState<AllTranslations | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enResponse, viResponse] = await Promise.all([
          fetch('./locales/en.json'),
          fetch('./locales/vi.json')
        ]);
        if (!enResponse.ok || !viResponse.ok) {
          throw new Error('Failed to load translation files');
        }
        const enData = await enResponse.json();
        const viData = await viResponse.json();
        setTranslations({ en: enData, vi: viData });
      } catch (error) {
        console.error("Could not load translations:", error);
        // Set empty translations to prevent crashing and show keys as fallback
        setTranslations({ en: {}, vi: {} });
      }
    };

    fetchTranslations();
  }, []); // Run only once on mount

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements: Record<string, string | number> = {}) => {
    if (!translations) {
      return key; // Return key as fallback while loading
    }
    
    const langTranslations = translations[language];
    if (!langTranslations) {
        return key;
    }

    let translation = langTranslations[key] || key;
    
    Object.keys(replacements).forEach(placeholder => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      translation = translation.replace(regex, String(replacements[placeholder]));
    });

    return translation;
  }, [language, translations]);

  // Render children immediately and let them use the fallback 't' function
  // which returns keys until translations are loaded. This avoids a blank screen.
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
