import React from 'react';
import { CatFace } from '../common';

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-slate-700/50">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p className="font-mono flex items-center gap-2">
          © {Math.max(new Date().getFullYear(), 2026)} Josh Wang <CatFace size="text-base" />
        </p>
        <p className="font-mono">
          <span className="text-emerald-500">▸</span> Built with React
        </p>
      </div>
    </footer>
  );
};

export default Footer;
