---
schema: resume
lang: zh
name: Josh Wang
title: Software Developer
---

# Josh Wang — 履歷

## Summary
- 10+ 年全端開發經驗（前端為主），涵蓋 SaaS、資安、跨國內部系統與 React Native
- 主導過 7 個以上 Web 系統與 2 個 Mobile App 架構設計，熟悉 TypeScript、CI/CD、AWS
- 近期專注於 AI-assisted development workflow 落地、技術債重構與高效產品交付

## Experience
### Full-Stack Engineer — Independent
2023/06 – 至今
#### CI/CD 架構與資安深度優化 | 數據分析新創 (SaaS)
- 主導 CI/CD 流程重構，將過度拆分的 5 個分支整併為 2 個，優化 Monorepo 結構有效降低維運負擔
- 導入 Claude + Playwright MCP 自動生成 Gherkin 腳本，建立自動化驗收機制，降低 regression risk 並提升 release 穩定性
- 針對急迫資安風險進行 Critical Security Patching，修補 CVE-2025-29927 漏洞，強化系統安全等級
#### 核心地圖系統開發與架構債清理 | 知名房產集團
- 擔任技術主力填補開發缺口，於期限內完成地圖 POI 篩選等複雜互動功能上線
- 於既有 codebase 落地 Claude Code + MCP 輔助開發模式，將特定功能 POC 驗證時間從數週縮短至 1.5 天
- 主導舊專案模組拆解與重構，從根源解決既有架構之技術債問題
#### 即時交易資訊功能開發 | Vue 3 + Nuxt.js
- 接手既有 Vue 3 + Nuxt 3 + Pinia 專案，於既有架構慣例下擴充即時交易資訊功能
- 整合 TradingView Widget 與 ECharts，實作即時股價、最佳五檔行情及數據視覺化

### Front-End Developer (Platform & Architecture) — TeamT5 杜浦數位安全
2021/10 – 2023/06
#### ThreatSonar 產品前端架構規劃
- 主導前後端分離架構規劃，產出前端技術規格與架構設計文件，作為後續實作依據
#### 官方網站架構規劃與活動頁面（CYBERSEC 2022/2023、InterOp23）
- 主導雲端架構遷移，以 AWS S3/CloudFront 及 Next.js 取代 Firebase/Cloudinary，降低雲端成本 90% 並提升網站可靠性
- 重構 50% 以上舊系統 code，並以 AWS SDK/TypeScript/Pica.js 實作具自動縮圖功能的 file-upload system
- 以 Preact.js + Tailwind CSS 開發 CYBERSEC 2022/2023 及 InterOp23 活動頁面，沿用 AWS S3 + CloudFront 部署
- 發現外部廠商密碼明碼傳輸及登入權限設計問題，提報後獲得高層關注並推動改善

### Front-End Lead — 海碩集團 鑫享科技 (OEC Group)
2019/05 – 2021/10
#### B2B/B2C 後台系統
- 採用 React Hooks 及 Context API 領導全新前端架構，並以 WebSocket 實作即時通知，覆蓋全球 50+ 國內部使用者
- 使用 Formik、Yup 及 React.memo 設計單頁近百格欄位表單，確保欄位驗證與效能
- 於 GitHub Actions 推出時（2019/08）即提案導入並建置 CI/CD 流程，為內部早期採用者
#### 官方網站改版 / 前端成員內部訓練
- 接手外部廠商原始 HTML/CSS，於一個月內完成主要技術架構（Next.js、i18n 13 語系）
- 推動 Pull Request Code Review 機制，交換技術意見，提升 code 可讀性及確保需求一致性

### Web Developer — 新創公司（Fullinn、CatFi、myTreat、Ecowork）
2014/07 – 2019/04
#### 全端架構與 API 設計 | Fullinn、myTreat、Ecowork
- 領導主要前端架構設計，以 Next.js SSR 開發 SEO 導向之旅宿官網建站系統，第一位客戶登陸 Google 後第一週即進入搜尋結果第一頁
- 使用 React.js 及 GraphQL 開發 OTA 平台及訂單系統，並主導初期 REST API 格式設計，建構 API 設計流程使後端開發更為順暢
- 以 Rails、Angular.js 進行全端開發，獨立實作客服後台系統
#### 行動應用與跨平台開發 | Fullinn、CatFi
- 以 React Native 開發跨平台行動應用程式，使用 Redux、Redux-saga 處理資料流與 Side Effect
- 引入 Firebase Push Notification 及 Code Push，降低 Deploy 成本並整合推播服務
- 串接 Streaming 技術（WebRTC、RTMP），研究即時影像傳輸應用
#### 測試環境與開發流程建置 | Ecowork
- 研究實作 Cucumber、RSpec 完成客戶測試報告需求，協助 DevOps 同事建立自動測試環境
- 研究導入 Vagrant 及建置上版作業流程，統一開發環境使新進同仁可迅速上手

