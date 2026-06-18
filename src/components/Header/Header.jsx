import React, { useState, useEffect } from 'react';
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
    <header className="fixed top-0 w-full z-50 border-b border-black/10 bg-[#f4f1e8]/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row md:px-6">
        <button
          className="group flex items-center gap-3 rounded-full border border-black/15 bg-white/70 px-3 py-2 text-left shadow-[0_1px_0_rgba(17,17,17,0.08)] transition hover:-translate-y-0.5 hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          onClick={() => scrollToSection('about')}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs font-black text-white">JW</span>
          <span className="text-sm font-black tracking-tight">Josh Wang</span>
        </button>

        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-black/10 bg-white/70 p-1 text-sm shadow-[0_1px_0_rgba(17,17,17,0.08)] no-scrollbar">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && <span className="hidden text-black/20 sm:inline">/</span>}
              <button
                onClick={() => scrollToSection(section.id)}
                className={`min-h-[38px] whitespace-nowrap rounded-full px-3 text-xs font-bold uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  activeSection === section.id
                    ? 'bg-black text-white'
                    : 'text-black/55 hover:bg-black/5 hover:text-black'
                }`}
              >
                {section.label}
              </button>
            </React.Fragment>
          ))}

          <button
            onClick={toggleLang}
            aria-label="Switch language"
            className="ml-1 flex min-h-[38px] items-center whitespace-nowrap rounded-full border border-black/15 px-3 text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-[#dff8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
