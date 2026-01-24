import React, { useState, useEffect } from 'react';

const TerminalLine = ({ children, delay = 0, prefix = ">" }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-emerald-400 mr-2 font-mono">{prefix}</span>
      {children}
    </div>
  );
};

export default TerminalLine;
