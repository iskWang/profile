import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const METRICS = [
  { value: '10+', label: 'Years' },
  { value: '90%', label: 'Cloud cost cut' },
  { value: '13', label: 'Locales shipped' },
  { value: '1.5d', label: 'POC cycle' },
];

const Hero = () => {
  const { content } = useLanguage();
  const { hero } = content;

  return (
    <section id="about" className="px-4 pb-16 pt-32 sm:px-6 lg:pb-24 lg:pt-36">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-black bg-[#111111] p-5 text-white shadow-[8px_8px_0_#111111] sm:p-8 lg:min-h-[590px]">
          <div className="mb-12 flex items-center justify-between gap-4">
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-lime-300">
              {hero.location}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">{hero.focus}</span>
          </div>

          <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-white/45">{hero.title}</p>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.05em] text-white sm:text-7xl lg:text-8xl">
            {hero.name}
            <span className="block text-lime-300">builds front-end systems with AI-era workflow.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={hero.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center rounded-full bg-lime-300 px-5 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
            >
              {hero.resumeBtn}
            </a>
            <a
              href="mailto:spjay1@gmail.com"
              className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-1 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              spjay1@gmail.com
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bento-card bg-white p-5 sm:col-span-2">
            <p className="section-kicker">Signal</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
              Architecture, delivery pressure, and AI-assisted engineering in one operator.
            </h2>
          </div>

          {METRICS.map((metric) => (
            <div key={metric.label} className="bento-card bg-lime-300 p-5">
              <p className="text-4xl font-black tracking-[-0.06em]">{metric.value}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-black/60">{metric.label}</p>
            </div>
          ))}

          <div className="bento-card bg-[#dff8ff] p-5 sm:col-span-2">
            <p className="section-kicker">Current Stack</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {hero.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/15 bg-white px-3 py-2 text-sm font-bold text-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
