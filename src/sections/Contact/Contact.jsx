import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Contact = () => {
  const { content } = useLanguage();
  const { contact } = content;

  const links = [
    { href: contact.links.email, label: contact.email, primary: true },
    { href: contact.links.github, label: 'GitHub' },
    { href: contact.links.zhResume, label: 'ZH Resume' },
    { href: contact.links.enResume, label: 'EN Resume' },
  ];

  return (
    <section id="contact" className="bg-accent py-[var(--space-section-standard)] text-bg">
      <div className="mx-auto max-w-container px-gutter">
        <h2 className="font-display text-[length:var(--type-hero)] leading-[var(--leading-section)]">
          {contact.title}
        </h2>
        <p className="mt-5 max-w-[68ch] text-[length:var(--type-body)] leading-[var(--leading-body)]">
          {contact.lead}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {links.map(({ href, label, primary }) => (
            <a
              key={href}
              href={href}
              className={`px-4 py-3 text-bg underline-offset-4 hover:underline ${
                primary ? 'text-[length:var(--type-title)]' : 'text-[length:var(--type-body)]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <p className="mt-6 text-[length:var(--type-meta)] leading-[var(--leading-body)]">
          {contact.location}
        </p>
      </div>
    </section>
  );
};

export default Contact;
