import React from 'react';
import { UI } from '../../i18n/ui.js';
import { localePath } from '../../i18n/locales.js';

/** Bottom line of the form: document number, owner, feed. */
export default function Footer({ lang }) {
  const ui = UI[lang];
  return (
    <footer className="colophon">
      <p>
        <span data-data>{ui.form.docNo}</span>
        <span aria-hidden="true"> · </span>
        Josh Wang
      </p>
      <a href={localePath(lang, 'blog/rss.xml')}>RSS</a>
    </footer>
  );
}
