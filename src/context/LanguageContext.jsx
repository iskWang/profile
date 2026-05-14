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
  const getInitialLanguage = () => {
    if (typeof window === 'undefined') {
      return 'zh'; // Default for SSR
    }
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

  const [lang, setLang] = useState(getInitialLanguage());

  // Update URL, localStorage, and html[lang] whenever language changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('preferred_lang', lang);

    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());

    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'zh' ? 'en' : 'zh'));
  };

  const content = CONTENT[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
