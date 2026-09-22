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

我在挑一個 Side Project 的技術堆疊，卡住的不是哪個框架比較好，而是我想讓框架預設替我決定多少事情。SSR、資料 mutation、API 邊界、身分驗證和部署，每多一層整合，交付速度可能更快，能控制的地方也可能更少

所以我把問題拆成兩個方向：React 網站要不要交給框架處理伺服器工作，以及 TypeScript API 要不要採用開箱即用的應用程式框架。這樣比較後，我才知道自己是在選預設值，不是在替所有專案找唯一答案

## React Router v8 Framework Mode 對上 Next.js App Router

React Router v8 Framework Mode 和 Next.js App Router 都能做 SSR、SSG，也都能處理資料變更，差別在框架預設負責的範圍

React Router 以路由的 `loader`（讀取）、`action`（寫入）和 HTTP 請求與回應為中心。官方把 Framework Mode 定義成由 Vite 外掛提供 SSR、SPA、靜態算繪、程式碼分割與路由型別安全的完整模式，適合重視清楚資料流、部署可攜性，以及想自行決定快取、API、伺服器邊界的團隊

Next.js App Router 則以 Server Components、Server Actions、路由處理程式，以及框架的快取與重新驗證機制為中心。它的功能與整合較完整，適合希望沿用既有慣例、快速交付，並重視廣大 React 生態與 Vercel 整合的團隊

## 拿商品頁來看差別

假設我要做 `/products/:slug`。React Router 會在伺服器上用 `loader` 取得商品，再產生 HTML；後台更新則交給 `action` 寫入，完成後重新導向

Next.js 會用 Server Component 在伺服器上取得商品並產生 HTML，更新通常使用 Server Action，並依快取策略呼叫 `revalidatePath`，或明確設計動態資料的行為

這裡的 SSR 重點，是第一次回應就已經帶著商品資料的 HTML，不是有沒有 CRUD

## 路由是設定，不是資料夾魔法

React Router Framework Mode 會在 `app/routes.ts` 明確把 URL pattern 對到路由模組，資料夾不是魔法，也不是強制慣例

```ts
route("products", "./routes/products-list.tsx")
route("products/:slug", "./routes/product-detail.tsx")
route("admin/products/:id/edit", "./routes/admin-product-edit.tsx")
```

一個路由模組通常會包含 `loader()`（SSR 前的讀取資料）、`action()`（處理表單 POST 或資料變更），以及預設元件（頁面 UI）。我可以依領域建立巢狀資料夾，也可以讓多個 URL 指向同一個模組，但正式產品通常應拆成列表、詳情、編輯等路由，避免所有事情塞進單一超大 switch 模組

URL 的巢狀路由可以用 `<Outlet />` 放置子頁面，讓父路由保留共用版面與資料邊界

## 不需要 SSR 的時候我會怎麼切

如果網站不需要 SEO 或 SSR，我會先把邊界切得簡單一點

```text
web: React + Vite + React Router（Declarative 或 Data Mode）
api: 獨立 API service
worker: queue / cron / sync（需要才建立）
```

這時 React Router 只是前端路由器，後端 API 則是網站、行動裝置、內部工具與 worker 共用的契約。若商品頁真的需要 SSR，再升級到 React Router Framework Mode + Vite，同時保留獨立 API

## Fastify 到底算什麼

Fastify 是完整的 HTTP/API 框架，不只是函式庫。它的核心包括路由、掛勾與外掛機制、JSON Schema 驗證、回應序列化、結構化日誌和錯誤處理

但 Fastify 刻意不強加整套應用程式技術堆疊，ORM、資料庫遷移、OAuth、授權和目錄架構仍由專案自行選擇。這帶來彈性與較小的預設攻擊面，代價是我需要固定一份起始範本，避免每個專案都重新做一次選型

我會從這個以函式為主（functional-first）的起始範本開始：

```text
Fastify       API / plugins / structured logging
Zod           request validation
Drizzle       TypeScript-to-SQL ORM + migrations
PostgreSQL    database
Better Auth   login/session/OAuth（有需求才加入）
```

Drizzle 貼近 SQL，以 TypeScript schema 操作資料庫，也負責管理資料庫遷移，不像 Active Record model 那樣以 class 為中心

Better Auth 處理密碼雜湊、工作階段與 cookie、OAuth 回呼，以及帳號綁定，但身分驗證（authentication，你是誰）不等於授權（authorization，你能做什麼）

Zod 和 TypeBox 都能驗證請求。已經熟悉 Zod 時，我會先沿用它；TypeBox 更直接對應 JSON Schema，也更貼近 Fastify 的 schema 工作流程

## Batteries-included 的選項

AdonisJS 是 Node/TS 裡較接近 Laravel 的應用程式框架，整合資料驗證、身分驗證、OAuth、Lucid ORM、資料庫遷移等功能，代價是較強的慣例，以及常見的以 class 為主的 controller/model 風格

NestJS 的架構、裝飾器、DI 與 class 比重都高，而且 ORM、身分驗證、資料驗證多半仍要自己選，這不符合我想減少 class、裝飾器與選型工作的偏好

Fastify 最符合以函式為主、控制權優先的風格，但我會把固定組合整理成起始範本，讓彈性不會變成每次都從零開始

OAuth 供應商不可能零設定，我還是要到 Google、Microsoft 或 GitHub 建立 client ID、設定 callback URL 與 scope。我遇過 Auth0 的服務中斷，所以這次不把它列入候選

## 我的判斷速記

```text
想快速採用完整 React 懶人包 → Next.js
想 SSR 但維持清楚、可控的 HTTP/路由模型 → React Router v8 Framework Mode + Vite
前後分離的純內部 SPA → React + Vite + React Router + 獨立 Fastify API
不想 classes/decorators，又要 TS API → Fastify functional-first starter
```

## 參考資料

- [React Router modes](https://reactrouter.com/start/modes)
- [React Router v8](https://remix.run/blog/react-router-v8)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