## Projects
### PickleScout — LLM 驅動的 E2E 測試自動生成工具
- 以 AI-assisted workflow 於一週內完成 POC 並開源，涵蓋 browser agent、LLM pipeline、self-healing 與全端架構
- 設計兩階段 LLM pipeline：browser agent 探索頁面記錄 ActionLog，自動生成 Gherkin feature 與 Playwright 測試腳本
- 實作 self-healing 機制：測試失敗時自動讓 LLM 修復 selector 與 timeout 後重試，提升生成測試可用率
- 後端以 Fastify + BullMQ/Redis 建立 job queue，解耦長時間執行的 LLM 生成任務並實作失敗重試與狀態追蹤機制，生成產物同時包含 GitHub Actions workflow，達成 runtime 零 LLM 依賴

## Education
文藻外語大學　數位內容應用與管理系 —  (2009/09 – 2013/06)

## Skills
- **Frontend:** React / Next.js / TypeScript / Redux / Tailwind CSS / Vue 3 / Nuxt.js
- **Backend:** Node.js / Fastify / Rails / Koa / RESTful API / GraphQL / Redis / BullMQ
- **Architecture & Infra:** Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS
- **AI Workflow:** Claude Code / MCP / Windsurf
- **Testing:** Playwright / Jest / Cucumber / RSpec
- **Mobile:** React Native / TestFlight

## Resume Data

