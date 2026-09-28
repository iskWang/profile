import React from 'react';

/**
 * One box of the form: printed label plus the filled-in value.
 * `side` prints the label vertically down the left edge (used for the name box).
 * @param {{ label: string, side?: boolean, className?: string, children: React.ReactNode }} props
 */
export function Field({ label, side = false, className = '', children }) {
  return (
    <div className={`field${side ? ' field--side' : ''} ${className}`.trim()}>
      <span className="field__label">{label}</span>
      <div className="field__value">{children}</div>
    </div>
  );
}
