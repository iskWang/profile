import React from 'react';
import ExperienceCard from '../../components/ExperienceCard';
import { useLanguage } from '../../context/useLanguage';

const Experience = ({ experiences }) => {
  const { content } = useLanguage();
  const { experience } = content;

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="experience">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 border-t border-black pt-5 lg:grid-cols-[0.5fr_1fr]">
          <div>
            <p className="section-kicker">{experience.subtitle}</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{experience.title}</h2>
          </div>
          <p className="max-w-2xl text-lg font-medium leading-8 text-black/62">
            {experience.summary}
          </p>
        </div>

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
