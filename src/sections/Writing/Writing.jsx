import React from 'react';
import { UI } from '../../i18n/ui.js';
import { localePath } from '../../i18n/locales.js';
import { SectionBar } from '../../components/form';

/**
 * Latest posts as filed attachments.
 * @param {{ lang: 'zh'|'en', total: number, posts: Array<{ slug: string, code: string, title: string, date: string, summary: string, topics: string[] }> }} props
 */
export default function Writing({ lang, total, posts }) {
  if (posts.length === 0) return null;
  const ui = UI[lang];
  return (
    <section id="writing" className="record-part" aria-labelledby="writing-title">
      <SectionBar
        titleId="writing-title"
        title={ui.writing.title}
        count={ui.writing.count(total)}
        action={{ href: localePath(lang, 'blog'), label: ui.writing.viewAll }}
      />
      <ol className="attachment-list">
        {posts.map((post) => (
          <li key={post.slug} className="attachment">
            <p className="attachment__code" data-data>
              <span className="sr-only">{ui.writing.code} </span>{post.code}
            </p>
            <div className="attachment__body">
              <h3 className="attachment__title">
                <a href={localePath(lang, `blog/${post.slug}`)}>{post.title}</a>
              </h3>
              <p className="attachment__summary">{post.summary}</p>
            </div>
            <p className="attachment__meta">
              <time dateTime={post.date}>{post.date}</time>
              <span className="attachment__topics">{post.topics.join(' · ')}</span>
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
