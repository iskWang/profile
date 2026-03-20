import React from 'react';

const TerminalLine = ({ children, delay = 0, prefix = ">" }) => {
  return (
    <div
      className="terminal-line"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-emerald-400 mr-2 font-mono">{prefix}</span>
      {children}
    </div>
  );
};

export default TerminalLine;
