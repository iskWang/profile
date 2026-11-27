---
schema: blog-post
lang: zh
title: 要 SSR 還是要控制權：我怎麼選 React 框架跟 TypeScript 後端
date: 2026-09-22
updated: 2026-11-27
summary: 開新專案不要無腦上 Next.js 或 SSR，先想清楚自己到底需不需要 SEO，否則只是白白多扛一層框架複雜度跟資安升級債
topics:
  - react
  - typescript
  - architecture
origin: original
vault_path: 30_Resources/Software/Web 與語言/React SSR 與 TypeScript 後端框架取捨.md
---

現在很多 React 專案一開工，手都還沒熱就先打一行 `create-next-app`，好像不用 Next.js 跟 SSR 就不夠潮一樣

我以前在官網跟旅宿系統確實用過不少 Next.js，SEO 效果好、交付也快，我完全不反對它，但這幾年幫不同團隊收拾架構債之後，我越來越在意一件事：選框架不只是看功能多不多，更重要的是**你要替誰扛長期維運債**

尤其是 2025 年緊急幫客戶修補 Next.js 的 CVE-2025-29927 資安漏洞時，那種感覺特別強烈

如果一個系統根本不需要 SEO，卻只因為「大家都在用」而扛進一整套 SSR 伺服器層、快取規則跟框架升級壓力，等到哪天重大漏洞爆出來，半夜起來救火的人還是你自己

所以這篇不打算寫成框架說明書，只想記錄我自己開新專案時的判斷速記

## 先講結論：我現在的判斷速記

```text
內容為主、更新頻率低           → 先看靜態產生（SSG），能不養伺服器就不養
要動態 SEO、想吃完整生態        → Next.js
要 SSR，但想握住路由跟 HTTP 邊界 → React Router Framework Mode + Vite
不需要 SEO 的後台或工具          → 先評估 React + Vite SPA 配獨立 API，再看首屏需求
想寫 TS 後端，但不想滿街 class   → Fastify 精簡範本
```

後面每一段，其實都只是這幾行的延伸

## 第一個問題永遠是：SEO 跟 SSR 真的必要嗎

很多人把「要用 React」跟「要上 Next.js」綁在一起，但這根本是兩件事

如果你做的是公開官網、商品頁或內容站，需要搜尋引擎一來就抓到完整 HTML，那靜態產生（SSG）或 SSR 確實值得投資，像商品頁第一次回應就直接帶資料回來，對搜尋引擎爬取跟首屏呈現都有幫助

但如果做的是登入後才看得到的後台、數據儀表板、內部作業系統，Google 根本不會來爬你的頁面，這類系統雖然偶爾還是會為了首屏速度或低效能裝置考慮 SSR，但多數時候先從純 SPA 評估起，維護成本低非常多

如果硬把 SSR 塞進不需要它的後台，你拿不到 SEO 紅利，卻要多扛伺服器端快取踩雷、環境耦合跟額外的資安攻擊面

遇到這種不需要 SEO 的案子，我現在通常會先這樣切邊界：

```text
web    : React + Vite + React Router（純前端 SPA）
api    : 獨立後端 API 服務
worker : 排程或背景佇列（真的需要才加）
```

把前後端切開的好處很實際：API 就是網站、手機 App 跟背景排程共用的契約，前端部署退回最單純的靜態檔案，不用為了改一個畫面去擔心伺服器端狀態或框架版本

## 真的要 SSR 時，Next.js 跟 React Router 差在哪

確認真的需要 SSR 之後，我才會進到第二關：我想讓框架幫我決定多少事

Next.js App Router 給的是一整套高度整合的懶人包，從 Server Components、Server Actions 到快取策略都幫你設計好了，團隊如果習慣這套慣例、又直接部署在 Vercel，開發速度確實很快

代價就是「黑盒感」比較重，一旦快取行為不如預期，或是想脫離特定平台部署，除錯跟繞路的成本會突然拉高

React Router Framework Mode（搭配 Vite）走的則是另一條路，它不靠資料夾魔法猜你的意圖，路由就是一份明明白白的設定檔，讀取走 `loader`、寫入走 `action`，整體更貼近原本的 HTTP 請求與回應模型

兩邊都能把 SSR 做好，差別在於你想要整合度高的預設慣例，還是希望路由、快取跟部署邊界盡量維持透明好掌控

## 至於 TypeScript 後端，我為什麼偏愛 Fastify

把 API 獨立出來之後，另一個常見問題是：Node.js / TypeScript 後端要不要上 NestJS 或 AdonisJS 這種大框架

我自己的偏好很直接：我不太喜歡為了寫幾支 API，滿街都是 class、裝飾器（decorator）跟層層抽象，NestJS 的架構儀式感偏重，但 ORM 跟登入驗證很多時候還是得自己接，等於扛了複雜度卻沒省到選型功夫

Fastify 剛好卡在我覺得最舒服的位置，它本身已經把路由、外掛機制、結構化日誌跟效能處理得很好，又不會強迫你吞下整套開發風格

它的缺點也同樣明顯：自由度高，代表每次開新專案如果都重選一次資料庫工具跟驗證方案，會很耗神，所以我的做法是自己收斂一份小而固定的起手式（Fastify 配 Zod 驗證、Drizzle 處理 SQL 與遷移，有登入需求再補上 Better Auth），把彈性變成可重複的預設值

順帶一提，驗證這塊我現在也會盡量避免把核心登入綁死在單一外部服務上，以前真的遇過 Auth0 服務中斷，整個系統卡住只能乾等的經驗，所以現在只要條件允許，我更傾向把關鍵依賴握在自己可控的範圍裡

## 最後留給自己的提醒

框架沒有絕對的對錯，真正麻煩的是沒想清楚前提就照抄最紅的組合

下次要開新專案之前，先停下來把三個限制列出來就夠了：這個站需要 SEO 嗎、我願意替框架的魔法跟升級債買單嗎、萬一它明天爆出一個緊急資安漏洞我承擔得起嗎

先把限制列出來再選工具，很多猶豫其實就會少一半

## 參考資料

- [Next.js CVE-2025-29927 Postmortem](https://nextjs.org/blog/cve-2025-29927)
- [React Router modes](https://reactrouter.com/start/modes)
- [React Router v8](https://remix.run/blog/react-router-v8)
- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
