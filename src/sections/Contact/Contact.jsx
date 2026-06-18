import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Contact = () => {
  const { content } = useLanguage();
  const { contact, hero } = content;

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="bento-card grid gap-8 bg-black p-5 text-white sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-300">{contact.subtitle}</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.05em] sm:text-7xl">{contact.title}</h2>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/66">{contact.quote}</p>
          </div>

          <div className="grid content-end gap-3">
            <a
              href="mailto:spjay1@gmail.com"
              className="rounded-[1.5rem] border border-white/15 bg-white p-5 text-xl font-black tracking-[-0.03em] text-black transition hover:-translate-y-1 hover:bg-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 sm:text-3xl"
              aria-label="Send email to spjay1@gmail.com"
            >
              spjay1@gmail.com
            </a>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="/JoshWang_ZH_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-5 py-4 text-center text-sm font-black uppercase tracking-[0.16em] transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Resume ZH
              </a>
              <a
                href="/JoshWang_EN_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-5 py-4 text-center text-sm font-black uppercase tracking-[0.16em] transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Resume EN
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
