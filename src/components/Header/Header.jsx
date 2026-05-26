import React, { useState, useEffect } from 'react';
import { CatFace } from '../common';
import { useLanguage } from '../../context/useLanguage';

const Header = ({ scrollToSection }) => {
  const { lang, toggleLang, content } = useLanguage();
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
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/70 border-b border-slate-700/50">
      <nav className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          className="text-emerald-400 flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
          onClick={() => scrollToSection('about')}
        >
          <CatFace size="text-xl" />
          <span className="text-xl">~/</span>
          <span className="text-white group-hover:text-emerald-400 transition-colors">josh_wang</span>
          <span className="animate-pulse" aria-hidden="true">_</span>
        </button>

        <div className="flex items-center gap-2 md:gap-6 text-sm overflow-x-auto no-scrollbar max-w-full px-2">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && <span className="text-slate-600 sm:hidden">/</span>}
              <button
                onClick={() => scrollToSection(section.id)}
                className={`transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded px-1 ${
                  activeSection === section.id
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <span className="hidden sm:inline">.</span>
                {section.label}
                <span className="hidden sm:inline">()</span>
              </button>
            </React.Fragment>
          ))}

          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="ml-2 text-xs px-3 py-2 min-h-[44px] flex items-center rounded-lg border border-slate-600/60 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
