import React from 'react';
import { CatFace, SkillBadge } from '../../components/common';

const Skills = ({ skills }) => {
  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6 bg-slate-800/30" id="skills">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-emerald-400 font-mono">{'>'}</span>
          <span>技能樹</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>
        <p className="text-slate-400 mb-12 font-mono text-sm">// Tech stack overview</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-3 font-mono">
                {'<'} Front-End {'/>'} 
              </h3>
              <div className="flex flex-wrap">
                {skills.frontend.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="primary" />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 font-mono">
                {'{'} Back-End {'}'}
              </h3>
              <div className="flex flex-wrap">
                {skills.backend.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="secondary" />
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono flex items-center gap-2">
                <span>📱</span> Mobile
              </h3>
              <div className="flex flex-wrap">
                {skills.mobile.map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="tertiary" />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-3 font-mono flex items-center gap-2">
                <span>⚙️</span> DevOps & Testing
              </h3>
              <div className="flex flex-wrap">
                {[...skills.devops, ...skills.testing].map((skill, i) => (
                  <SkillBadge key={i} name={skill} level="primary" />
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
