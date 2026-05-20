import React from 'react';
import { TerminalLine, CatFace } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const TAG_STYLES = [
  'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  'bg-amber-500/10 border-amber-500/30 text-amber-400',
  'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
];

const Hero = () => {
  const { content } = useLanguage();
  const { hero } = content;

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 pt-32 sm:pt-20">
      <div className="max-w-4xl w-full">

        {/* Terminal card */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-slate-400 text-sm font-mono">josh@taipei ~ %</span>
            <CatFace size="text-sm" className="ml-2" />
          </div>

          <div className="p-4 sm:p-8 font-mono space-y-4 text-xs sm:text-sm md:text-base">
            <TerminalLine delay={100}>
              <span className="text-slate-300">cat</span>
              <span className="text-cyan-400 ml-2">./profile.json</span>
            </TerminalLine>

            <div className="pl-4 sm:pl-6 space-y-2">
              <TerminalLine delay={300} prefix="">
                <span className="text-slate-500">{'{'}</span>
              </TerminalLine>
              <TerminalLine delay={500} prefix="">
                <span className="text-cyan-300 ml-2 sm:ml-4">"name"</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">"{hero.name}"</span>
                <span className="text-slate-400">,</span>
              </TerminalLine>
              <TerminalLine delay={700} prefix="">
                <span className="text-cyan-300 ml-2 sm:ml-4">"title"</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">"{hero.title}"</span>
                <span className="text-slate-400">,</span>
              </TerminalLine>
              <TerminalLine delay={900} prefix="">
                <span className="text-cyan-300 ml-2 sm:ml-4">"experience"</span>
                <span className="text-slate-400">: </span>
                <span className="text-emerald-400">"{hero.experience}"</span>
                <span className="text-slate-400">,</span>
              </TerminalLine>
              <TerminalLine delay={1100} prefix="">
                <span className="text-cyan-300 ml-2 sm:ml-4">"focus"</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">"{hero.focus}"</span>
                <span className="text-slate-400">,</span>
              </TerminalLine>
              <TerminalLine delay={1300} prefix="">
                <span className="text-cyan-300 ml-2 sm:ml-4">"location"</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">"{hero.location}"</span>
                <span className="text-slate-400">,</span>
              </TerminalLine>
              <TerminalLine delay={1500} prefix="">
                <span className="text-cyan-300 ml-2 sm:ml-4">"pet"</span>
                <span className="text-slate-400">: </span>
                <span className="text-amber-300">"🐱"</span>
              </TerminalLine>
              <TerminalLine delay={1700} prefix="">
                <span className="text-slate-500">{'}'}</span>
              </TerminalLine>
            </div>

            <TerminalLine delay={2000}>
              <span className="text-emerald-400">josh.init()</span>
              <span className="animate-pulse">▊</span>
            </TerminalLine>
          </div>
        </div>

        {/* Quick intro — inside max-w-4xl so it stacks below the terminal */}
        <div className="mt-6 sm:mt-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold px-4">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {hero.welcome}
            </span>
            <span className="ml-2 sm:ml-3 inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-loose px-4 mt-4">
            {hero.description}
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            {hero.tags.map((tag, i) => (
              <span
                key={i}
                className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-2 cursor-default ${TAG_STYLES[i % TAG_STYLES.length]}`}
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
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl text-amber-300 hover:text-amber-200 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all group"
            >
              <CatFace size="text-xl" className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">{hero.resumeBtn}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
