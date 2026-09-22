---
schema: blog-post
lang: en
title: "SSR or control: how I pick a React framework and a TypeScript backend"
date: 2026-09-22
summary: React Router v8 Framework Mode versus Next.js App Router, and why I pick Fastify as my starting TypeScript API, in my own decision notes
topics:
  - react
  - typescript
  - architecture
origin: original
translation: machine-assisted
vault_path: 30_Resources/Software/Web 與語言/React SSR 與 TypeScript 後端框架取捨.md
---

## Why I needed to make this decision

I was picking a stack for a side project. The problem was not which framework was better, but how much scope I wanted the framework to decide by default. Every extra integration — SSR, data mutations, API boundaries, authentication, and deployment — might make delivery faster, but it can also leave me with fewer control points

So I split the question in two: should the React web app let a framework take over server work, and should the TypeScript API use a batteries-included application framework? Comparing those separately helped me see that I was choosing defaults, not looking for one answer for every project

## React Router v8 Framework Mode versus Next.js App Router

React Router v8 Framework Mode and Next.js App Router can both handle SSR, SSG, and data mutations. The difference is how much each framework includes by default

React Router centers on route `loader`s for reads, `action`s for writes, and HTTP request/response objects. The official description of Framework Mode is a complete mode provided through a Vite plugin, with SSR, SPA, static rendering, code splitting, and route type safety. It fits teams that value a clear data flow, portable deployment, and the ability to choose their own cache, API, and server boundaries

Next.js App Router centers on Server Components, Server Actions, route handlers, and the framework's cache/revalidation model. It offers broader built-in integration, which fits teams that want to follow its conventions, ship quickly, and lean into the wider React ecosystem and Vercel integration

## Looking at the difference through a product page

Suppose I am building `/products/:slug`. React Router uses a `loader` on the server to fetch the product and then render the HTML; an admin update goes through an `action`, which writes the data and redirects afterward

Next.js uses a Server Component to fetch the product on the server and render the HTML. Updates commonly use a Server Action, followed by `revalidatePath` according to the cache strategy, or an explicit design for dynamic data behavior

The key point of SSR is that the first response already contains HTML with the product data. It is not whether the app has CRUD

## Routes are configuration, not folder magic

React Router Framework Mode explicitly maps URL patterns to route modules in `app/routes.ts`. Folders are not magic, and they are not a mandatory convention

```ts
route("products", "./routes/products-list.tsx")
route("products/:slug", "./routes/product-detail.tsx")
route("admin/products/:id/edit", "./routes/admin-product-edit.tsx")
```

A route module commonly contains a `loader()` for data needed before SSR, an `action()` for form POSTs or mutations, and a default component for the page UI. I can organize nested folders by domain, or point multiple URLs at the same module, but a production product should usually split list, detail, and edit routes instead of turning one module into a huge switch

Nested URLs can use `<Outlet />` to place child pages, while the parent route keeps shared layout and data boundaries

## How I split things when SSR is not needed

If the web app does not need SEO or SSR, I start with simpler boundaries

```text
web: React + Vite + React Router（Declarative 或 Data Mode）
api: 獨立 API service
worker: queue / cron / sync（需要才建立）
```

At that point React Router is just the front-end router, and the backend API becomes a contract shared by the web app, mobile clients, internal tools, and workers. If a product page really needs SSR, I can move to React Router Framework Mode + Vite while keeping the API separate

## What Fastify actually is

Fastify is a complete HTTP/API framework, not just a library. Routing, hooks/plugins, JSON Schema validation, response serialization, structured logging, and error handling are all part of its core

Fastify deliberately does not impose a whole application stack. The project still chooses its ORM, migrations, OAuth, authorization, and directory structure. That gives me flexibility and a smaller default attack surface, but it also means I need a fixed starter so every project does not repeat the same selection exercise

I would start with this functional-first starter:

```text
Fastify       API / plugins / structured logging
Zod           request validation
Drizzle       TypeScript-to-SQL ORM + migrations
PostgreSQL    database
Better Auth   login/session/OAuth（有需求才加入）
```

Drizzle stays close to SQL, uses TypeScript schemas to work with the database, and manages migrations. It is not centered on class-based Active Record models

Better Auth handles password hashing, sessions/cookies, OAuth callbacks, and account linking. Authentication — who you are — is not the same thing as authorization — what you are allowed to do

Both Zod and TypeBox can validate requests. If I already know Zod, I would keep using it; TypeBox maps more directly to JSON Schema and fits Fastify's schema workflow more closely

## Batteries-included options

AdonisJS is the Node/TS application framework that comes closest to Laravel. It integrates validation, auth, OAuth, Lucid ORM, migrations, and more, at the cost of stronger conventions and a commonly class-based controller/model style

NestJS puts more weight on architecture, decorators, DI, and classes, while ORM, auth, and validation still mostly require separate choices. That does not fit my preference for fewer classes, fewer decorators, and less selection work

Fastify best matches a functional-first, control-first approach, but I would turn the fixed combination into a starter template so flexibility does not mean starting from zero every time

An OAuth provider can never be zero-configuration. I still need to create a client ID with Google, Microsoft, or GitHub, then configure a callback URL and scopes. I have experienced an Auth0 outage, so I am not putting it on the candidate list this time

## My quick decision notes

```text
想快速採用完整 React 懶人包 → Next.js
想 SSR 但維持清楚、可控的 HTTP/route 模型 → React Router v8 Framework Mode + Vite
前後分離的純內部 SPA → React + Vite + React Router + 獨立 Fastify API
不想 classes/decorators，又要 TS API → Fastify functional-first starter
```

## References

- [React Router modes](https://reactrouter.com/start/modes)
- [React Router v8](https://remix.run/blog/react-router-v8)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
