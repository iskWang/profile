---
schema: resume
lang: zh
name: Josh Wang
title: Software Developer
---

# Josh Wang — 履歷

## Summary
- 10+ 年軟體開發經驗，從 Rails、Node.js 後端到 AWS 與 Cloudflare 雲端架構都實際滾過一輪，近期也將 Go 應用於個人產品開發
- 主導過 7 個以上 Web 系統與 2 個 Mobile App 架構，曾負責招聘與帶領 3–4 人團隊，習慣在既有系統裡拆解技術債、重整 Monorepo 與 CI/CD 流程
- 近期熱衷於把 AI Workflow、測試自動化與開發工具接進日常流程——畢竟能讓機器穩定重試的事，就不該半夜找人類加班

## Experience
### Full-Stack Engineer — Independent
2023/06 – 至今
#### 發版流程優化與資安修補 | 數據分析新創 (SaaS)
- 簡化團隊開發與上線流程，把原本過度拆分的 5 條開發線整併為 2 條，大幅降低團隊維運負擔，並建立自動化驗收機制提升發版穩定度
- 重整 Monorepo 與 CI/CD 流程，緊急修補 CVE-2025-29927 重大安全漏洞，並導入 Claude 搭配 Playwright MCP 自動產生 Gherkin 驗收測試
#### 核心找屋系統開發與翻新 | 知名房產集團
- 擔任技術主力支援高流量找屋網站開發，如期上線地圖周邊篩選功能，並將新功能雛形驗證時間縮短至 1.5 天內
- 在既有系統導入 Claude Code 與 MCP 輔助開發，快速完成需求整合與 API 串接驗證，同時拆解舊有模組、清理長期累積的架構技術債
#### 即時看盤功能擴充 | 金融交易平台
- 接手既有交易平台專案，在原有系統架構下順利擴充即時股價與五檔行情查詢功能，並強化使用者權限與資料存取安全
- 使用 Vue 3、Nuxt 3 與 Pinia 開發，整合 TradingView Widget 與 ECharts 呈現即時行情與互動圖表，同時優化既有框架的資料存取邏輯

### Front-End Developer (Platform & Architecture) — TeamT5 杜浦數位安全
2021/10 – 2023/06
#### 資安產品架構規劃（ThreatSonar）
- 擔任技術策略角色，負責前期可行性驗證與系統規劃，產出技術規格提供 4 人開發小組作為實作依據
- 結合過去 Rails 後端開發背景，擔任產品前後端分離架構規劃與技術選型實驗顧問，建立後續開發依據
#### 官方網站翻新與大型活動頁（CYBERSEC 2022/2023、InterOp23）
- 主導官網雲端搬遷與翻新，成功降低 90% 雲端費用，網頁開啟速度從 2.47 秒縮短至 1.6 秒，檔案體積從 13.7MB 降至 8.4MB
- 以 AWS S3、CloudFront 與 Next.js 取代原有 Firebase 與 Cloudinary，重構超過 50% 舊程式碼並與 MIS 盤點 DNS 紀錄減少重複查詢，同時以 TypeScript 與 AWS SDK 實作自動縮圖上傳系統，沿用同套部署架構交付多場大型活動網站
- 主動盤查並發現外部廠商密碼明碼傳輸與權限漏洞，即時提報高層並推動改善

### Front-End Lead — 海碩集團 鑫享科技 (OEC Group)
2019/05 – 2021/10
#### 全球營運後台系統與團隊帶領
- 負責招募 2 位中階工程師並帶領 3–4 人開發小組，主導工作排程、程式碼審查與跨部門溝通，參與跨國伺服器分離規劃，支援全球 50 國以上內部人員日常作業
- 以 React 重建後台架構並透過 WebSocket 實作即時通知，提供中國與海外伺服器分離設計建議，設計單頁近百欄位的複雜表單驗證與效能控制，並於 2019 年率先導入 GitHub Actions 建立自動化部署（CI/CD）
#### 多語系官方網站改版
- 接手外部廠商靜態頁面，在一個月內完成 13 種語言的官方網站架構並順利上線
- 採用 Next.js 搭配 i18n 多語系架構，兼顧網站載入效能與後續內容維護

