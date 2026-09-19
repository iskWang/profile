import React, { useEffect, useState } from 'react';
import { CatFace } from '../common';
import { CONTENT } from '../../constants/content';

const ThemeIcons = () => (
  <>
    <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-icon-sun h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3.5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
    <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-icon-moon h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
    </svg>
  </>
);

const Header = ({ lang, variant = 'home', langHref, scrollToSection }) => {
  const [activeSection, setActiveSection] = useState('about');
  const content = CONTENT[lang];
  const sections = [
    { id: 'about', label: content.nav.about },
    { id: 'projects', label: content.nav.projects },
    { id: 'skills', label: content.nav.skills },
    { id: 'experience', label: content.nav.experience },
    { id: 'contact', label: content.nav.contact },
  ];
  const scroll = (sectionId) => {
    if (scrollToSection) return scrollToSection(sectionId);
    const element = document.getElementById(sectionId);
    if (!element) return;
    const start = window.scrollY;
    const target = start + element.getBoundingClientRect().top - (window.innerWidth < 640 ? 128 : 80);
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / 400, 1);
      window.scrollTo(0, start + (target - start) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (variant !== 'home') return undefined;
    const hero = document.querySelector('#about');
    if (hero) hero.classList.add('section-visible');
    const sectionsToReveal = document.querySelectorAll('main section:not(#about)');
    sectionsToReveal.forEach((section) => section.classList.add('section-animate'));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.05 });
    sectionsToReveal.forEach((section) => observer.observe(section));
    const handleScroll = () => {
      const position = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && position >= element.offsetTop && position < element.offsetTop + element.offsetHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [variant, sections]);

  const home = variant === 'home';
  const blogLink = home ? (
    <button onClick={() => scroll('writing')} className="spring-hover whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded px-1 text-ink-soft hover:text-teal">
      {lang === 'en' ? 'Blog' : '文章'}
    </button>
  ) : (
    <a href={`/${lang === 'en' ? 'en' : 'zh-tw'}#writing`} className="spring-hover whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded px-1 text-ink-soft hover:text-teal">
      {lang === 'en' ? 'Blog' : '文章'}
    </a>
  );
  return (
    <header className="fixed top-0 w-full z-50 bg-paper border-b border-line">
      <div className="header-progress" aria-hidden="true">
        <div className="header-progress-fill" />
      </div>
      <nav className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {home ? (
          <button className="flex items-center gap-2 group text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded spring-hover" onClick={() => scroll('about')}>
            <CatFace size="text-xl" /><span className="text-xl group-hover:text-teal transition-colors">Josh Wang</span>
          </button>
        ) : (
          <a href={lang === 'en' ? '/en' : '/zh-tw'} className="flex items-center gap-2 group text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded spring-hover">
            <CatFace size="text-xl" /><span className="text-xl group-hover:text-teal transition-colors">Josh Wang</span>
          </a>
        )}
        <div className="flex items-center gap-2 md:gap-6 text-sm overflow-x-auto no-scrollbar max-w-full px-2">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {index > 0 && <span className="text-line sm:hidden">/</span>}
              {home ? (
                <button onClick={() => scroll(section.id)} className={`spring-hover whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded px-1 ${activeSection === section.id ? 'text-teal font-semibold' : 'text-ink-soft hover:text-teal'}`}>{section.label}</button>
              ) : (
                <a href={`/${lang === 'en' ? 'en' : 'zh-tw'}#${section.id}`} className="spring-hover whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded px-1 text-ink-soft hover:text-teal">{section.label}</a>
              )}
              {index === 0 && (
                <>
                  <span className="text-line sm:hidden">/</span>
                  {blogLink}
                </>
              )}
            </React.Fragment>
          ))}
          {langHref && <a href={langHref} aria-label={lang === 'zh' ? 'EN — 切換為英文' : '中文 — Switch to Chinese'} className="ml-2 font-mono text-xs px-3 py-2 min-h-[44px] flex items-center rounded-lg border border-line text-ink-soft hover:text-teal hover:border-teal transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal">{lang === 'zh' ? 'EN' : '中文'}</a>}
          <button id="theme-toggle" type="button" aria-label="Toggle theme" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-line text-ink-soft transition-all hover:border-teal hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal">
            <ThemeIcons />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
