import React from 'react';

const CatFace = ({ className = "", size = "text-2xl" }) => (
  <span className={`${size} ${className}`} style={{ display: 'inline-block' }} aria-hidden="true">🐱</span>
);

export default CatFace;
