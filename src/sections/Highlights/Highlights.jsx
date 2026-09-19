import React from 'react';
import { CatFace } from '../../components/common';
 


const Highlights = ({ content }) => {
  const { highlights } = content;

  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6 bg-paper">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-12 flex items-center gap-3 text-ink">
          <span>{highlights.title}</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.items.map((item, i) => (
            <div
              key={i}
              className="spring-hover p-6 rounded-xl border border-line bg-paper-deep cursor-default group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block" aria-hidden="true">
                {item.emoji}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-ink">{item.title}</h3>
              <p className="text-ink-soft text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
