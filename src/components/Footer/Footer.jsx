import React from 'react';
import { useLanguage } from '../../context/useLanguage';

const Footer = () => {
  const { content } = useLanguage();

  return (
    <footer className="border-t border-line px-gutter py-6">
      <div className="mx-auto flex max-w-container flex-row items-center justify-between gap-4 text-[length:var(--type-meta)] leading-[var(--leading-body)] text-ink-muted">
        <p>© {new Date().getFullYear()} Josh Wang</p>
        <p className="text-right">{content.footer.builtWith}</p>
      </div>
    </footer>
  );
};

export default Footer;
