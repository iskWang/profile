# Rebuild joshwang.dev on Astro (site-wide i18n + `/blog`)

Approved by Josh 2026-09-13 — implementation underway. This document supersedes
`BLOG_SUBSITE_PLAN.md` (kept on `feat/blog-subsite`, old worktree `/Users/mini/work/profile`, as spec/content
material only — its generator, SSR entries, and prerender script are **not** carried over). This worktree
(`/Users/mini/work/profile-astro`, branch `feat/blog-astro`) was created fresh from `main`
(`4fc3b1c`, the same commit `feat/blog-subsite` is based on) so it starts with zero blog code.

Added at approval time: the blog **post page** gets a real, deliberate layout/typography pass via the
`impeccable` design skill (mode: Read — a visitor reading one article, not the homepage's Persuade register),
not just the `.post-body` CSS ported wholesale from the old attempt. See Phase 2c below.

## Why this rewrite, not another patch on the hand-rolled SSG

Two prior attempts on `feat/blog-subsite` (uncommitted, left untouched on that branch) built the blog on top of a
hand-rolled `entry-server.jsx` + `prerender.mjs` pipeline: React rendered to strings, spliced into `index.html` via
regex/marker substitution, one `dist/<locale>/...` tree written per language by hand. Round 2 tried to bolt
site-wide `/zh-tw/` + `/en/` URL prefixes onto that pipeline (replacing the original `?lang=` query param) and
shipped it half-done: the bare `/` route still parses `?lang=` in an inline script instead of doing real
Accept-Language detection, and no dedicated blog-post layout/CSS existed — both confirmed by reading the
current uncommitted `index.html` and `prerender.mjs` on that branch. This is exactly the class of bug a
string-templated SSG produces invisibly: it builds fine and ships broken pages.

Decision carried over from the prior session's Opus/Codex architecture review (that review's own transcript has
expired; only its conclusion survived in memory): **use Astro's built-in mechanisms — content collections,
file-based i18n routing, built-in Shiki, `@astrojs/rss`, `@astrojs/sitemap` — instead of hand-rolled equivalents,
while keeping the existing homepage React components and the existing Cloudflare Worker.** Concretely: the
seven React section components (`Hero`, `Projects`, `Skills`, `Experience`, `Contact`, `Header`, `Footer`, plus
`FloatingCat`) are reused as Astro islands, not rewritten; `src/worker.js` and `wrangler.json` (Workers Static
Assets) stay the deployment target — Astro's static `dist/` output drops into the same `assets.directory` binding
with no SSR adapter. What gets deleted outright: `prerender.mjs`, `src/entry-server.jsx`, `src/main.jsx`'s
`resolveRoute` dance, `src/context/LanguageContext.jsx`'s `forcedLang`/query-param logic, `src/routes.js`,
`scripts/blog-content.mjs`'s hand-rolled YAML parser, and the regex-marker system in `index.html`.

## Locked facts (verified this session, not carried from memory)

- **Astro 7.3.2** is current stable (`https://docs.astro.build/en/upgrade-astro/`, npm `astro@latest`).
  `@astrojs/react@6.0.5` (peers React 17/18/19, Node ≥22.12).
- **Content Layer API** (Astro 5+, current in 7): config file is **`src/content.config.ts`** at the project
  root (not `src/content/config.ts`). Shape:
  ```ts
  import { defineCollection } from 'astro:content';
  import { glob } from 'astro/loaders';
  import { z } from 'astro/zod';
  const blog = defineCollection({
    loader: glob({ base: './content/blog', pattern: '**/*.md' }), // keep content/blog/ path — hermes skill writes here
    schema: z.object({ /* frontmatter contract below */ }),
  });
  export const collections = { blog };
  ```
  (`https://docs.astro.build/en/guides/content-collections/`). `base` accepts any path — no need to move content
  into `src/content/`, so the hermes publishing skill's target path (`content/blog/<slug>.<lang>.md`) is unchanged.
