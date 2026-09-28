# Project guide

This is the shared project guide. Root `AGENTS.md` and `CLAUDE.md` are regular text files pointing here; keep project instructions in this file.

## Architecture

- The portfolio and bilingual blog use Astro static pages with React components. Add client hydration only where browser interaction requires it.
- Locale routes live in `src/pages/zh-tw/` and `src/pages/en/`. Content uses `zh` / `en`; the Chinese URL prefix is `zh-tw`.
- `src/pages/{zh-tw,en}/` hold thin locale routes only; shared page bodies live in `src/views/` and take a `lang` prop (`zh` / `en`). `src/layouts/Layout.astro` owns the HTML shell, SEO head (passed as props), and theme / reading-progress / seal scripts; `ArticleLayout.astro` owns article rendering. Home page parts live in `src/sections/`.
- UI copy lives only in `src/i18n/ui.js`; locale codes and URL prefixes in `src/i18n/locales.js`. Blog queries and RSS go through `src/lib/blog.js` and `src/lib/rss.js`; home-page data derived from the resume (numbered items, key outcomes, seals, skill groups) goes through `src/lib/record.js`.
- `src/components/Header/Header.jsx` is shared by home and blog pages and is the only hydrated island. Preserve the requested navigation order: About → Blog → Projects → Skills → Experience → Contact.
- Hosting uses Cloudflare Workers Static Assets. `src/worker.js` handles HTTP routing around the generated assets; consult `wrangler.json` for deployment configuration.

## Content changes

- Edit resume content in `content/resume.zh.md` and `content/resume.en.md`, then run `bun run generate-resume-content`. The generator owns `src/generated/content.js`, public Markdown resumes, and `public/llms.txt`.
- For blog authoring or validation changes, read `content/blog/_TEMPLATE.md`, `src/content.config.ts`, and `scripts/blog-content-rules.mjs`. The schema and shared validator define the publishing contract.
- Keep drafts out of pages, lists, feeds, related posts, and sitemap output. Match links and recommendations to the current language.
- `ASTRO_MIGRATION_PLAN.md` records the migration rationale and historical requirements; verify implementation details against current code and newer user decisions.

## Visual conventions

- Follow `DESIGN.md`: the delivery-record system (desk, sheet, form ink, filled-in ink, seals). Tokens are in `src/styles/tokens.css` with Tailwind mappings; cinnabar `seal` is only for seals. Reuse the `src/components/form/` kit (Seal, FormHeader, SectionBar, Field, Ledger) instead of new cards or badges. Use utilities for layout and `src/styles/*.css` for complex styling.
- Article pages prioritize quiet reading, clear typography, and restrained framing. Preserve mobile readability and both light and dark themes.
- Keep shared navigation and outer blog container widths consistent across list and article pages.
- Follow existing React component folders and their `index.js` exports; use Astro pages/layouts for document structure.

## Verification and release

- Use Bun; `package.json` and `bun.lock` define commands and dependencies.
- After functional changes, run relevant `bun test` tests and `bun run build`. The build regenerates resume content and validates blog content before compiling Astro pages.
- For UI changes, verify affected pages at mobile and desktop widths. For Worker routing changes, verify HTTP behavior with a local Workers runtime: Astro dev/preview does not execute `src/worker.js`.
- Review `.github/workflows/` when changing release behavior. A merge/push to `main` triggers the production deployment workflow; an uploaded preview version does not switch production traffic.
- Deploy only when the user explicitly authorizes it. Keep local validation separate from `bun run deploy` / `wrangler deploy`.
