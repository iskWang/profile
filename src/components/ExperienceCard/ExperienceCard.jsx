import React from 'react';
import { DetailList, ProfileCard } from '../common';

const ExperienceCard = ({ company, role, period, highlights, subProjects, description, index = 0 }) => {
  return (
    <ProfileCard
      kicker={`${String(index + 1).padStart(2, '0')} / ${period}`}
      title={role}
      subtitle={company}
      description={description}
    >
      {subProjects && subProjects.length > 0 ? (
        <DetailList
          items={subProjects}
          renderItem={(project, idx) => (
            <>
              <div className="mb-3 flex flex-wrap items-start gap-3">
                <span className="font-black text-black">{String(idx + 1).padStart(2, '0')}</span>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 font-black text-black underline decoration-black/20 underline-offset-4 transition hover:decoration-black"
                  >
                    {project.title}
                  </a>
                ) : (
                  <span className="flex-1 font-black text-black">{project.title}</span>
                )}
                {project.period && (
                  <span className="rounded-full border border-black/10 px-2 py-1 text-xs font-bold text-black/50">{project.period}</span>
                )}
              </div>
              <ul className="space-y-2">
                {project.highlights.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm font-medium leading-6 text-black/68">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-black" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        />
      ) : (
        <DetailList items={highlights} />
      )}
    </ProfileCard>
  );
};

export default ExperienceCard;
