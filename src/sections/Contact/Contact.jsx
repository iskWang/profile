import React from 'react';
import { CatFace } from '../../components/common';
import { useLanguage } from '../../context/useLanguage';

const Contact = () => {
  const { content } = useLanguage();
  const { contact } = content;

  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6 surface-glow" id="contact">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-8 flex items-center justify-center gap-3 text-ink">
          <span>{contact.title}</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>

        <div className="bg-paper-deep border border-line rounded-xl p-6 sm:p-8 max-w-md mx-auto">
          <p className="text-ink-soft font-mono text-sm mb-6">{contact.subtitle}</p>
          <a
            href="mailto:spjay1@gmail.com"
            className="spring-hover inline-flex min-h-11 items-center justify-center rounded-xl bg-teal px-6 py-3 font-semibold text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
            aria-label="Send email to spjay1@gmail.com"
          >
            spjay1@gmail.com
          </a>
          <p className="mt-5 font-mono text-sm text-ink-soft">Taipei, Taiwan</p>
        </div>

        <p className="mt-8 text-ink-soft flex items-center justify-center gap-2 px-4 italic">
          <CatFace size="text-lg" className="flex-shrink-0" />
          <span className="text-xs sm:text-sm md:text-base">{contact.quote}</span>
          <CatFace size="text-lg" className="flex-shrink-0" />
        </p>
      </div>
    </section>
  );
};

export default Contact;
