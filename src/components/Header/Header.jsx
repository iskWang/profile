import React, { useState, useEffect } from 'react';
import { CatFace } from '../common';
import { useLanguage } from '../../context/useLanguage';
import { useTheme } from '../../context/useTheme';

const ThemeIcon = ({ theme }) => (
  theme === 'dark' ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3.5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
);

const Header = ({ scrollToSection }) => {
  const { lang, toggleLang, content } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about',      label: content.nav.about },
    { id: 'projects',   label: content.nav.projects },
    { id: 'skills',     label: content.nav.skills },
    { id: 'experience', label: content.nav.experience },
    { id: 'contact',    label: content.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-paper/90 border-b border-line">
      <nav className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          className="flex items-center gap-2 group text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded spring-hover"
          onClick={() => scrollToSection('about')}
        >
          <CatFace size="text-xl" />
          <span className="text-xl group-hover:text-teal transition-colors">Josh Wang</span>
        </button>

        <div className="flex items-center gap-2 md:gap-6 text-sm overflow-x-auto no-scrollbar max-w-full px-2">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && <span className="text-line sm:hidden">/</span>}
              <button
                onClick={() => scrollToSection(section.id)}
                className={`spring-hover whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded px-1 ${
                  activeSection === section.id
                    ? 'text-teal font-semibold'
                    : 'text-ink-soft hover:text-teal'
                }`}
              >
                {section.label}
              </button>
            </React.Fragment>
          ))}
          <button
            onClick={toggleLang}
            aria-label={lang === 'zh' ? 'EN — 切換為英文' : '中文 — Switch to Chinese'}
            className="ml-2 font-mono text-xs px-3 py-2 min-h-[44px] flex items-center rounded-lg border border-line text-ink-soft hover:text-teal hover:border-teal transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line text-ink-soft transition-all hover:border-teal hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
