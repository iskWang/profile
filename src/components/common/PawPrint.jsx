import React from 'react';

const PawPrint = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
    <ellipse cx="12" cy="17" rx="4" ry="3.5"/>
    <circle cx="6" cy="10" r="2.5"/>
    <circle cx="18" cy="10" r="2.5"/>
    <circle cx="8.5" cy="5" r="2"/>
    <circle cx="15.5" cy="5" r="2"/>
  </svg>
);

export default PawPrint;
