---
schema: blog-post
lang: zh
title: 標題
date: 2026-01-01
summary: 一句話摘要。
topics:
  - writing
origin: original
---

正文從這裡開始。

<!--
Authoring contract
- Copy to <kebab-slug>.zh.md or <kebab-slug>.en.md; keep lang consistent.
- The frontmatter owns h1. Start sections with ## and keep heading levels ordered.
- Three or more ## sections automatically get a collapsed contents list titled "這篇聊什麼" / "In this article"; shorter articles have no TOC.
- When origin is adapted, add source and source_title.
- translation: machine-assisted belongs only in a .en.md file; it does not claim author review.
- Images must use local root-relative paths under public/blog/assets/<kebab-slug>/, with meaningful alt text and true width/height attributes.
- Use a figure with class="post-figure" and figcaption for an image with caption/source.
  Add post-figure--portrait for a restrained portrait. post-mascot is only for the monochrome cat artwork.
- For named code blocks, put <p class="code-caption">path/to/file.ts</p> immediately before the fenced block, followed by a blank line. The language on the fence is still required.
  ArticleLayout adds a copy button as progressive enhancement; without JavaScript, the caption and readable fenced code remain.
- Tables scroll locally. Headings, links, nested/task lists, blockquotes, inline code and h2-h6
  inherit the article design without per-post CSS.
- Optional notes use <aside class="post-callout"> with a strong label and paragraph;
  add post-callout--warning for a caution (always label its meaning in text).
- Optional supplementary material uses native <details class="post-specimen"><summary>...</summary>
  and <div class="post-specimen-content">. Leave blank lines around raw HTML and Markdown; it must remain usable when JavaScript is unavailable.
- Footnotes and references need unique IDs, a source link where applicable, and a backlink from every entry to its matching reference; see hello-blog for working examples.
- Every article uses src/layouts/ArticleLayout.astro and the post-* rules in src/index.css.
  Keep the shared Header, locale URLs and theme tokens; articles are a quiet reading surface.
- Before publishing, inspect mobile + desktop in light + dark, expand any details, and check
  long code/table scrolling. Run bun run build; it validates frontmatter, links and image paths.
- hello-blog.zh.md / hello-blog.en.md are the full bilingual specimen. Their final To agent block contains only the exact
  https://joshwang.dev/llms.txt snapshot in a fenced block; this is an exemplar, not required in every post.
-->
