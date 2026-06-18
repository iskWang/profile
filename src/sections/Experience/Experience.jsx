import React from 'react';
import ExperienceCard from '../../components/ExperienceCard';
import { SectionHeader } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const Experience = ({ experiences }) => {
  const { content } = useLanguage();
  const { experience } = content;

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="experience">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          kicker={experience.subtitle}
          title={experience.title}
          summary={experience.summary}
        />

        <div className="grid gap-4">
          {experiences.map((exp, i) => (
            <ExperienceCard key={i} index={i} {...exp} />
          ))}
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-black bg-[#111111] p-5 text-white">
          <p className="text-sm font-bold leading-6 text-white/70">
            {experience.earlyExperience}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
