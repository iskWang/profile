import React from 'react';
import PawPrint from '../common/PawPrint';

const ExperienceCard = ({ company, role, period, highlights, subProjects, description }) => {
  return (
    <div className="experience-card relative p-6 rounded-lg border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm cursor-default">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-xl font-semibold text-white">{role}</h3>
        <span className="text-sm text-slate-400 font-mono bg-slate-700/50 px-3 py-1 rounded">{period}</span>
      </div>
      <p className="text-emerald-400 font-medium mb-2">{company}</p>
      {description && (
        <p className="text-slate-400 text-sm mb-3 italic">{description}</p>
      )}

      {subProjects && subProjects.length > 0 ? (
        <div className="space-y-4">
          {subProjects.map((project, idx) => (
            <div key={idx} className="pl-2 border-l-2 border-slate-600/50">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-slate-200 font-medium">{project.title}</span>
                {project.period && (
                  <span className="text-xs text-slate-500 font-mono">{project.period}</span>
                )}
              </div>
              <ul className="space-y-2 pl-2">
                {project.highlights.map((item, i) => (
                  <li key={i} className="text-slate-300 text-sm flex items-start">
                    <PawPrint className="text-amber-400/70 mr-2 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {highlights.map((item, i) => (
            <li key={i} className="text-slate-300 text-sm flex items-start">
              <PawPrint className="text-amber-400/70 mr-2 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExperienceCard;
