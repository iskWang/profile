import React from 'react';
import catMascotUrl from '../../assets/cat-mascot.webp';

const FloatingCat = ({ style, delay = 0, className = '' }) => {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        ...style,
        animation: `float 6s ease-in-out ${delay}ms infinite`,
      }}
      aria-hidden="true"
    >
      <span
        className="inline-block w-16 h-16 bg-teal"
        style={{
          WebkitMaskImage: `url(${catMascotUrl})`,
          maskImage: `url(${catMascotUrl})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.08))',
        }}
        role="img"
        aria-label="Josh 的貓"
      />
    </div>
  );
};

export default FloatingCat;
