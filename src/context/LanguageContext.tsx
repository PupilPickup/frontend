import { createContext, useState, useContext, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  changeLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const changeLanguage = (language: string) => {
    localStorage.setItem('language', language);
    setLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};