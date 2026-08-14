import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/useLanguage';
import { useTheme } from '../../context/useTheme';

const SECTION_IDS = ['about', 'work', 'experience', 'capabilities', 'contact'];

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

const Header = () => {
  const { lang, toggleLang, content } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sections = SECTION_IDS.map((id) => ({ id, label: content.nav[id] }));

  useEffect(() => {
    const observedSections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!observedSections.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visibleEntry) setActiveSection(visibleEntry.target.id);
    }, { rootMargin: '-64px 0px -45%', threshold: [0.15, 0.5, 0.75] });
    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const linkClass = (id) =>
    `inline-flex min-h-[44px] items-center rounded px-2 font-body text-[length:var(--type-meta)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold ${
      activeSection === id ? 'text-hero-gold' : 'text-hero-muted hover:text-hero-signal'
    }`;
  const renderLinks = (onNavigate) => sections.map(({ id, label }) => (
    <a key={id} href={`#${id}`} className={linkClass(id)} aria-current={activeSection === id ? 'page' : undefined} onClick={onNavigate}>
      {label}
    </a>
  ));
  const themeButton = (
    <button type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'} className="pressable inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-hero-muted hover:text-hero-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold">
      <ThemeIcon theme={theme} />
    </button>
  );

  return (
    <header className="sticky top-0 z-sticky h-header border-b border-hero-line bg-hero">
      <nav aria-label="Main navigation" className="mx-auto flex h-full max-w-container items-center justify-between px-gutter">
        <a href="#about" className="inline-flex min-h-[44px] items-center gap-2 rounded font-body text-[length:var(--type-meta)] font-semibold text-hero-ink transition-colors hover:text-hero-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold">
          <span role="img" aria-label="Cat mark">🐱</span> Josh Wang
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {renderLinks()}
          <button type="button" onClick={toggleLang} aria-label="Switch language" className="pressable inline-flex min-h-[44px] items-center rounded px-2 font-body text-[length:var(--type-meta)] text-hero-muted hover:text-hero-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold">{lang === 'zh' ? 'EN' : '中文'}</button>
          {themeButton}
        </div>
        <div className="flex items-center gap-1 lg:hidden">
          <button type="button" onClick={toggleLang} aria-label="Switch language" className="pressable inline-flex min-h-[44px] items-center rounded px-2 font-body text-[length:var(--type-meta)] text-hero-muted hover:text-hero-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold">{lang === 'zh' ? 'EN' : '中文'}</button>
          {themeButton}
          <button type="button" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsMenuOpen((open) => !open)} className="pressable inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-hero-muted hover:text-hero-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2"><path strokeLinecap="round" d={isMenuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
          </button>
        </div>
      </nav>
      {isMenuOpen && <div id="mobile-navigation" className="absolute left-0 right-0 top-full z-popover border-t border-hero-line bg-hero px-gutter pb-3 lg:hidden"><div className="mx-auto grid max-w-container items-stretch">{renderLinks(() => setIsMenuOpen(false))}</div></div>}
    </header>
  );
};

export default Header;
