import React from 'react';

const FloatingCat = ({ style, delay = 0, className = '' }) => {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        ...style,
        animation: `float 6s ease-in-out ${delay}ms infinite`,
      }}
    >
      <span className="text-4xl filter drop-shadow-lg">🐱</span>
    </div>
  );
};

export default FloatingCat;
