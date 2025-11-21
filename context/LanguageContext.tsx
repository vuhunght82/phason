import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

type Language = 'en' | 'vi';

interface Translations {
  [key: string]: string;
}

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

  const [translations, setTranslations] = useState<Record<Language, Translations>>({ en: {}, vi: {} });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const loadTranslations = async () => {
        try {
            const [enRes, viRes] = await Promise.all([
                fetch('./locales/en.json'),
                fetch('./locales/vi.json')
            ]);
            if (!enRes.ok || !viRes.ok) {
                throw new Error('Failed to fetch translation files');
            }
            const enData = await enRes.json();
            const viData = await viRes.json();
            setTranslations({ en: enData, vi: viData });
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    };
    loadTranslations();
  }, []); // Run only once on mount

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements: Record<string, string | number> = {}) => {
    const langTranslations = translations[language];
    // If translations for the current language haven't loaded yet, default to the key.
    // FIX: The !langTranslations check is redundant because `translations[language]` will always be an object.
    if (Object.keys(langTranslations).length === 0) {
        return key;
    }
    
    let translation = langTranslations[key] || key;
    
    Object.keys(replacements).forEach(placeholder => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      translation = translation.replace(regex, String(replacements[placeholder]));
    });

    return translation;
  }, [language, translations]);

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