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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false); // Set loading to false after fetch completes or fails
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
      return key; // Return key as fallback while loading or if failed
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

  // While translations are loading, show a full-screen loading indicator.
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-base-100 flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      </div>
    );
  }

  // Once loaded, provide the context and render the children.
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