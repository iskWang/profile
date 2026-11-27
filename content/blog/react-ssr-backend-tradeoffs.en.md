---
schema: blog-post
lang: en
title: "SSR or control: how I pick a React framework and a TypeScript backend"
date: 2026-09-22
updated: 2026-11-27
summary: Don't blindly default to Next.js or SSR on a new project. Decide whether you actually need SEO first, or you end up carrying framework complexity and security upgrade debt for nothing.
topics:
  - react
  - typescript
  - architecture
origin: original
translation: machine-assisted
vault_path: 30_Resources/Software/Web 與語言/React SSR 與 TypeScript 後端框架取捨.md
---

A lot of React projects today start with `create-next-app` before anyone even finishes warming up, as if skipping Next.js and SSR means your stack is out of fashion.

I have shipped plenty of Next.js sites in production for marketing websites and hospitality builders. Its SEO story is solid and delivery is fast, so I am not against it at all. After spending years untangling architectural debt for different teams, though, I care much more about one thing: picking a framework is less about how many features come in the box and more about **whose long-term maintenance debt you are signing up to carry**.

That hit home in 2025 when I had to urgently patch Next.js CVE-2025-29927 for a client.

If a system does not even need SEO, pulling in an entire SSR server layer, framework caching rules, and upgrade pressure just because "everyone uses it" means you are the one waking up to put out the fire when a critical vulnerability drops.

So instead of writing a framework manual, here are the quick decision notes I actually use when starting a new project.

## Short version: my decision cheat sheet

```text
Content-heavy, low update frequency  → Start with SSG (don't run a server if you don't need one)
Dynamic SEO + full React ecosystem   → Next.js
SSR with clear routing/HTTP control  → React Router Framework Mode + Vite
Internal admin / no SEO needed       → Evaluate React + Vite SPA + standalone API first
TypeScript API without class bloat   → Fastify minimal starter
```

Everything below is just the reasoning behind those five lines.

## First question: do you actually need SEO or SSR?

People often treat "using React" and "using Next.js" as the same decision, when they are completely different questions.

If you are building a public marketing site, product pages, or content hubs where search engines need full HTML on the first response, SSG or SSR is worth the investment. Returning populated HTML upfront helps both crawlers and first-paint performance.

If you are building an authenticated back-office, analytics dashboard, or internal operations tool, Google is never crawling those screens. You might still consider SSR in rare cases for initial load speed or low-powered devices, but most of the time starting with a plain SPA keeps maintenance dramatically simpler.

Forcing SSR onto an internal tool that does not need it gives you zero SEO upside while adding server-side cache surprises, deployment coupling, and extra security surface area.

When a project does not need SEO, I usually draw the boundary like this:

```text
web    : React + Vite + React Router (plain SPA)
api    : Standalone backend API service
worker : Cron or background queue (only when needed)
```

Keeping the frontend and backend separate pays off quickly. The API becomes a clean contract shared by web, mobile apps, and background workers, while the frontend goes back to being static assets with no server-side framework coupling.

## When you do need SSR: Next.js vs. React Router

Once SSR is genuinely justified, the next question is how much I want the framework to decide for me.

Next.js App Router gives you a tightly integrated all-in-one package: Server Components, Server Actions, and built-in caching conventions. If a team already knows those conventions and deploys on Vercel, shipping speed is hard to beat.

The tradeoff is the black-box feel. When caching behaves unexpectedly or you want to deploy outside a specific platform, debugging and workarounds get expensive fast.

React Router Framework Mode (with Vite) takes a different route. Instead of folder magic guessing your intent, routes live in an explicit config file, reads go through `loader`, writes go through `action`, and the mental model stays close to plain HTTP requests and responses.

Both can handle SSR well. The real choice is whether you want high-integration defaults or transparent control over routing, caching, and deployment boundaries.

## Why I lean toward Fastify for TypeScript APIs

Once the API is a standalone service, the next question is whether to reach for a full application framework like NestJS or AdonisJS.

My preference is simple: I do not enjoy writing layers of classes, decorators, and ceremony just to ship a handful of API endpoints. NestJS brings heavy structural boilerplate, yet you still end up wiring your own ORM and auth choices anyway, taking on complexity without avoiding stack decisions.

Fastify sits right in my sweet spot. Routing, plugins, structured logging, and performance are already solid out of the box, without forcing a rigid programming style on the rest of the codebase.

The downside is obvious too: high freedom means re-picking database and auth tools on every new project gets tiring. My fix is keeping one small, repeatable starter template (Fastify with Zod validation, Drizzle for SQL and migrations, and Better Auth when login is needed) so flexibility turns into a consistent default.

One side note on authentication: I now try to avoid locking core login into a single external vendor. I have been burned by an Auth0 outage that left the system stuck waiting, so whenever practical, I prefer keeping critical dependencies within boundaries I can control.

## A quick reminder to myself

There is no universally right framework. The real trouble starts when you copy the trendiest stack without checking your constraints first.

Before starting the next project, I just list three constraints: does this site need SEO, am I willing to pay for the framework's magic and upgrade debt, and can I afford to drop everything if a critical security patch lands tomorrow?

Write down those constraints before picking tools, and half the hesitation disappears on its own.

## References

- [Next.js CVE-2025-29927 Postmortem](https://nextjs.org/blog/cve-2025-29927)
- [React Router modes](https://reactrouter.com/start/modes)
- [React Router v8](https://remix.run/blog/react-router-v8)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