- **i18n routing**: `astro.config.mjs` `i18n: { locales, defaultLocale, routing: { prefixDefaultLocale, ... } }`
  (`https://docs.astro.build/en/guides/internationalization/`). Confirmed directly from the docs, not inferred:
  - `prefixDefaultLocale: true` is required to get `/zh-tw/...` for the default locale too (default is `false`,
    which leaves the default locale unprefixed at the root — wrong for this project).
  - Astro's **file-based** locale-folder convention (`src/pages/en/...`, `src/pages/zh-tw/...`) does **not**
    auto-duplicate one page across locales — each locale needs its own file, OR a manual dynamic-route pattern
    (`src/pages/[locale]/...` + `getStaticPaths()` returning both locale values) documented under the same page's
    "manual routing" section. Phase 1 picks and verifies one pattern (recommendation: the dynamic `[locale]`
    pattern, to avoid triplicating index/blog-index/blog-post markup across two folders) — either produces the
    same final URLs, so this is an implementation detail, not an architecture fork.
  - Even with `prefixDefaultLocale: true`, `src/pages/index.astro` (unprefixed root) is still required to exist.
  - **Astro's i18n has no Accept-Language-based redirect for a static build** — `Astro.redirect()` only works
    under an SSR/on-demand adapter, and this project deliberately stays `output: 'static'` (no adapter). So
    `src/pages/index.astro` is just a static no-JS safety-net page; the real Accept-Language redirect is a Worker
    branch (see below) — this is the concrete reason "keep the existing Worker" is a hard requirement, not a
    preference.
- **Shiki dual theme**: `markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } }`
  (`https://docs.astro.build/en/guides/syntax-highlighting/`). Astro's compiled output class is **`.astro-code`**,
  not `.shiki` — confirmed by direct doc fetch this session. CSS variable names are unchanged
  (`--shiki-dark`, `--shiki-dark-bg`, `--shiki-dark-font-style`, `--shiki-dark-font-weight`,
  `--shiki-dark-text-decoration`) *for the light/dark dual-theme case* (the `--astro-code-*` variable prefix only
  applies to the separate single-theme `css-variables` Shiki theme, which this project does not use). Action:
  the existing `src/index.css` dark-mode block (lines ~149–156) already has the right variable names; only the
  two `.shiki` selectors need renaming to `.astro-code` when this CSS is ported over.
- **RSS**: `@astrojs/rss` is a plain helper (not an integration) —
  `import rss from '@astrojs/rss'; export function GET(context) { return rss({ title, description, site: context.site, items }); }`
  in a `src/pages/<locale>/blog/rss.xml.ts` endpoint, fed from `getCollection('blog')`
  (`https://docs.astro.build/en/recipes/rss/`).
- **Sitemap**: `@astrojs/sitemap` integration supports an `i18n` option (per-locale `xhtml:link` alternates), plus
  `filter`, `serialize`, and `customPages` hooks for injecting non-Astro-page URLs (e.g. `/slides`)
  (`https://docs.astro.build/en/guides/integrations-guide/sitemap/`).
- **Deployment**: `output: 'static'` (the default, no adapter installed) produces a plain `dist/` of static
  HTML/CSS/JS with no server runtime requirement — deployable exactly like today under Workers Static Assets via
  `wrangler.json`'s `assets.directory`. `@astrojs/cloudflare` is only needed for on-demand SSR/edge functions,
  which this project does not use (`https://docs.astro.build/en/guides/deploy/cloudflare/`).
- **Tailwind**: `@astrojs/tailwind` is deprecated; current recommendation is the Vite plugin `@tailwindcss/vite`.
  This project is still on Tailwind v3 (`tailwindcss@^3.4.1`, `tailwind.config.js`, `postcss.config.js`) — Phase 1
  decides whether to stay on v3 via Astro's Vite-passthrough (`vite: { plugins: [...] }` / standard PostCSS
  pipeline, which Astro supports without any Tailwind-specific integration) or upgrade to v4. **Recommendation:
  stay on v3** — this is a framework migration, not a Tailwind major-version migration, and the existing
  `tailwind.config.js` token mapping (`bg-paper`, `text-ink`, `text-teal`, ...) must survive unchanged either way.

