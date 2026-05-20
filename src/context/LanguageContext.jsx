import React, { createContext, useContext, useState, useEffect } from 'react';
import { CONTENT } from '../constants/content';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('zh'); // Default matching SSR
  const [isHydrated, setIsHydrated] = useState(false);

  const getBrowserLanguage = () => {
    if (typeof window === 'undefined') return 'zh';

    // 1. Check URL query params
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam && (langParam === 'en' || langParam === 'zh')) {
      return langParam;
    }

    // 2. Check localStorage
    const savedLang = localStorage.getItem('preferred_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      return savedLang;
    }

    // 3. Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('zh')) {
      return 'zh';
    }

    return 'en';
  };

  // Initial client-side sync
  useEffect(() => {
    setLang(getBrowserLanguage());
    setIsHydrated(true);
  }, []);

  // Update URL, localStorage, and html[lang] whenever language changes
  useEffect(() => {
    if (!isHydrated) return;

    localStorage.setItem('preferred_lang', lang);

    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  }, [lang, isHydrated]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const content = CONTENT[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, content, isHydrated }}>
      {children}
    </LanguageContext.Provider>
  );
};
