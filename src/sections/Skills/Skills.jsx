import React from 'react';
import { SectionHeader } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const Skills = ({ skills }) => {
  const { content } = useLanguage();
  const { skills: skillsContent } = content;
  const groups = [
    { label: skillsContent.categories.frontend, items: skills.frontend, tone: 'bg-black text-white', inverted: true },
    { label: skillsContent.categories.ai, items: skills.ai, tone: 'bg-white text-black' },
    { label: skillsContent.categories.testing, items: skills.devops, tone: 'bg-[#dff8ff] text-black' },
    { label: skillsContent.categories.backend, items: skills.backend, tone: 'bg-white text-black' },
    { label: skillsContent.categories.mobile, items: skills.mobile, tone: 'bg-white text-black' },
    { label: skillsContent.categories.testing_extra || 'Testing', items: skills.testing, tone: 'bg-white text-black' },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="skills">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker={skillsContent.subtitle}
          title={skillsContent.title}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {groups.map((group, index) => (
            <article key={group.label} className={`bento-card p-5 ${group.tone} ${index === 0 || index === 1 ? 'md:col-span-1' : ''}`}>
              <p className={`text-xs font-black uppercase tracking-[0.2em] ${group.inverted ? 'text-white/55' : 'text-black/50'}`}>
                {group.label}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full border px-3 py-2 text-sm font-bold ${
                      group.inverted ? 'border-white/15 bg-white/10 text-white' : 'border-black/15 bg-white/70 text-black'
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
