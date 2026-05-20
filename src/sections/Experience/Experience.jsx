import React from 'react';
import { CatFace, PawPrint } from '../../components/common';
import ExperienceCard from '../../components/ExperienceCard';
import { useLanguage } from '../../context/useLanguage';

const Experience = ({ experiences }) => {
  const { content } = useLanguage();
  const { experience } = content;

  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6" id="experience">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-emerald-400 font-mono">{'>'}</span>
          <span>{experience.title}</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>
        <p className="text-slate-400 mb-12 font-mono text-sm">{experience.subtitle}</p>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <ExperienceCard key={i} {...exp} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-mono flex items-center justify-center gap-2">
            <PawPrint className="text-amber-400/50" />
            {experience.earlyExperience}
            <PawPrint className="text-amber-400/50" />
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
