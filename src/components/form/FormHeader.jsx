import React from 'react';
import { Seal } from './Seal.jsx';

/**
 * Printed top strip of a form sheet: form title, seal legend, document number.
 * @param {{ title: string, docNoLabel: string, docNo: string, legend?: { label: string, delivered: string, progress: string } }} props
 */
export function FormHeader({ title, docNoLabel, docNo, legend }) {
  return (
    <div className="form-masthead">
      <p className="form-masthead__title">{title}</p>
      {legend && (
        <ul className="form-masthead__legend" aria-label={legend.label}>
          <li><Seal kind="delivered" label={legend.delivered} size="xs" instance="legend" printed />{legend.delivered}</li>
          <li><Seal kind="progress" label={legend.progress} size="xs" instance="legend" printed />{legend.progress}</li>
        </ul>
      )}
      <p className="form-masthead__doc">
        <span>{docNoLabel}</span> <span data-data>{docNo}</span>
      </p>
    </div>
  );
}
