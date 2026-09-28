import React from 'react';
import { CONTENT } from '../../generated/content.js';
import { UI } from '../../i18n/ui.js';
import { keyOutcomes } from '../../lib/record.js';
import { Field, FormHeader, Ledger, Seal } from '../../components/form';

// Bold the figure that made this row a key outcome, leave the sentence intact.
function withMarker(text, marker) {
  const at = text.indexOf(marker);
  if (at < 0) return text;
  const end = text.slice(at).search(/[\s，,。]/);
  const figure = end < 0 ? text.slice(at) : text.slice(at, at + end);
  return (
    <>
      {text.slice(0, at)}
      <strong className="fill-mark">{figure}</strong>
      {text.slice(at + figure.length)}
    </>
  );
}

export default function About({ lang }) {
  const { hero, contact } = CONTENT[lang];
  const ui = UI[lang];
  const outcomes = keyOutcomes(lang);
  const sealLabel = { delivered: ui.form.delivered, progress: ui.form.progress };

  return (
    <section id="about" className="record-part record-about" aria-labelledby="about-name">
      <FormHeader
        title={ui.form.title}
        docNoLabel={ui.form.docNoLabel}
        docNo={ui.form.docNo}
        legend={{ label: ui.form.legend, delivered: ui.form.delivered, progress: ui.form.progress }}
      />

      <div className="about-fields">
        <Field label={ui.about.name} side className="about-fields__name">
          <h1 id="about-name" className="about-name">{hero.name}</h1>
        </Field>
        <Field label={ui.about.role}>{hero.title}</Field>
        <Field label={ui.about.location}>{hero.location}</Field>
        <Field label={ui.about.years}><span data-data>{hero.experience}</span></Field>
        <Field label={ui.about.focus}>{hero.focus}</Field>
        <Field label={ui.about.contact} className="about-fields__contact">
          <div className="about-actions">
            <a className="action action--primary" href={`mailto:${contact.email}`}>
              <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2.75" y="4.75" width="14.5" height="10.5" />
                <path d="m3 5.5 7 5.25 7-5.25" />
              </svg>
              {ui.about.email}
            </a>
            <a className="action" href={hero.resumeUrl} target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 2.75h6.5L15 6.25v11H5z" />
                <path d="M11.25 2.75v3.75H15M7.5 10.5h5M7.5 13.5h5" />
              </svg>
              {ui.about.resume}
            </a>
          </div>
        </Field>
      </div>

      <Field label={ui.about.summary} className="about-summary">
        <p>{hero.description}</p>
      </Field>

      <Ledger
        caption={ui.about.ledgerCaption}
        className="ledger--outcomes"
        columns={[
          { key: 'no', label: ui.about.colItem, className: 'ledger__no' },
          { key: 'delivery', label: ui.about.colDelivery },
          { key: 'unit', label: ui.about.colUnit, className: 'ledger__unit' },
          { key: 'status', label: ui.about.colStatus, className: 'ledger__status' },
        ]}
        rows={outcomes.map((outcome) => ({
          cells: {
            no: <a className="item-no" href={`#${outcome.id}`} data-data>{outcome.no}</a>,
            delivery: (
              <>
                <p className="outcome__text">{withMarker(outcome.text, outcome.marker)}</p>
                <p className="outcome__context">{outcome.context}</p>
              </>
            ),
            unit: (
              <>
                <p>{outcome.company}</p>
                <p className="outcome__period" data-data>{outcome.period}</p>
              </>
            ),
            status: <Seal kind={outcome.seal.kind} label={sealLabel[outcome.seal.kind]} date={outcome.seal.date} instance={outcome.id} />,
          },
        }))}
      />
    </section>
  );
}
