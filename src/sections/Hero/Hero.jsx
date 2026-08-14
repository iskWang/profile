import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Hero = () => {
  const { content, lang } = useLanguage();
  const { hero } = content;
  const heroLeading = lang === 'zh' ? 'leading-[var(--leading-hero-zh)]' : 'leading-[var(--leading-hero)]';
  const summaryWidth = lang === 'zh' ? 'max-w-[32em]' : 'max-w-[68ch]';

  return (
    <section
      id="about"
      className="px-gutter pt-[var(--space-section-feature)] pb-[var(--space-section-standard)]"
    >
      <div className="mx-auto max-w-container">
        <p className="text-[length:var(--type-meta)] uppercase tracking-[0.16em] text-accent">
          {hero.role}
        </p>

        <h1
          className={`mt-3 font-display text-[length:var(--type-hero)] ${heroLeading} tracking-[-0.03em] text-ink [text-wrap:balance]`}
        >
          {hero.name}
        </h1>

        {/* Two-column: summary left, evidence + CTAs right */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-12">
          {/* Left: summary */}
          <p
            className={`text-[length:var(--type-lead)] leading-[var(--leading-lead)] text-ink-muted [text-wrap:pretty] ${summaryWidth}`}
          >
            {hero.summary}
          </p>

          {/* Right: evidence + CTAs */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4" aria-label="Evidence">
              {hero.evidence.slice(0, 2).map((item) => (
                <div key={`${item.label}-${item.value}`} className="border-l-2 border-accent pl-4">
                  <span className="text-[length:var(--type-title)] font-bold leading-[var(--leading-title)] text-accent">
                    {item.value}
                  </span>
                  <p className="mt-1 text-[length:var(--type-meta)] leading-[var(--leading-meta)] text-ink-muted">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-row flex-wrap gap-3">
              <a
                href={hero.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-accent px-5 py-3 text-[length:var(--type-meta)] font-medium text-bg transition-colors hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {hero.resumeBtn}
              </a>
              <a
                href="#work"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] border border-line px-5 py-3 text-[length:var(--type-meta)] font-medium text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {hero.projectBtn}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
