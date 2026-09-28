import React from 'react';

/**
 * Heading band that opens each part of the form.
 * @param {{ title: string, titleId: string, count?: string, action?: { href: string, label: string } }} props
 */
export function SectionBar({ title, titleId, count, action }) {
  return (
    <header className="section-bar">
      <h2 id={titleId} className="section-bar__title">{title}</h2>
      {count && <p className="section-bar__count" data-data>{count}</p>}
      {action && (
        <a className="section-bar__action" href={action.href}>
          {action.label}
          <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </a>
      )}
    </header>
  );
}
