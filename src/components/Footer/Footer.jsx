import React from 'react';
const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-black/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm font-bold text-black/55 sm:flex-row">
        <p>
          © {Math.max(new Date().getFullYear(), 2026)} Josh Wang
        </p>
        <p>
          Built with React / Vite
        </p>
      </div>
    </footer>
  );
};

export default Footer;
