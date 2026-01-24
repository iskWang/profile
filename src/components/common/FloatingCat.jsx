import React, { useState, useEffect } from 'react';

const FloatingCat = ({ style, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`absolute transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        ...style,
        animation: 'float 6s ease-in-out infinite',
        animationDelay: `${delay}ms`
      }}
    >
      <span className="text-4xl filter drop-shadow-lg">🐱</span>
    </div>
  );
};

export default FloatingCat;
