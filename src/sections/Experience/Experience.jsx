import React from 'react';
import { CatFace, PawPrint } from '../../components/common';
import ExperienceCard from '../../components/ExperienceCard';
import { useLanguage } from '../../context/useLanguage';

const Experience = ({ experiences }) => {
  const { content } = useLanguage();
  const { experience } = content;

  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6 bg-paper" id="experience">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center gap-3 text-ink">
          <span>{experience.title}</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>
        <p className="text-ink-soft mb-12 font-mono text-sm">{experience.subtitle}</p>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <ExperienceCard key={i} {...exp} isCurrent={i === 0} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-ink-soft text-sm font-mono flex items-center justify-center gap-2">
            <PawPrint className="text-ink-soft" />
            {experience.earlyExperience}
            <PawPrint className="text-ink-soft" />
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
