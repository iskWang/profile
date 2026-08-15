import React from 'react';
import PawPrint from '../common/PawPrint';
import { useLanguage } from '../../context/useLanguage';

const ExperienceCard = ({
  company,
  role,
  period,
  highlights,
  subProjects,
  description,
  isCurrent = false,
}) => {
  const { lang } = useLanguage();
  const cardClasses = isCurrent ? 'border-teal p-8' : 'border-line p-6';

  return (
    <div className={`relative rounded-lg border bg-paper cursor-default ${cardClasses}`}>
      {isCurrent && (
        <span className="absolute top-4 right-4 rounded-full bg-teal-soft px-3 py-1 text-xs font-mono text-teal">
          {lang === 'zh' ? '目前' : 'Current'}
        </span>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pr-20">
        <h3 className="text-xl font-semibold text-ink">{role}</h3>
        <span className="text-sm text-ink-soft font-mono bg-paper-deep px-3 py-1 rounded">{period}</span>
      </div>
      <p className="text-teal font-medium mb-2">{company}</p>
      {description && (
        <p className="text-ink-soft text-sm mb-3 italic">{description}</p>
      )}

      {subProjects && subProjects.length > 0 ? (
        <div className="space-y-4">
          {subProjects.map((project, idx) => (
            <div key={idx} className="pl-2 border-l-2 border-line">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink font-medium spring-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal flex items-center gap-1 group"
                  >
                    {project.title}
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                ) : (
                  <span className="text-ink font-medium">{project.title}</span>
                )}
                {project.period && (
                  <span className="text-xs text-ink-soft font-mono">{project.period}</span>
                )}
              </div>
              <ul className="space-y-2 pl-2">
                {project.highlights.map((item, i) => (
                  <li key={i} className="text-ink text-sm flex items-start">
                    <PawPrint className="text-ink-soft mr-2 mt-0.5 flex-shrink-0" />
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
            <li key={i} className="text-ink text-sm flex items-start">
              <PawPrint className="text-ink-soft mr-2 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExperienceCard;
