import React from 'react';
import { UI } from '../../i18n/ui.js';
import { Ledger } from '../form';

/**
 * Every published post as a numbered attachment row. Rows carry
 * `data-post-card` / `data-topics` for the topic filter script.
 * @param {{ lang: 'zh'|'en', posts: Array<{ code: string, href: string, title: string, summary: string, topics: string[], date: string }> }} props
 */
export default function PostRegister({ lang, posts }) {
  const strings = UI[lang].blog;
  if (posts.length === 0) return <p className="register-empty">{strings.empty}</p>;
  return (
    <Ledger
      caption={strings.caption}
      className="ledger--register"
      columns={[
        { key: 'code', label: strings.colCode, className: 'ledger__no' },
        { key: 'title', label: strings.colTitle },
        { key: 'topics', label: strings.colTopics, className: 'ledger__topics' },
        { key: 'date', label: strings.colDate, className: 'ledger__date' },
      ]}
      rows={posts.map((post) => ({
        attrs: { 'data-post-card': '', 'data-topics': post.topics.join(' ') },
        cells: {
          code: <span data-data>{post.code}</span>,
          title: (
            <>
              <a className="register__title" href={post.href}>{post.title}</a>
              <p className="register__summary">{post.summary}</p>
            </>
          ),
          topics: post.topics.join(' · '),
          date: <time dateTime={post.date}>{post.date}</time>,
        },
      }))}
    />
  );
}
