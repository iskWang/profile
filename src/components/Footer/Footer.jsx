import React from 'react';
import { CatFace } from '../common';

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-line">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-ink-soft">
        <p className="font-mono flex items-center gap-2">
          © {Math.max(new Date().getFullYear(), 2026)} Josh Wang <CatFace size="text-base" />
        </p>
        <p className="font-mono">
          <span className="text-teal">▸</span> Built with React
        </p>
      </div>
    </footer>
  );
};

export default Footer;
