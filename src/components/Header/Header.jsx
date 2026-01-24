import React, { useState, useEffect } from 'react';
import { CatFace } from '../common';

const Header = ({ scrollToSection }) => {
  const [activeSection, setActiveSection] = useState('about');
  
  const sections = [
    { id: 'about', label: 'about' },
    { id: 'experience', label: 'experience' },
    { id: 'skills', label: 'skills' },
    { id: 'contact', label: 'contact' }
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
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/70 border-b border-slate-700/50">
      <nav className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div 
          className="font-mono text-emerald-400 flex items-center gap-2 cursor-pointer group"
          onClick={() => scrollToSection('about')}
        >
          <CatFace size="text-xl" />
          <span className="text-xl">~/</span>
          <span className="text-white group-hover:text-emerald-400 transition-colors">josh_wang</span>
          <span className="animate-pulse">_</span>
        </div>
        
        {/* Breadcrumb-style navigation for mobile, standard for desktop */}
        <div className="flex items-center gap-2 md:gap-6 font-mono text-sm overflow-x-auto no-scrollbar max-w-full px-2">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && <span className="text-slate-600 sm:hidden">/</span>}
              <button
                onClick={() => scrollToSection(section.id)}
                className={`transition-colors whitespace-nowrap ${
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
