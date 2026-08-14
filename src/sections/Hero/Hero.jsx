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
      className="section-stable section-about bg-hero py-[var(--space-section-feature)] text-hero-ink"
    >
      <div className="mx-auto max-w-container px-gutter">
        <p className="text-[length:var(--type-meta)] uppercase tracking-[0.16em] text-hero-gold">
          {hero.role}
        </p>

        <h1
          className={`mt-3 font-display text-[length:var(--type-hero)] ${heroLeading} tracking-[-0.03em] text-heading [text-wrap:balance]`}
        >
          {hero.name}
        </h1>

        {/* Two-column: summary left, evidence + CTAs right */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-12">
          {/* Left: summary */}
          <p
            className={`text-[length:var(--type-lead)] leading-[var(--leading-lead)] text-hero-muted [text-wrap:pretty] ${summaryWidth}`}
          >
            {hero.summary}
          </p>

          {/* Right: evidence + CTAs */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4" aria-label="Evidence">
              {hero.evidence.slice(0, 2).map((item) => (
                <div key={`${item.label}-${item.value}`} className="border-t border-hero-line pt-3">
                  <span className="text-[length:var(--type-title)] font-bold leading-[var(--leading-title)] text-hero-signal">
                    {item.value}
                  </span>
                  <p className="mt-1 text-[length:var(--type-meta)] font-medium leading-[var(--leading-meta)] text-hero-ink">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[length:var(--type-meta)] leading-[var(--leading-meta)] text-hero-muted">
                    {item.context}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-row flex-wrap gap-3">
              <a
                href={hero.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-hero-signal px-5 py-3 text-[length:var(--type-meta)] font-medium text-hero-button-ink hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold focus-visible:ring-offset-2 focus-visible:ring-offset-hero"
              >
                {hero.resumeBtn}
              </a>
              <a
                href="#work"
                className="pressable inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] border border-hero-muted px-5 py-3 text-[length:var(--type-meta)] font-medium text-hero-ink hover:border-hero-gold hover:text-hero-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-gold focus-visible:ring-offset-2 focus-visible:ring-offset-hero"
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
