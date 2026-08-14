import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Contact = () => {
  const { content, lang } = useLanguage();
  const { contact } = content;

  const links = [
    { href: contact.links.email, label: contact.email, primary: true },
    { href: contact.links.github, label: 'GitHub' },
    { href: contact.links.zhResume, label: lang === 'zh' ? '中文履歷' : 'ZH Resume' },
    { href: contact.links.enResume, label: lang === 'zh' ? '英文履歷' : 'EN Resume' },
  ];

  return (
    <section id="contact" className="section-stable section-contact bg-contact py-[var(--space-section-standard)] text-contact-ink">
      <div className="mx-auto max-w-container px-gutter">
        <h2 className="font-display text-[length:var(--type-section)] leading-[var(--leading-section)] [text-wrap:balance]">
          {contact.title}
        </h2>
        <p className="mt-5 max-w-[68ch] text-[length:var(--type-lead)] leading-[var(--leading-lead)] text-contact-muted">
          {contact.lead}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {links.map(({ href, label, primary }) => (
            <a
              key={href}
              href={href}
              className={`px-4 py-3 underline-offset-4 transition-colors hover:text-contact-gold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-contact-gold ${
                primary ? 'text-[length:var(--type-title)] text-contact-gold' : 'text-[length:var(--type-body)] text-contact-ink'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <p className="mt-6 text-[length:var(--type-meta)] leading-[var(--leading-body)] text-contact-muted">
          {contact.location}
        </p>
      </div>
    </section>
  );
};

export default Contact;
