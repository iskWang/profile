import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Highlights = ({ items }) => (
  <ul className="mt-3 space-y-2 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted">
    {items.map((highlight) => (
      <li key={highlight} className="flex items-start gap-3 text-pretty">
        <span aria-hidden="true">–</span>
        <span>{highlight}</span>
      </li>
    ))}
  </ul>
);

const ExperienceRow = ({ period, children, last = false }) => (
  <div className={`grid grid-cols-1 gap-3 py-7 md:grid-cols-[7.5rem_minmax(0,1fr)] md:gap-8 ${last ? '' : 'border-b border-line'}`}>
    <div className="font-mono text-[length:var(--type-meta)] leading-[var(--leading-meta)] text-ink-muted">
      {period}
    </div>
    <div>{children}</div>
  </div>
);

const Experience = () => {
  const { content } = useLanguage();
  const experience = content.experience;

  return (
    <section id="experience" className="py-[var(--space-section-standard)]">
      <div className="max-w-container mx-auto px-gutter">
        <header className="mb-[2rem]">
          <h2 className="font-display text-[length:var(--type-section)] leading-[var(--leading-section)] text-ink text-balance">
            {experience.title}
          </h2>
          <p className="prose-width mt-4 max-w-[68ch] text-[length:var(--type-lead)] leading-[var(--leading-lead)] text-ink-muted text-pretty">
            {experience.intro}
          </p>
        </header>

        <div>
          {experience.items.map((item) => (
            <ExperienceRow key={`${item.company}-${item.period}`} period={item.period}>
              <h3 className="font-display text-[length:var(--type-title)] leading-[var(--leading-title)] text-ink text-balance">
                {item.company}
              </h3>
              <p className="mt-1 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted text-pretty">
                {item.role}
              </p>

              {item.engagements ? (
                <div className="mt-6 space-y-6">
                  {item.engagements.map((engagement) => (
                    <div key={`${engagement.title}-${engagement.client}`}>
                      <h4 className="text-[length:var(--type-body)] font-semibold leading-[var(--leading-body)] text-ink text-balance">
                        {engagement.title}
                      </h4>
                      <p className="mt-1 font-mono text-[length:var(--type-meta)] leading-[var(--leading-meta)] text-ink-muted">
                        {engagement.client}
                      </p>
                      <Highlights items={engagement.highlights} />
                    </div>
                  ))}
                </div>
              ) : (
                <Highlights items={item.highlights} />
              )}
            </ExperienceRow>
          ))}

          <ExperienceRow period={experience.earlyCareer.period}>
            <h3 className="font-display text-[length:var(--type-title)] leading-[var(--leading-title)] text-ink text-balance">
              {experience.earlyCareer.title}
            </h3>
            <p className="mt-1 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted text-pretty">
              {experience.earlyCareer.company}
            </p>
            <Highlights items={experience.earlyCareer.highlights} />
          </ExperienceRow>

          <ExperienceRow period={experience.education.period} last>
            <h3 className="font-display text-[length:var(--type-title)] leading-[var(--leading-title)] text-ink text-balance">
              {experience.education.title}
            </h3>
            <p className="mt-1 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted text-pretty">
              {experience.education.school}
            </p>
            <p className="mt-1 text-[length:var(--type-meta)] leading-[var(--leading-meta)] text-ink-muted text-pretty">
              {experience.education.degree}
            </p>
          </ExperienceRow>
        </div>
      </div>
    </section>
  );
};

export default Experience;
