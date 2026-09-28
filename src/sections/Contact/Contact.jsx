import React from 'react';
import { CONTENT } from '../../generated/content.js';
import { UI } from '../../i18n/ui.js';
import { Field, SectionBar, Seal } from '../../components/form';

export default function Contact({ lang }) {
  const ui = UI[lang];
  const { contact, hero } = CONTENT[lang];
  return (
    <section id="contact" className="record-part record-signoff" aria-labelledby="contact-title">
      <SectionBar titleId="contact-title" title={ui.contact.title} />
      <div className="signoff">
        <Field label={ui.contact.remark} className="signoff__remark">
          <p>{contact.quote}</p>
        </Field>
        <Field label={ui.contact.email}>
          <a className="signoff__link" href={`mailto:${contact.email}`} data-data>{contact.email}</a>
        </Field>
        <Field label={ui.contact.resume}>
          <a className="signoff__link" href={hero.resumeUrl} target="_blank" rel="noopener noreferrer">{contact.downloadBtn}</a>
        </Field>
        <Field label={ui.contact.signer} className="signoff__signer">
          <div className="signoff__signature">
            <span className="signoff__name">{hero.name}</span>
            <Seal kind="signature" label={ui.form.signature} size="lg" instance="signoff" />
          </div>
        </Field>
      </div>
    </section>
  );
}