## URL contract (locked, taken from the current uncommitted code on `feat/blog-subsite`, not from the stale
`BLOG_SUBSITE_PLAN.md`)

`src/worker.js` and `src/App.jsx` on `feat/blog-subsite` already encode the real target scheme (mid-flight,
uncommitted): every page lives under `/zh-tw/` (default locale, Traditional Chinese) or `/en/`. There is no
un-prefixed homepage and no bare `/blog`.

| URL | Content |
| --- | --- |
| `/` | No page — Worker redirects (302) to `/zh-tw/` or `/en/` by `Accept-Language`, falling back to `/zh-tw/` |
| `/zh-tw/` | Homepage, zh |
| `/en/` | Homepage, en |
| `/zh-tw/blog` | Blog index, zh |
| `/en/blog` | Blog index, en |
| `/zh-tw/blog/<slug>` | Post, zh |
| `/en/blog/<slug>` | Post, en |
| `/zh-tw/blog/rss.xml`, `/en/blog/rss.xml` | Per-locale RSS |
| `/sitemap-index.xml` (or `/sitemap.xml`, Phase 1 confirms which `@astrojs/sitemap` emits) | Combined sitemap incl. `/slides` |

Old bookmarks to `/blog*` (pre-locale-prefix scheme) get a server-side 302 to the `/zh-tw/blog*` equivalent —
simpler than today's client-side localStorage-sniffing redirect page, now doable because the Worker can read
`Accept-Language` itself instead of relying on a stored preference.

## Content contract (unchanged in spirit from `BLOG_SUBSITE_PLAN.md`, re-expressed for Zod + real YAML)

File layout, unchanged:
```
content/blog/<slug>.zh.md          # Chinese post (primary)
content/blog/<slug>.en.md          # English post (optional)
content/blog/_TEMPLATE.md          # copy-paste template, excluded from the collection
public/blog/assets/<slug>/*        # committed images for that post
```
`<slug>` matches `^[a-z0-9]+(-[a-z0-9]+)*$`. Reserved, rejected: `en`, `index`, `rss`, `assets`, `template`.
The three real content files already carried into this worktree (`content/blog/hello-blog.zh.md`,
`hello-blog.en.md`, `_TEMPLATE.md`) already conform to this contract — use them as the fixture.

