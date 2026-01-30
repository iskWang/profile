import React from 'react';

const CatFace = ({ className = "", size = "text-2xl" }) => (
  <span className={`${size} ${className}`} style={{ display: 'inline-block' }}>🐱</span>
);

export default CatFace;
