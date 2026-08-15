import React from 'react';
import { PawPrint } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const catMascotUrl = '/cat-mascot.webp';

/*
 * Warm paper + single-teal-accent direction, rolled out from Header/Footer/
 * App shell down through every section (see index.css's promoted --color-*
 * tokens and tailwind.config.js's paper/ink/teal classes — the source of
 * truth every section pulls from, never a re-declared value here).
 */

const TAG_TILT = ['-rotate-2', 'rotate-1', '-rotate-1'];

const Hero = () => {
  const { content } = useLanguage();
  const { hero } = content;

  const metaItems = [hero.title, hero.experience, hero.focus, hero.location].filter(Boolean);

  return (
    <section
      id="about"
      className="surface-glow relative overflow-hidden px-6 pb-20 pt-36 text-ink sm:pt-32"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        {/* Left: the actual introduction */}
        <div>
          <p className="inline-flex items-center gap-2 text-xl font-medium text-teal sm:text-2xl">
            {hero.welcome}
            <span className="inline-block origin-[70%_70%] animate-[wave_2.6s_ease-in-out_infinite]" aria-hidden="true">
              👋
            </span>
          </p>

          <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            {hero.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-sm text-ink-soft">
            {metaItems.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <span aria-hidden="true" className="text-line">·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {hero.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {hero.tags.map((tag, i) => (
              <span
                key={tag}
                className={`spring-hover ${TAG_TILT[i % TAG_TILT.length]} inline-flex cursor-default items-center gap-2 rounded-xl border border-teal bg-teal-soft px-4 py-2 text-sm font-medium text-teal`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <a
              href={hero.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="spring-hover group inline-flex items-center gap-3 rounded-xl bg-teal px-6 py-3 font-medium text-paper shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <PawPrint className="transition-transform group-hover:rotate-12" />
              <span>{hero.resumeBtn}</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right: the mascot — carries the personality so the copy can stay professional.
            Real line-art cat, masked so the accent color drives its ink instead of a
            hardcoded pixel color. */}
        <div className="flex justify-center lg:justify-end">
          <span
            className="cat-mascot__drift inline-block bg-teal"
            style={{
              width: 220,
              height: 220,
              WebkitMaskImage: `url(${catMascotUrl})`,
              maskImage: `url(${catMascotUrl})`,
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              filter: 'drop-shadow(var(--shadow-mascot))',
            }}
            role="img"
            aria-label="Josh 的貓"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
