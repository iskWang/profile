import React from 'react';
import { CatFace, SkillBadge } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const Skills = ({ skills }) => {
  const { content } = useLanguage();
  const { skills: skillsContent } = content;

  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6 bg-slate-800/30" id="skills">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
          <span className="text-emerald-400 font-mono font-normal">{'>'}</span>
          <span className="text-amber-300">{skillsContent.title}</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>
        <p className="text-slate-400 mb-12 font-mono text-sm">{skillsContent.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-3 font-mono">
                {'<'} {skillsContent.categories.frontend} {'/>'}
              </h3>
              <div className="flex flex-wrap">
                {skills.frontend.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="primary" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 font-mono">
                {'{'} {skillsContent.categories.backend} {'}'}
              </h3>
              <div className="flex flex-wrap">
                {skills.backend.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="secondary" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-3 font-mono flex items-center gap-2">
                <span>🤖</span> {skillsContent.categories.ai}
              </h3>
              <div className="flex flex-wrap">
                {skills.ai.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="primary" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono flex items-center gap-2">
                <span>📱</span> {skillsContent.categories.mobile}
              </h3>
              <div className="flex flex-wrap">
                {skills.mobile.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="tertiary" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 font-mono flex items-center gap-2">
                <span>⚙️</span> {skillsContent.categories.testing}
              </h3>
              <div className="flex flex-wrap">
                {skills.devops.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="secondary" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-3 font-mono flex items-center gap-2">
                <span>🧪</span> {skillsContent.categories.testing_extra || 'Testing'}
              </h3>
              <div className="flex flex-wrap">
                {skills.testing.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="secondary" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
