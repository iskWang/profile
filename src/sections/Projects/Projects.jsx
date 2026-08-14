import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Projects = () => {
  const { content } = useLanguage();
  const projectsContent = content.projects;
  const project = projectsContent.items[0];

  return (
    <section id="work" className="section-stable section-work bg-surface py-[var(--space-section-standard)]">
      <div className="mx-auto max-w-container px-gutter">
        <h2 className="font-display text-[length:var(--type-section)] leading-[var(--leading-section)] text-ink [text-wrap:balance]">
          {projectsContent.title}
        </h2>
        <p className="mt-3 max-w-[68ch] text-[length:var(--type-lead)] leading-[var(--leading-lead)] text-ink-muted [text-wrap:pretty]">
          {projectsContent.intro}
        </p>

        {/* Two-column case study: left = narrative, right = details */}
        <article className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-12">
          {/* Left: value prop + flow */}
          <div>
            <h3 className="font-display text-[length:var(--type-title)] leading-[var(--leading-title)] text-ink [text-wrap:balance]">
              {project.title}
            </h3>
            <p className="mt-1 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted [text-wrap:pretty]">
              {project.descriptor}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[length:var(--type-meta)] leading-[var(--leading-meta)] text-ink-muted">
              <span>{project.date}</span>
              <span aria-hidden="true">·</span>
              <span>{project.meta}</span>
            </div>

            <p className="mt-6 text-[length:var(--type-body)] font-medium leading-[var(--leading-body)] text-ink [text-wrap:pretty]">
              {project.value}
            </p>
            <p className="mt-4 font-mono text-[length:var(--type-meta)] leading-[var(--leading-meta)] text-ink-muted [text-wrap:pretty]">
              {project.flow}
            </p>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-[length:var(--type-body)] text-accent underline decoration-1 underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                GitHub →
              </a>
            )}
          </div>

          {/* Right: highlights */}
          <div className="border-l-0 border-line pl-0 lg:border-l lg:pl-8">
            <p className="mb-3 text-[length:var(--type-meta)] font-medium uppercase tracking-[0.1em] text-ink-muted">
              {projectsContent.decisionsTitle}
            </p>
            <ul className="space-y-4 text-[length:var(--type-body)] leading-[var(--leading-body)] text-ink-muted">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="[text-wrap:pretty]">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Projects;
