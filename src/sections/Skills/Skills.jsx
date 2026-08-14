import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Skills = () => {
  const { content } = useLanguage();
  const { capabilities } = content;

  return (
    <section id="capabilities" className="section-stable section-capabilities bg-surface py-[var(--space-section-standard)]">
      <div className="mx-auto max-w-container px-gutter">
        <header className="mb-[2rem] max-w-[68ch]">
          <h2 className="font-display text-[length:var(--type-title)] font-semibold leading-[var(--leading-title)] text-ink">
            {capabilities.title}
          </h2>
          <p className="mt-4 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted">
            {capabilities.intro}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[var(--grid-gap)] md:grid-cols-3">
          {capabilities.groups.map((group) => (
            <article key={group.title}>
              <h3 className="font-display text-[length:var(--type-title)] font-semibold leading-[var(--leading-title)] text-ink">
                {group.title}
              </h3>
              <p className="mt-3 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted">
                {group.description}
              </p>
              <p className="mt-4 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink">
                {group.tools.join(', ')}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
