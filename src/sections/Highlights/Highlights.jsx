import React from 'react';
import { CatFace } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const colorMap = {
  cyan:    'border-cyan-500/30 bg-cyan-500/5 highlight-card-cyan',
  amber:   'border-amber-500/30 bg-amber-500/5 highlight-card-amber',
  emerald: 'border-emerald-500/30 bg-emerald-500/5 highlight-card-emerald',
};

const Highlights = () => {
  const { content } = useLanguage();
  const { highlights } = content;

  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
          <span className="text-emerald-400 font-mono">{'>'}</span>
          <span>{highlights.title}</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.items.map((item, i) => (
            <div
              key={i}
              className={`highlight-card p-6 rounded-xl border cursor-default group ${colorMap[item.color] ?? colorMap.cyan}`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
                {item.emoji}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
