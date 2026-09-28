import React, { useEffect, useState } from 'react';
import { UI } from '../../i18n/ui.js';
import { LOCALES, localePath, otherLang } from '../../i18n/locales.js';

// Section id on the home page → nav label key. Order is fixed by the project guide.
const SECTIONS = [
  ['about', 'about'],
  ['writing', 'blog'],
  ['projects', 'projects'],
  ['skills', 'skills'],
  ['experience', 'experience'],
  ['contact', 'contact'],
];

function ThemeIcons() {
  return (
    <>
      <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" className="theme-icon-sun" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="3.25" />
        <path d="M10 1.75v2M10 16.25v2M1.75 10h2M16.25 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" className="theme-icon-moon" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16.5 11.6A6.75 6.75 0 1 1 8.4 3.5a5.25 5.25 0 0 0 8.1 8.1Z" />
      </svg>
    </>
  );
}

function useActiveSection(enabled) {
  const [active, setActive] = useState('about');
  useEffect(() => {
    if (!enabled) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-20% 0px -65% 0px' },
    );
    SECTIONS.forEach(([id]) => {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, [enabled]);
  return active;
}

/**
 * @param {{ lang: 'zh'|'en', variant?: 'home'|'page', langHref?: string }} props
 */
export default function Header({ lang, variant = 'home', langHref }) {
  const ui = UI[lang];
  const home = variant === 'home';
  const active = useActiveSection(home);

  return (
    <header className="masthead">
      <div className="masthead__bar">
        <a className="masthead__brand" href={localePath(lang)}>
          <span className="masthead__name">Josh Wang</span>
          <span className="masthead__doc" data-data>{ui.form.docNo}</span>
        </a>
        <nav className="masthead__nav" aria-label={ui.chrome.mainNav}>
          <ul>
            {SECTIONS.map(([id, key]) => (
              <li key={id}>
                <a
                  href={home ? `#${id}` : `${localePath(lang)}#${id}`}
                  aria-current={home && active === id ? 'location' : undefined}
                >
                  {ui.nav[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="masthead__tools">
          {langHref && (
            <a
              className="tool"
              href={langHref}
              lang={LOCALES[otherLang(lang)].htmlLang}
              hrefLang={LOCALES[otherLang(lang)].htmlLang}
              data-lang-switch={LOCALES[otherLang(lang)].prefix}
            >
              {ui.chrome.switchLangLabel}
            </a>
          )}
          <button id="theme-toggle" type="button" className="tool tool--icon" aria-label={ui.chrome.theme}>
            <ThemeIcons />
          </button>
        </div>
      </div>
      <div className="header-progress" aria-hidden="true"><div className="header-progress-fill" /></div>
    </header>
  );
}
