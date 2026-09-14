# AGENTS.md (AI Project Guide)

> [!NOTE]
> This file is the **Primary Source of Truth**. Root-level agent guide files point here so all assistants read the same instructions.

## Project Overview
A React-based personal profile portfolio.
- **Tech Stack:** React (Vite), Tailwind CSS, Vanilla CSS.
- **Hosting:** Cloudflare Pages (via Wrangler).

## Development Commands
- `bun run dev`: Start Astro development server.
- `bun run build`: Build the production output.
- `bun run deploy`: Deploy to Cloudflare Workers.

## Code Style & Conventions
- **Component Structure:**
  - Each major component or section folder has an `index.js` for clean exports.
  - Separate `.jsx` for logic/markup.
- **Styling:**
  - High-impact visual design (glassmorphism, animations, gradients).
  - Use Tailwind CSS for utilities; `index.css` for complex global styles.
- **Responsive Design:**
  - Mobile-first approach.
  - Specific attention to font sizes and padding on mobile.

## Key Entry Points
- `src/App.jsx`: Main layout, scroll logic, and central data.
- `src/main.jsx`: React entry point.
- `src/index.css`: Global theme & animations.
