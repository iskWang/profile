import React from 'react';
import { UI } from '../../i18n/ui.js';
import { experienceRecord } from '../../lib/record.js';
import { SectionBar, Seal } from '../../components/form';

export default function Experience({ lang }) {
  const ui = UI[lang];
  const record = experienceRecord(lang);
  const total = record.reduce((sum, job) => sum + job.groups.reduce((n, group) => n + group.items.length, 0), 0);
  const sealLabel = { delivered: ui.form.delivered, progress: ui.form.progress };

  return (
    <section id="experience" className="record-part" aria-labelledby="experience-title">
      <SectionBar titleId="experience-title" title={ui.experience.title} count={ui.experience.count(total)} />
      {record.map((job) => (
        <article key={job.period} className="role">
          <header className="role__head">
            <div className="role__who">
              <h3 className="role__title">{job.role}</h3>
              <p className="role__company">{job.company}</p>
            </div>
            <p className="role__period" data-data>{job.period}</p>
            <Seal kind={job.seal.kind} label={sealLabel[job.seal.kind]} date={job.seal.date} instance={`role-${job.period}`} />
          </header>
          {job.groups.map((group) => (
            <div key={group.title} className="role__group">
              <h4 className="role__subhead">{group.title}</h4>
              <ol className="clause-list">
                {group.items.map((item) => (
                  <li key={item.id} id={item.id} className="clause">
                    <a className="clause__no item-no" href={`#${item.id}`} aria-label={`${ui.experience.permalink} ${item.no}`} data-data>{item.no}</a>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}
