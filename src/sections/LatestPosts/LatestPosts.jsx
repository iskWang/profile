import React from 'react';
import { BLOG_STRINGS } from '../../constants/blogStrings';

const LatestPosts = ({ posts, lang }) => {
  if (!posts || posts.length === 0) return null;

  const blogPrefix = lang === 'en' ? '/en/blog' : '/zh-tw/blog';
  const strings = BLOG_STRINGS[lang];

  return (
    <section id="writing" className="scroll-mt-32 sm:scroll-mt-20 pt-24 pb-24 px-6 bg-paper-deep">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-ink">{strings.latestTitle}</h2>
          <a className="text-teal hover:underline" href={blogPrefix}>{strings.viewAll}</a>
        </div>
        <div className="grid gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="border border-line rounded-2xl p-6 bg-paper">
              <h3 className="text-xl font-bold mb-2">
                <a className="hover:text-teal transition-colors" href={`${blogPrefix}/${post.slug}`}>
                  {post.title}
                </a>
              </h3>
              <p className="font-mono text-sm text-ink-soft mb-3">{post.date}</p>
              <p className="text-ink-soft mb-4">{post.summary}</p>
              <div className="flex flex-wrap gap-2">
                {(post.topics || []).map((topic) => (
                  <span key={topic} className="px-2 py-0.5 text-xs rounded-md bg-teal-soft text-teal border border-teal">
                    {topic}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
