import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Projects = ({ projects }) => {
  const { content } = useLanguage();
  const { projects: projectsContent } = content;

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="projects">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-t border-black pt-5 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">{projectsContent.subtitle}</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{projectsContent.title}</h2>
          </div>
          <p className="max-w-sm text-sm font-medium leading-6 text-black/60">
            Proof-of-work over decoration: shipped tooling, automation, and test generation.
          </p>
        </div>

        <div className="grid gap-4">
          {projects.map((project, i) => (
            <div 
              key={i} 
              className="bento-card group grid gap-6 bg-white p-5 transition hover:-translate-y-1 md:grid-cols-[0.85fr_1.15fr] md:p-7"
            >
              <div>
                <p className="section-kicker">Open Source / Case Study</p>
                <h3 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em]">{project.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-black/15 bg-lime-300 px-3 py-1 text-xs font-black uppercase tracking-[0.12em]">
                      {tag}
                    </span>
                  ))}
                </div>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-black bg-black px-4 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    View source
                  </a>
                )}
              </div>

              <div className="grid gap-3">
                {project.highlights.map((highlight, idx) => (
                  <p key={idx} className="rounded-2xl border border-black/10 bg-[#f4f1e8] p-4 text-sm font-medium leading-6 text-black/72">
                    <span className="mr-3 font-black text-black">{String(idx + 1).padStart(2, '0')}</span>
                    {highlight}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
