# Josh Wang's Profile

Personal profile website built with React, Vite, and Tailwind CSS. Featuring a "Vibe Coding" aesthetic with animated elements and cat-themed interactions.

## Project Structure

```text
/
├── .agent/docs/      # AI Context & Detailed Guides
├── src/
│   ├── components/   # Reusable UI components
│   ├── sections/     # Main page sections
│   ├── App.jsx       # Main shell & scroll logic
│   └── index.css     # Global styles
├── public/           # Static assets
└── package.json      # Scripts & dependencies
```

## Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev
```

`bun run build` also generates opaque 1200×630 share cards under `dist/og/` for both homepages, blog indexes, published articles, and `/slides`. Article titles come from their frontmatter; changing a title changes its image URL. The renderer uses the bundled Noto Sans TC font and crops the original mascot rather than publishing the whole transparent image.

Image dimensions and metadata follow [Meta’s sharing guide](https://developers.facebook.com/documentation/sharing/webmasters/images), [LinkedIn’s sharing requirements](https://www.linkedin.com/help/linkedin/answer/a521928), and the [Open Graph protocol](https://ogp.me/#structured).

Detailed technical breakdown and coding standards are available in the **Source of Truth**:
- **[.agent/docs/CLAUDE.md](./.agent/docs/CLAUDE.md)**
