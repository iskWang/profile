import React from 'react';

const CatMark = ({ size = 24, className, ariaLabel = 'Cat mark' }) => (
  <span
    className={className}
    role="img"
    aria-label={ariaLabel}
    style={{ fontSize: size, lineHeight: 1 }}
  >
    🐱
  </span>
);

export default CatMark;
