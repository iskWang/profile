---
schema: blog-post
lang: zh
title: 要 SSR 還是要控制權：我怎麼選 React 框架跟 TypeScript 後端
date: 2026-09-22
summary: React Router v8 Framework Mode 對上 Next.js App Router，以及我為什麼選 Fastify 當 TypeScript API 的起手式，這是我自己用的判斷速記
topics:
  - react
  - typescript
  - architecture
origin: original
vault_path: 30_Resources/Software/Web 與語言/React SSR 與 TypeScript 後端框架取捨.md
---

## 為什麼我要做這個決定

我在挑一個 side project 的 stack，卡住的不是哪個框架比較好，而是我想要框架預設替我決定多少範圍。SSR、資料 mutation、API 邊界、authentication 和 deployment，每多一層整合，交付速度可能更快，控制點也可能更少

所以我把問題拆成兩個方向：React web 要不要由 framework 接手 server 工作，以及 TypeScript API 要不要採用 batteries-included 的 application framework。這樣比較後，我才知道自己是在選預設值，不是在替所有專案找唯一答案

## React Router v8 Framework Mode 對上 Next.js App Router

React Router v8 Framework Mode 和 Next.js App Router 都能做 SSR、SSG，也都能處理資料 mutation，差別在框架預設的範圍

React Router 以 route 的 `loader`（讀取）、`action`（寫入）和 HTTP request/response 為中心。官方把 Framework Mode 定義成由 Vite plugin 提供 SSR、SPA、static rendering、code splitting 與 route type safety 的完整模式，適合重視清楚資料流、部署可攜性，以及想自行決定 cache、API、server 邊界的團隊

Next.js App Router 則以 Server Components、Server Actions、route handlers，以及 framework 的 cache/revalidation 為中心。它的功能與整合較完整，適合希望沿用既有慣例、快速交付，並重視廣大 React 生態與 Vercel 整合的團隊

## 拿商品頁來看差別

假設我要做 `/products/:slug`。React Router 會在 server 用 `loader` 取得商品，再 render 出 HTML；後台更新則交給 `action` 寫入，完成後 redirect

Next.js 會用 Server Component 在 server 取得商品並 render HTML，更新通常使用 Server Action，並依 cache 策略呼叫 `revalidatePath`，或明確設計動態資料的行為

這裡的 SSR 重點，是第一次 response 就已經帶著商品資料的 HTML，不是有沒有 CRUD

## 路由是設定，不是資料夾魔法

React Router Framework Mode 會在 `app/routes.ts` 明確把 URL pattern 對到 route module，資料夾不是魔法，也不是強制慣例

```ts
route("products", "./routes/products-list.tsx")
route("products/:slug", "./routes/product-detail.tsx")
route("admin/products/:id/edit", "./routes/admin-product-edit.tsx")
```

一個 route module 通常會包含 `loader()`（SSR 前的讀取資料）、`action()`（處理 form POST 或 mutation），以及 default component（頁面 UI）。我可以依 domain 建立巢狀資料夾，也可以讓多個 URL 指向同一個 module，但正式產品通常應拆成列表、詳情、編輯等 route，避免所有事情塞進單一超大 switch module

URL 的巢狀 route 可以用 `<Outlet />` 放置子頁面，讓父 route 保留共用 layout 與資料邊界

## 不需要 SSR 的時候我會怎麼切

如果 web 不需要 SEO 或 SSR，我會先把邊界切得簡單一點

```text
web: React + Vite + React Router（Declarative 或 Data Mode）
api: 獨立 API service
worker: queue / cron / sync（需要才建立）
```

這時 React Router 只是前端 router，後端 API 則是 web、mobile、內部工具與 worker 共用的契約。若商品頁真的需要 SSR，再升級到 React Router Framework Mode + Vite，同時保留獨立 API

## Fastify 到底算什麼

Fastify 是完整的 HTTP/API framework，不只是 library。routing、hooks/plugins、JSON Schema validation、response serialization、structured logging 與 error handling 都是它的核心

但 Fastify 刻意不強加整套 application stack，ORM、migration、OAuth、authorization 和目錄架構仍由專案自行選擇。這帶來彈性與較小的預設 attack surface，代價是我需要固定一份 starter，避免每個專案都重新做一次選型

我會從這個 functional-first starter 開始：

```text
Fastify       API / plugins / structured logging
Zod           request validation
Drizzle       TypeScript-to-SQL ORM + migrations
PostgreSQL    database
Better Auth   login/session/OAuth（有需求才加入）
```

Drizzle 貼近 SQL，以 TypeScript schema 操作資料庫，也負責管理 migration，不像 Active Record model 那樣以 class 為中心

Better Auth 處理 password hashing、session/cookie、OAuth callback 與帳號綁定，但 authentication（你是誰）不等於 authorization（你能做什麼）

Zod 和 TypeBox 都能驗證 request。已經熟悉 Zod 時，我會先沿用它；TypeBox 更直接對應 JSON Schema，也更貼近 Fastify 的 schema 工作流

## Batteries-included 的選項

AdonisJS 是 Node/TS 裡較接近 Laravel 的 application framework，整合 validation、auth、OAuth、Lucid ORM、migration 等功能，代價是較強的慣例，以及常見的 class-based controller/model 風格

NestJS 的架構、decorator、DI 與 class 比重都高，而且 ORM、auth、validation 多半仍要自己選，這不符合我想減少 class、decorator 與選型工作的偏好

Fastify 最符合 functional-first 與控制權優先，但我會把固定組合整理成 starter template，讓彈性不會變成每次都從零開始

OAuth provider 不可能零設定，我還是要到 Google、Microsoft 或 GitHub 建立 client ID、設定 callback URL 與 scope。我遇過 Auth0 的 outage，所以這次不把它列入候選

## 我的判斷速記

```text
想快速採用完整 React 懶人包 → Next.js
想 SSR 但維持清楚、可控的 HTTP/route 模型 → React Router v8 Framework Mode + Vite
前後分離的純內部 SPA → React + Vite + React Router + 獨立 Fastify API
不想 classes/decorators，又要 TS API → Fastify functional-first starter
```

## 參考資料

- [React Router modes](https://reactrouter.com/start/modes)
- [React Router v8](https://remix.run/blog/react-router-v8)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
