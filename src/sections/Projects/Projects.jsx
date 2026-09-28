import React from 'react';
import { CONTENT } from '../../generated/content.js';
import { UI } from '../../i18n/ui.js';
import { SectionBar } from '../../components/form';

const LETTERS = 'abcdefghij';

export default function Projects({ lang }) {
  const ui = UI[lang];
  const { projects } = CONTENT[lang];
  return (
    <section id="projects" className="record-part" aria-labelledby="projects-title">
      <SectionBar titleId="projects-title" title={ui.projects.title} count={ui.projects.count(projects.items.length)} />
      {projects.items.map((project) => (
        <article key={project.title} className="project">
          <header className="project__head">
            <img className="project__logo" src="/picklescout-logo.webp" alt="" width="128" height="128" loading="lazy" />
            <div>
              <h3 className="project__title">{project.title}</h3>
              <p className="project__tags" data-data>{project.tags.join(' · ')}</p>
            </div>
            {project.url && (
              <a className="action project__source" href={project.url} target="_blank" rel="noopener noreferrer">
                <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 6 3 10l4 4M13 6l4 4-4 4" />
                </svg>
                {ui.projects.source}
              </a>
            )}
          </header>
          <ol className="clause-list">
            {project.highlights.map((highlight, index) => (
              <li key={highlight} className="clause">
                <span className="clause__no" data-data aria-hidden="true">{LETTERS[index]}</span>
                <p>{highlight}</p>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </section>
  );
}
