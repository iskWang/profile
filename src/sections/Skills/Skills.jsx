import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Skills = ({ skills }) => {
  const { content } = useLanguage();
  const { skills: skillsContent } = content;
  const groups = [
    { label: skillsContent.categories.frontend, items: skills.frontend, tone: 'bg-black text-white' },
    { label: skillsContent.categories.ai, items: skills.ai, tone: 'bg-lime-300 text-black' },
    { label: skillsContent.categories.testing, items: skills.devops, tone: 'bg-[#dff8ff] text-black' },
    { label: skillsContent.categories.backend, items: skills.backend, tone: 'bg-white text-black' },
    { label: skillsContent.categories.mobile, items: skills.mobile, tone: 'bg-white text-black' },
    { label: skillsContent.categories.testing_extra || 'Testing', items: skills.testing, tone: 'bg-white text-black' },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="skills">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-t border-black pt-5">
          <p className="section-kicker">{skillsContent.subtitle}</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{skillsContent.title}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {groups.map((group, index) => (
            <article key={group.label} className={`bento-card p-5 ${group.tone} ${index === 0 || index === 1 ? 'md:col-span-1' : ''}`}>
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${group.tone.includes('black') ? 'text-white/55' : 'text-black/50'}`}>
                {group.label}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full border px-3 py-2 text-sm font-bold ${
                      group.tone.includes('black') ? 'border-white/15 bg-white/10 text-white' : 'border-black/15 bg-white/65 text-black'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
