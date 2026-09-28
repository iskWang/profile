# Josh Wang's Profile

Bilingual (繁體中文 / English) portfolio and blog built with Astro, React components, and Tailwind CSS, deployed on Cloudflare Workers Static Assets. The site is designed as a delivery record (驗收單): each claim is a ruled row with its outcome and a dated seal. Visual rules live in [DESIGN.md](./DESIGN.md).

## Project Structure

```text
/
├── .agent/docs/          # Project guide for agents (AGENTS.md)
├── content/              # Resume Markdown (zh/en) and blog posts
├── scripts/              # Resume generator and blog content validation
├── src/
│   ├── pages/            # Thin locale routes (zh-tw/, en/) that render a view
│   ├── views/            # Shared page bodies: HomePage, BlogIndexPage
│   ├── layouts/          # Layout (HTML shell, SEO head, scripts), ArticleLayout
│   ├── sections/         # Home page parts: About, Writing, Projects, Skills, Experience, Contact
│   ├── components/       # Header, Footer, PostRegister, form/ (Seal, Ledger, Field, …)
│   ├── i18n/             # Locales and every UI string
│   ├── lib/              # Blog queries, RSS, delivery-record data from the resume
│   ├── styles/           # tokens, fonts, base, form, motion, article
│   ├── generated/        # Resume data generated from content/ (do not edit)
│   └── index.css         # Stylesheet import manifest
├── public/               # Static assets, resume PDFs, slides
└── package.json          # Scripts & dependencies
```

## Development

```bash
bun install
bun run dev     # regenerate resume content, then Astro dev server
bun run build   # regenerate, validate blog content, build static site
bun test
```

Project conventions and release rules: **[.agent/docs/AGENTS.md](./.agent/docs/AGENTS.md)**.