```json
{
  "name": "Josh Wang",
  "title": "Software Developer",
  "subtitle": "專注 React / Next.js 前端架構，兼具 Node.js 後端與 AI 開發流程整合經驗的全端工程師",
  "location": "Taipei, Taiwan",
  "email": "spjay1@gmail.com",
  "site": "joshwang.dev",
  "siteHref": "https://joshwang.dev",
  "sectionLabels": {
    "summary": "個人簡介",
    "achievements": "關鍵成果",
    "experience": "工作經歷",
    "projects": "個人專案",
    "education": "學歷",
    "skills": "技能"
  },
  "summaryLines": [
    "10+ 年全端開發經驗（前端為主），涵蓋 SaaS、資安、跨國內部系統與 React Native",
    "主導過 7 個以上 Web 系統與 2 個 Mobile App 架構設計，熟悉 TypeScript、CI/CD、AWS",
    "近期專注於 AI-assisted development workflow 落地、技術債重構與高效產品交付"
  ],
  "achievements": [
    [
      "降低雲端基礎設施成本 90%",
      "支援全球 50+ 國內部系統"
    ],
    [
      "AI 協作 POC 驗證縮短至 1.5 天",
      "設計 job queue 驅動的 LLM pipeline，實作 self-healing 重試機制"
    ]
  ],
  "jobs": [
    {
      "title": "Full-Stack Engineer",
      "company": "Independent",
      "period": "2023/06 – 至今",
      "groups": [
        {
          "subhead": "CI/CD 架構與資安深度優化 | 數據分析新創 (SaaS)",
          "bullets": [
            "主導 CI/CD 流程重構，將過度拆分的 5 個分支整併為 2 個，優化 Monorepo 結構有效降低維運負擔",
            "導入 Claude + Playwright MCP 自動生成 Gherkin 腳本，建立自動化驗收機制，降低 regression risk 並提升 release 穩定性",
            "針對急迫資安風險進行 Critical Security Patching，修補 CVE-2025-29927 漏洞，強化系統安全等級"
          ]
        },
        {
          "subhead": "核心地圖系統開發與架構債清理 | 知名房產集團",
          "bullets": [
            "擔任技術主力填補開發缺口，於期限內完成地圖 POI 篩選等複雜互動功能上線",
            "於既有 codebase 落地 Claude Code + MCP 輔助開發模式，將特定功能 POC 驗證時間從數週縮短至 1.5 天",
            "主導舊專案模組拆解與重構，從根源解決既有架構之技術債問題"
          ]
        },
        {
          "subhead": "即時交易資訊功能開發 | Vue 3 + Nuxt.js",
          "bullets": [
            "接手既有 Vue 3 + Nuxt 3 + Pinia 專案，於既有架構慣例下擴充即時交易資訊功能",
            "整合 TradingView Widget 與 ECharts，實作即時股價、最佳五檔行情及數據視覺化"
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
          "subhead": "ThreatSonar 產品前端架構規劃",
          "bullets": [
            "主導前後端分離架構規劃，產出前端技術規格與架構設計文件，作為後續實作依據"
          ]
        },
        {
          "subhead": "官方網站架構規劃與活動頁面（CYBERSEC 2022/2023、InterOp23）",
          "bullets": [
            "主導雲端架構遷移，以 AWS S3/CloudFront 及 Next.js 取代 Firebase/Cloudinary，降低雲端成本 90% 並提升網站可靠性",
            "重構 50% 以上舊系統 code，並以 AWS SDK/TypeScript/Pica.js 實作具自動縮圖功能的 file-upload system",
            "以 Preact.js + Tailwind CSS 開發 CYBERSEC 2022/2023 及 InterOp23 活動頁面，沿用 AWS S3 + CloudFront 部署",
            "發現外部廠商密碼明碼傳輸及登入權限設計問題，提報後獲得高層關注並推動改善"
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
          "subhead": "B2B/B2C 後台系統",
          "bullets": [
            "採用 React Hooks 及 Context API 領導全新前端架構，並以 WebSocket 實作即時通知，覆蓋全球 50+ 國內部使用者",
            "使用 Formik、Yup 及 React.memo 設計單頁近百格欄位表單，確保欄位驗證與效能",
            "於 GitHub Actions 推出時（2019/08）即提案導入並建置 CI/CD 流程，為內部早期採用者"
          ]
        },
        {
          "subhead": "官方網站改版 / 前端成員內部訓練",
          "bullets": [
            "接手外部廠商原始 HTML/CSS，於一個月內完成主要技術架構（Next.js、i18n 13 語系）",
            "推動 Pull Request Code Review 機制，交換技術意見，提升 code 可讀性及確保需求一致性"
          ]
        }
      ]
    },
    {
      "title": "Web Developer",
      "company": "新創公司（Fullinn、CatFi、myTreat、Ecowork）",
      "period": "2014/07 – 2019/04",
      "borderBottom": false,
      "groups": [
        {
          "subhead": "全端架構與 API 設計 | Fullinn、myTreat、Ecowork",
          "bullets": [
            "領導主要前端架構設計，以 Next.js SSR 開發 SEO 導向之旅宿官網建站系統，第一位客戶登陸 Google 後第一週即進入搜尋結果第一頁",
            "使用 React.js 及 GraphQL 開發 OTA 平台及訂單系統，並主導初期 REST API 格式設計，建構 API 設計流程使後端開發更為順暢",
            "以 Rails、Angular.js 進行全端開發，獨立實作客服後台系統"
          ]
        },
        {
          "subhead": "行動應用與跨平台開發 | Fullinn、CatFi",
          "bullets": [
            "以 React Native 開發跨平台行動應用程式，使用 Redux、Redux-saga 處理資料流與 Side Effect",
            "引入 Firebase Push Notification 及 Code Push，降低 Deploy 成本並整合推播服務",
            "串接 Streaming 技術（WebRTC、RTMP），研究即時影像傳輸應用"
          ]
        },
        {
          "subhead": "測試環境與開發流程建置 | Ecowork",
          "bullets": [
            "研究實作 Cucumber、RSpec 完成客戶測試報告需求，協助 DevOps 同事建立自動測試環境",
            "研究導入 Vagrant 及建置上版作業流程，統一開發環境使新進同仁可迅速上手"
          ]
        }
      ]
    }
  ],
  "project": {
    "title": "PickleScout — LLM 驅動的 E2E 測試自動生成工具",
    "period": "2026/05",
    "subtitle": "個人開源專案",
    "href": "https://github.com/iskWang/PickleScout",
    "bullets": [
      "以 AI-assisted workflow 於一週內完成 POC 並開源，涵蓋 browser agent、LLM pipeline、self-healing 與全端架構",
      "設計兩階段 LLM pipeline：browser agent 探索頁面記錄 ActionLog，自動生成 Gherkin feature 與 Playwright 測試腳本",
      "實作 self-healing 機制：測試失敗時自動讓 LLM 修復 selector 與 timeout 後重試，提升生成測試可用率",
      "後端以 Fastify + BullMQ/Redis 建立 job queue，解耦長時間執行的 LLM 生成任務並實作失敗重試與狀態追蹤機制，生成產物同時包含 GitHub Actions workflow，達成 runtime 零 LLM 依賴"
    ]
  },
  "education": {
    "school": "文藻外語大學　數位內容應用與管理系",
    "period": "2009/09 – 2013/06",
    "degree": ""
  },
  "skills": [
    {
      "cat": "Frontend",
      "val": "React / Next.js / TypeScript / Redux / Tailwind CSS / Vue 3 / Nuxt.js"
    },
    {
      "cat": "Backend",
      "val": "Node.js / Fastify / Rails / Koa / RESTful API / GraphQL / Redis / BullMQ"
    },
    {
      "cat": "Architecture & Infra",
      "val": "Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS"
    },
    {
      "cat": "AI Workflow",
      "val": "Claude Code / MCP / Windsurf"
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