### Web / Rails Developer — 新創公司（Fullinn、CatFi、myTreat、Ecowork）
2014/07 – 2019/04
#### 全端產品與雲端開發流程 | Fullinn、myTreat、Ecowork（AWS 代理商）
- 從 AWS 代理商（Ecowork）的後端開發起步，獨立建置客服後台與自動化測試流程，並於新創期間主導旅宿建站架構、參與訂房系統開發，首位客戶一週內即登上 Google 搜尋第一頁
- 橫跨 Ruby on Rails、Next.js、React 與 GraphQL 全端開發，協助 DevOps 建置自動測試與統一上版環境（Cucumber / RSpec），並主導初期 REST API 規格設計加速前後端協作
#### 跨平台手機 App 開發 | Fullinn、CatFi
- 開發跨平台手機應用程式，整合訊息推播、即時更新與影像串流功能，降低上架與維運成本
- 使用 React Native、Redux 與 Redux-saga 建構 App，串接 Firebase 推播、Code Push 與 WebRTC / RTMP 影音技術

## Projects
### TaiwanHaul — 給東南亞旅客的台灣商品與價格指南
- 打造給東南亞旅客的台灣商品與價格指南（持續迭代中），建立商品搜尋與價格新鮮度管理機制，在缺乏可靠價格時引導使用者至店家查詢
- 採用 React 前端搭配 Go 搜尋 API，部署於 Cloudflare Workers 與 D1 資料庫，兼顧邊緣低延遲與極低維運成本

### PickleScout — AI 自動化網站測試產生工具
- 一週內完成並開源的測試輔助工具，讓 AI 先走訪網站自動寫好測試腳本，匯出後日常 CI 執行完全不需再呼叫 AI 模型
- 後端以 Fastify、BullMQ 與 Redis 建立非同步任務佇列處理重試與狀態追蹤，結合瀏覽器代理與自動修復機制輸出 Gherkin、Playwright 腳本與 GitHub Actions 設定

