import React from 'react';

const ExperienceCard = ({ company, role, period, highlights, subProjects, description, index = 0 }) => {
  return (
    <article className="bento-card grid gap-6 bg-white p-5 md:grid-cols-[0.36fr_0.64fr] md:p-7">
      <div>
        <p className="section-kicker">{String(index + 1).padStart(2, '0')} / {period}</p>
        <h3 className="mt-4 text-2xl font-black leading-tight tracking-[-0.04em] sm:text-3xl md:whitespace-nowrap md:text-[clamp(1.55rem,2.05vw,2rem)]">{role}</h3>
        <p className="mt-3 text-base font-black text-black/60">{company}</p>
        {description && (
          <p className="mt-4 rounded-2xl bg-lime-300 p-4 text-sm font-bold leading-6 text-black">{description}</p>
        )}
      </div>

      {subProjects && subProjects.length > 0 ? (
        <div className="grid gap-3">
          {subProjects.map((project, idx) => (
            <div key={idx} className="rounded-2xl border border-black/10 bg-[#f4f1e8] p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {project.url ? (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-black text-black underline decoration-black/20 underline-offset-4 transition hover:decoration-black"
                  >
                    {project.title}
                  </a>
                ) : (
                  <span className="font-black text-black">{project.title}</span>
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
            </div>
          ))}
        </div>
      ) : (
        <ul className="grid gap-3">
          {highlights.map((item, i) => (
            <li key={i} className="rounded-2xl border border-black/10 bg-[#f4f1e8] p-4 text-sm font-medium leading-6 text-black/68">
              <span className="mr-3 font-black text-black">{String(i + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default ExperienceCard;