Frontmatter fields (zod schema in `src/content.config.ts`, using `.refine()`/`.superRefine()` for cross-field
rules — a real YAML/zod parser makes several of the old plan's parser-quirk tests moot, see Verification):

| Field | Required | Rule |
| --- | --- | --- |
| `schema` | yes | literal `blog-post` |
| `lang` | yes | `zh` or `en`, MUST equal the filename suffix |
| `title` | yes | non-empty string |
| `date` | yes | `YYYY-MM-DD` (zod `z.coerce.date()` or a regex-checked string — pick one and keep sort stable) |
| `summary` | yes | non-empty, ≤ 200 chars |
| `topics` | yes | ≥ 1 item, each `^[a-z0-9]+(-[a-z0-9]+)*$` |
| `origin` | yes | `original` or `adapted` |
| `source`, `source_title` | iff `origin: adapted` | `source` starts `http://`/`https://` |
| `source_date` | no | `YYYY-MM-DD` |
| `vault_path` | no | no leading `/`, no `\`, no `..` segment, `path.posix.normalize(value) === value`; then MUST start `30_Resources/` and MUST NOT start `00_Inbox/`, `10_Areas/`, `20_Travel/`, `90_Archive/`, `_meta/` |
| `translation` | no | only on `lang: en`, only value `machine-assisted` |
| `draft` | no | `true` hides the post from every output (pages, list, RSS, sitemap, homepage `LatestPosts`) |
| `updated` | no | `YYYY-MM-DD` |

Body rules (still required — zod validates frontmatter shape only; these need either a remark plugin or a
standalone pre-build check script reading the collection's raw body, whichever the implementer finds gives a
cleaner error surface with Astro's Content Layer):

- body must not start with `# ` (title comes from frontmatter)
- no Obsidian embed `![[...]]`
- every `[[wikilink]]` (optionally `[[slug|顯示文字]]`) must resolve to a published, non-draft post of the **same
  language**, matched by slug then by exact title; exempt inside fenced code blocks and inline code
- every `<img>` (or markdown image) `src` must start `/blog/assets/<slug>/`, the file must exist under `public/`,
  and `alt` must be non-empty
- error format: `blog: <relative path>: <reason>` (matches the old plan's convention, keep it — hermes and any
  future skill already expect this shape from step 15 of the old plan)

## Homepage migration

Reuse `src/sections/{Hero,Projects,Skills,Experience,Contact}`, `src/components/{Header,Footer,common/FloatingCat}`
as-is (Astro imports `.jsx` directly via `@astrojs/react`). They render statically at build time with zero
client JS unless given a `client:*` directive. Two things need a directive:
- the theme toggle (`Header`'s `toggle Theme` button) — either a tiny inline `<script>` in the layout (matches
  today's zero-React FOUC-avoidance script already in `index.html`, no island needed) or `client:load` on just
  that button if it stays a React component; prefer the inline-script route since it's what the current
  `prerender.mjs` post-page fallback already does and keeps blog post pages (no React runtime at all) consistent
  with the homepage.
- the scroll-spy nav highlighting effect in `Header` (`useEffect` + `IntersectionObserver`) and the
  smooth-scroll-to-section handler in `App.jsx` — these only make sense on the homepage, need `client:load`
  there, and must not ship on blog pages (mirrors the old plan's `variant` prop split between `Header`'s
  homepage/list/post usages).

`LanguageContext`/`forcedLang`/`?lang=` disappear entirely — replaced by whichever locale the current Astro page
was built for (`Astro.currentLocale` or the `[locale]` route param), passed as a plain prop into
`content.js`-driven components exactly like `lang` is threaded today, just without any client-side detection.

`src/generated/content.js` (from `scripts/resume-content.mjs`) keeps working unchanged as a prebuild step —
resume content is out of scope for this rewrite.

## Cloudflare Worker (kept, simplified)

`src/worker.js` keeps its existing branches (`/deck` redirect, `/slides`, `text/markdown` llms.txt, `Link`
headers on the homepage, non-HTML charset normalization) and gets:
- a `/` branch: read `Accept-Language`, redirect 302 to `/zh-tw/` or `/en/` (default `/zh-tw/` on no/unparseable
  header) — replaces the current inline-script `?lang=`-reading fallback in `index.html`.
- a `/blog*` (old, unprefixed) branch: redirect 302 to the `/zh-tw/blog*` equivalent, same Accept-Language logic
  as `/` — replaces the current localStorage-sniffing client-side redirect page.
- RSS content-type branch, kept as-is but re-pointed at `/zh-tw/blog/rss.xml` and `/en/blog/rss.xml` (already
  there in the current uncommitted `src/worker.js` — verify `@astrojs/rss` output doesn't already set the
  correct content type before keeping this branch; if it does, delete the branch instead of duplicating it).

`wrangler.json` stays pointed at `./dist` (Astro's default static output dir already matches).

## Execution routing

Phase 1 is a hard blocker — nothing else can be verified without it existing. Phases 2a–2d are independent of
each other (disjoint files) and only depend on Phase 1's output (config + one working collection + one working
locale route), so they run as one parallel batch once Phase 1 lands.

| Phase | Scope | Agent | Why |
| --- | --- | --- | --- |
| 1. Scaffold | `package.json`, `astro.config.mjs`, `src/content.config.ts` + zod schema, `scripts/blog-content-rules.mjs` + `scripts/validate-blog-content.mjs`, Tailwind wiring, base `Layout.astro`, i18n routing proof (`/zh-tw/` and `/en/` both resolve to *something*, even a stub) | `high-risk-implementer` | Gets the routing/content-collection mechanics wrong here and every later phase inherits a silently broken foundation — same risk class the old plan flagged for its prerender phase. |
| 2a. Homepage | `src/pages/zh-tw/index.astro` + `src/pages/en/index.astro` wiring the seven existing section components as islands; theme toggle script; Worker `/` + `/blog*` branches | `task` | Islands are straightforward once Phase 1's routing pattern exists; components themselves don't change. |
| 2b. Blog list + feeds | `src/pages/{zh-tw,en}/blog/index.astro` (list + topic filter, follows the homepage's existing visual language directly — no new design needed here), `src/pages/{zh-tw,en}/blog/rss.xml.ts` via `@astrojs/rss`, `@astrojs/sitemap` config (`i18n`, `customPages` for `/slides`) | `task` | Consumes Phase 1's collection; a list page is structurally like the homepage sections, not a new surface. |
| 2c. Blog post page (design) | `src/pages/{zh-tw,en}/blog/[slug].astro` — a genuine layout/typography pass for the article-reading surface, using the `impeccable` skill (mode **Read**), not a copy of the homepage chrome with `.post-body` pasted in. Starts from the existing `.post-body` CSS in `src/index.css` (ported, `.shiki`→`.astro-code`) as evidence of the established token system, not as the finished design. | `task` | This is the surface Josh flagged as under-designed twice now ("你根本沒有製作單文章頁的版型"); it gets a dedicated task and a design pass instead of being folded into 2b's mechanical list-page work. |
| 2d. CI | `.github/workflows/deploy.yml` build steps updated for `astro build` (drop the bun-specific multi-step build; keep `pnpm install --frozen-lockfile` gate); no change to the deploy step itself | `task` | Independent; verification only runs after 2a–2c land, but the file can be written in parallel. |
| 3. Verification | Full build, gate checks, `wrangler dev` smoke test — **no deploy** | Parent (this session) | Per the standing rule for this project: the parent re-derives every claim; a subagent's own report is not proof. |

Hard rule for every phase, carried over from the old plan: **never run `pnpm deploy`, `wrangler deploy`, or any
Cloudflare command.** No GitHub secret exists for this to succeed against anyway, and Josh has not authorized a
deploy.

## Verification (Phase 3, run by the parent, after 2a–2d land)

1. `astro build` (or `pnpm build` once Phase 1 wires the script) exits 0 and produces `dist/zh-tw/index.html`,
   `dist/en/index.html`, `dist/zh-tw/blog/index.html`, `dist/en/blog/index.html`,
   `dist/zh-tw/blog/hello-blog/index.html`, `dist/en/blog/hello-blog/index.html`, `dist/zh-tw/blog/rss.xml`,
   `dist/en/blog/rss.xml`, a sitemap containing both locales and `/slides`.
2. Content gates are live: temporarily set `vault_path: 10_Areas/example-topic/x.md` in
   `content/blog/hello-blog.zh.md`, rebuild, confirm a build failure naming the blacklist violation; repeat with
   `vault_path: 30_Resources/../10_Areas/example-topic/x.md`; revert both.
3. Draft actually unpublishes: add `draft: true` to `hello-blog.zh.md`, rebuild, confirm
   `dist/zh-tw/blog/hello-blog/` is gone while the English page and RSS entry are unaffected accordingly; revert.
4. Post page ships zero JS: `grep -c '<script' dist/zh-tw/blog/hello-blog/index.html` — none from a bundler (a
   theme-toggle inline script is fine, a `type="module"` bundle reference is not); `<html lang="zh-TW"` appears
   before any script tag; the English counterpart has `<html lang="en"`.
5. Shiki dark theme actually applies: the post's fenced ` ```bash ` block renders with class `astro-code` and the
   page's CSS contains a `--shiki-dark` rule keyed off `.astro-code` under `[data-theme="dark"]`, not `.shiki`.
6. `npx wrangler dev` (real `assets.directory` + Worker), then: `/` redirects by `Accept-Language`; `/blog/hello-blog`
   (old URL) redirects to `/zh-tw/blog/hello-blog`; homepage theme toggle and section nav still work; RSS content
   type is `application/rss+xml`.
7. Full diff review against `src/index.css`, `tailwind.config.js`, `public/*` from the old worktree — confirm
   nothing besides the `.shiki`→`.astro-code` rename changed unintentionally.

## Locked implementation decisions (resolved by the parent before Phase 1, to de-risk the blocking phase)

- **Routing pattern: literal locale folders, not a dynamic `[locale]` route.** `src/pages/zh-tw/index.astro` and
  `src/pages/en/index.astro` (and the same pairing for `blog/index.astro`, `blog/[slug].astro`), each a thin
  shell that imports one shared `.astro`/`.jsx` layout and passes its own `lang` literal. This is Astro's
  primary, most-documented i18n path (`Astro.currentLocale`/`getRelativeLocaleUrl` are guaranteed to work against
  it); the dynamic-route alternative is a "manual routing" escape hatch not worth the extra risk in the phase
  everything else depends on. The duplication this costs is a few lines of shell per locale, not duplicated logic.
- **Body-rule validation: a standalone shared module, not a custom Content Layer loader.** Collection loading
  stays the plain, well-documented `glob()` loader + zod schema. A new `scripts/blog-content-rules.mjs` exports
  `buildIndex(posts)` (slug/title → post, per language, non-draft only), `validatePost(post, index)` (H1-start,
  Obsidian embed, wikilink resolution, image src/alt — throws `blog: <path>: <reason>`), and
  `resolveWikilinks(html, index, lang)` (rewrites `[[slug]]`/`[[slug|text]]` into real `<a href>` tags). Two
  callers share it: a `scripts/validate-blog-content.mjs` prebuild script (runs before `astro build`, fails the
  build loudly — this is the direct equivalent of the old plan's 21 gate tests, trimmed per the note below) and
  a `markdown.remarkPlugins` entry in `astro.config.mjs` (does the actual wikilink → `<a>` rewrite during
  compile). Keeping the rules in one shared module avoids re-deriving the slug/title index or the regex checks
  twice. A custom Content Layer loader was considered and rejected here specifically to keep Phase 1's blast
  radius small — it is a foundational phase with no fallback if the loader API is subtly wrong.
- **Gate test set, trimmed from the old plan's 21:** real YAML + zod handles inline-array parsing, quoting, and
  scalar/boolean coercion correctly, so the old tests that existed only to pin the hand-rolled parser's quirks
  (inline-array rejection, colon-in-value handling, etc.) no longer apply — they were regression tests for a bug
  class that no longer exists. Keep every test that pins a *semantic/security* rule: vault_path blacklist +
  escape + whitelist, origin+source pairing, topics kebab-case + non-empty, translation-only-on-en, reserved
  slugs, lang-matches-filename, wikilink resolution + fenced-code exemption, image src/alt rules, H1 rejection,
  Obsidian embed rejection, draft hides from every output, and the `.astro-code` + `--shiki-dark` dark-theme
  smoke test. That is roughly 14–16 tests, run via `bun:test` against `scripts/blog-content-rules.mjs` directly
  (same philosophy as today's `scripts/resume-content.test.mjs`, just against the new module).


## Explicit non-goals

- No redesign of homepage visuals, copy, or section order — components move as-is.
- No change to the resume-content pipeline (`scripts/resume-content.mjs`, `content/resume.*.md`).
- No CMS, no database, no runtime content fetching — git remains the only source of truth.
- No deploy, at any phase, under any circumstance, without Josh explicitly saying so in a later session.
