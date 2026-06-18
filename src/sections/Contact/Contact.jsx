import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Contact = () => {
  const { content } = useLanguage();
  const { contact } = content;

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="bento-card grid gap-8 bg-black p-5 text-white sm:p-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-300">{contact.subtitle}</p>
            <h2 className="mt-4 text-4xl font-black leading-none tracking-[-0.05em] sm:text-7xl">{contact.title}</h2>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white/66">{contact.quote}</p>
          </div>

          <div className="grid content-center gap-4">
            <div className="rounded-[1.5rem] border border-white/15 bg-lime-300 p-4 text-black sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/55">{contact.resumePrompt}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href="/JoshWang_ZH_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[1.1rem] border border-black bg-black px-5 py-5 text-center text-base font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  {contact.resumeZh}
                </a>
                <a
                  href="/JoshWang_EN_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[1.1rem] border border-black bg-white px-5 py-5 text-center text-base font-black text-black transition hover:-translate-y-1 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  {contact.resumeEn}
                </a>
              </div>
            </div>

            <a
              href="mailto:spjay1@gmail.com"
              className="rounded-[1.5rem] border border-white/15 bg-white p-5 text-xl font-black tracking-[-0.03em] text-black transition hover:-translate-y-1 hover:bg-[#dff8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:text-3xl"
              aria-label="Send email to spjay1@gmail.com"
            >
              spjay1@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