## Selected Writing
- [把本機 Agent 記憶接上 Claude 與 ChatGPT 網頁：寫一個 MCP 轉接站的踩坑紀錄](https://joshwang.dev/zh-tw/blog/agent-memory-remote-mcp-gateway)
- [要 SSR 還是要控制權：我怎麼選 React 框架跟 TypeScript 後端](https://joshwang.dev/zh-tw/blog/react-ssr-backend-tradeoffs)

## Education
文藻外語大學　數位內容應用與管理系 —  (2009/09 – 2013/06)

## Skills
- **Backend & Database:** Node.js / Fastify / Go / Ruby on Rails / RESTful API / GraphQL / SQL / PostgreSQL / SQLite / Cloudflare D1 / Redis / BullMQ
- **Frontend:** TypeScript / React / Next.js / Vue 3 / Nuxt.js / Redux / Tailwind CSS
- **Architecture & Infra:** Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS / Cloudflare (Workers / Access)
- **AI Workflow:** Claude Code / MCP / Playwright MCP / Agent Workflow
- **Testing:** Playwright / Jest / Cucumber / RSpec
- **Mobile:** React Native / TestFlight

## Resume Data

```json
{
  "name": "Josh Wang",
  "title": "Software Developer",
  "subtitle": "橫跨全端系統架構、雲端維運與自動化工具鏈的軟體工程師",
  "heroDescription": "10+ 年軟體開發經驗，橫跨全端系統架構、Rails / Node.js / Go 後端與自動化工具鏈——畢竟能讓機器穩定重試的事，就不該半夜找人類加班",
  "location": "Taipei, Taiwan",
  "email": "spjay1@gmail.com",
  "site": "joshwang.dev",
  "siteHref": "https://joshwang.dev",
  "sectionLabels": {
    "summary": "個人簡介",
    "achievements": "關鍵成果",
    "experience": "工作經歷",
    "projects": "個人專案",
    "writing": "技術文章",
    "education": "學歷",
    "skills": "技能"
  },
  "summaryLines": [
    "10+ 年軟體開發經驗，從 Rails、Node.js 後端到 AWS 與 Cloudflare 雲端架構都實際滾過一輪，近期也將 Go 應用於個人產品開發",
    "主導過 7 個以上 Web 系統與 2 個 Mobile App 架構，曾負責招聘與帶領 3–4 人團隊，習慣在既有系統裡拆解技術債、重整 Monorepo 與 CI/CD 流程",
    "近期熱衷於把 AI Workflow、測試自動化與開發工具接進日常流程——畢竟能讓機器穩定重試的事，就不該半夜找人類加班"
  ],
  "achievements": [
    [
      "降低雲端費用 90%，網頁開啟縮短至 1.6 秒",
      "支援全球 50+ 國系統，主導團隊招聘與架構落地"
    ],
    [
      "AI 輔助將新功能雛形驗證縮短至 1.5 天內",
      "獨立打造全端產品與 AI 自動化開發工具"
    ]
  ],
  "jobs": [
    {
      "title": "Full-Stack Engineer",
      "company": "Independent",
      "period": "2023/06 – 至今",
      "groups": [
        {
          "subhead": "發版流程優化與資安修補 | 數據分析新創 (SaaS)",
          "bullets": [
            "簡化團隊開發與上線流程，把原本過度拆分的 5 條開發線整併為 2 條，大幅降低團隊維運負擔，並建立自動化驗收機制提升發版穩定度",
            "重整 Monorepo 與 CI/CD 流程，緊急修補 CVE-2025-29927 重大安全漏洞，並導入 Claude 搭配 Playwright MCP 自動產生 Gherkin 驗收測試"
          ]
        },
        {
          "subhead": "核心找屋系統開發與翻新 | 知名房產集團",
          "bullets": [
            "擔任技術主力支援高流量找屋網站開發，如期上線地圖周邊篩選功能，並將新功能雛形驗證時間縮短至 1.5 天內",
            "在既有系統導入 Claude Code 與 MCP 輔助開發，快速完成需求整合與 API 串接驗證，同時拆解舊有模組、清理長期累積的架構技術債"
          ]
        },
        {
          "subhead": "即時看盤功能擴充 | 金融交易平台",
          "bullets": [
            "接手既有交易平台專案，在原有系統架構下順利擴充即時股價與五檔行情查詢功能，並強化使用者權限與資料存取安全",
            "使用 Vue 3、Nuxt 3 與 Pinia 開發，整合 TradingView Widget 與 ECharts 呈現即時行情與互動圖表，同時優化既有框架的資料存取邏輯"
          ]
        }
      ]
    },
    {
      "title": "Front-End Developer (Platform & Architecture)",
      "company": "TeamT5 杜浦數位安全",
      "period": "2021/10 – 2023/06",
      "borderBottom": false,
      "groups": [
        {
          "subhead": "資安產品架構規劃（ThreatSonar）",
          "bullets": [
            "擔任技術策略角色，負責前期可行性驗證與系統規劃，產出技術規格提供 4 人開發小組作為實作依據",
            "結合過去 Rails 後端開發背景，擔任產品前後端分離架構規劃與技術選型實驗顧問，建立後續開發依據"
          ]
        },
        {
          "subhead": "官方網站翻新與大型活動頁（CYBERSEC 2022/2023、InterOp23）",
          "bullets": [
            "主導官網雲端搬遷與翻新，成功降低 90% 雲端費用，網頁開啟速度從 2.47 秒縮短至 1.6 秒，檔案體積從 13.7MB 降至 8.4MB",
            "以 AWS S3、CloudFront 與 Next.js 取代原有 Firebase 與 Cloudinary，重構超過 50% 舊程式碼並與 MIS 盤點 DNS 紀錄減少重複查詢，同時以 TypeScript 與 AWS SDK 實作自動縮圖上傳系統，沿用同套部署架構交付多場大型活動網站",
            "主動盤查並發現外部廠商密碼明碼傳輸與權限漏洞，即時提報高層並推動改善"
          ]
        }
      ]
    },
    {
      "title": "Front-End Lead",
      "company": "海碩集團 鑫享科技 (OEC Group)",
      "period": "2019/05 – 2021/10",
      "groups": [
        {
          "subhead": "全球營運後台系統與團隊帶領",
          "bullets": [
            "負責招募 2 位中階工程師並帶領 3–4 人開發小組，主導工作排程、程式碼審查與跨部門溝通，參與跨國伺服器分離規劃，支援全球 50 國以上內部人員日常作業",
            "以 React 重建後台架構並透過 WebSocket 實作即時通知，提供中國與海外伺服器分離設計建議，設計單頁近百欄位的複雜表單驗證與效能控制，並於 2019 年率先導入 GitHub Actions 建立自動化部署（CI/CD）"
          ]
        },
        {
          "subhead": "多語系官方網站改版",
          "bullets": [
            "接手外部廠商靜態頁面，在一個月內完成 13 種語言的官方網站架構並順利上線",
            "採用 Next.js 搭配 i18n 多語系架構，兼顧網站載入效能與後續內容維護"
          ]
        }
      ]
    },
    {
      "title": "Web / Rails Developer",
      "company": "新創公司（Fullinn、CatFi、myTreat、Ecowork）",
      "period": "2014/07 – 2019/04",
      "borderBottom": false,
      "groups": [
        {
          "subhead": "全端產品與雲端開發流程 | Fullinn、myTreat、Ecowork（AWS 代理商）",
          "bullets": [
            "從 AWS 代理商（Ecowork）的後端開發起步，獨立建置客服後台與自動化測試流程，並於新創期間主導旅宿建站架構、參與訂房系統開發，首位客戶一週內即登上 Google 搜尋第一頁",
            "橫跨 Ruby on Rails、Next.js、React 與 GraphQL 全端開發，協助 DevOps 建置自動測試與統一上版環境（Cucumber / RSpec），並主導初期 REST API 規格設計加速前後端協作"
          ]
        },
        {
          "subhead": "跨平台手機 App 開發 | Fullinn、CatFi",
          "bullets": [
            "開發跨平台手機應用程式，整合訊息推播、即時更新與影像串流功能，降低上架與維運成本",
            "使用 React Native、Redux 與 Redux-saga 建構 App，串接 Firebase 推播、Code Push 與 WebRTC / RTMP 影音技術"
          ]
        }
      ]
    }
  ],
  "project": {
    "title": "PickleScout — AI 自動化網站測試產生工具",
    "period": "2026/05",
    "subtitle": "個人開源專案",
    "href": "https://github.com/iskWang/PickleScout",
    "bullets": [
      "一週內完成並開源的測試輔助工具，讓 AI 先走訪網站自動寫好測試腳本，匯出後日常 CI 執行完全不需再呼叫 AI 模型",
      "後端以 Fastify、BullMQ 與 Redis 建立非同步任務佇列處理重試與狀態追蹤，結合瀏覽器代理與自動修復機制輸出 Gherkin、Playwright 腳本與 GitHub Actions 設定"
    ]
  },
  "projects": [
    {
      "title": "TaiwanHaul — 給東南亞旅客的台灣商品與價格指南",
      "period": "2026",
      "subtitle": "獨立產品 (WIP)",
      "href": "https://taiwanhaul.com/",
      "bullets": [
        "打造給東南亞旅客的台灣商品與價格指南（持續迭代中），建立商品搜尋與價格新鮮度管理機制，在缺乏可靠價格時引導使用者至店家查詢",
        "採用 React 前端搭配 Go 搜尋 API，部署於 Cloudflare Workers 與 D1 資料庫，兼顧邊緣低延遲與極低維運成本"
      ]
    },
    {
      "title": "PickleScout — AI 自動化網站測試產生工具",
      "period": "2026/05",
      "subtitle": "個人開源專案",
      "href": "https://github.com/iskWang/PickleScout",
      "bullets": [
        "一週內完成並開源的測試輔助工具，讓 AI 先走訪網站自動寫好測試腳本，匯出後日常 CI 執行完全不需再呼叫 AI 模型",
        "後端以 Fastify、BullMQ 與 Redis 建立非同步任務佇列處理重試與狀態追蹤，結合瀏覽器代理與自動修復機制輸出 Gherkin、Playwright 腳本與 GitHub Actions 設定"
      ]
    }
  ],
  "writing": [
    {
      "title": "把本機 Agent 記憶接上 Claude 與 ChatGPT 網頁：寫一個 MCP 轉接站的踩坑紀錄",
      "href": "https://joshwang.dev/zh-tw/blog/agent-memory-remote-mcp-gateway"
    },
    {
      "title": "要 SSR 還是要控制權：我怎麼選 React 框架跟 TypeScript 後端",
      "href": "https://joshwang.dev/zh-tw/blog/react-ssr-backend-tradeoffs"
    }
  ],
  "education": {
    "school": "文藻外語大學　數位內容應用與管理系",
    "period": "2009/09 – 2013/06",
    "degree": ""
  },
  "skills": [
    {
      "cat": "Backend & Database",
      "val": "Node.js / Fastify / Go / Ruby on Rails / RESTful API / GraphQL / SQL / PostgreSQL / SQLite / Cloudflare D1 / Redis / BullMQ"
    },
    {
      "cat": "Frontend",
      "val": "TypeScript / React / Next.js / Vue 3 / Nuxt.js / Redux / Tailwind CSS"
    },
    {
      "cat": "Architecture & Infra",
      "val": "Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS / Cloudflare (Workers / Access)"
    },
    {
      "cat": "AI Workflow",
      "val": "Claude Code / MCP / Playwright MCP / Agent Workflow"
    },
    {
      "cat": "Testing",
      "val": "Playwright / Jest / Cucumber / RSpec"
    },
    {
      "cat": "Mobile",
      "val": "React Native / TestFlight"
    }
  ]
}
```
