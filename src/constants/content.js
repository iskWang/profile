export const CONTENT = {
  zh: {
    nav: {
      about: "關於",
      work: "作品",
      experience: "經歷",
      capabilities: "能力",
      contact: "聯絡",
    },
    hero: {
      name: "Josh Wang",
      role: "軟體開發者",
      summary:
        "前端出身的全端工程師，將 React / Next.js 架構、Node.js 後端與 AI 開發流程，落地為可驗收、可持續交付的產品系統",
      evidence: [
        {
          label: "雲端基礎設施成本",
          value: "-90%",
          context: "將 Firebase / Cloudinary 遷移至 AWS S3、CloudFront 與 Next.js",
        },
        {
          label: "AI 協作 POC 驗證",
          value: "數週 → 1.5 天",
          context: "在既有 codebase 導入 Claude Code + MCP 輔助開發流程",
        },
      ],
      resumeBtn: "查看中文履歷",
      resumeUrl: "/JoshWang_ZH_Resume.pdf",
      projectBtn: "查看 PickleScout",
    },
    projects: {
      title: "代表作品",
      intro: "把自然語言操作流程，轉成可追蹤、可重跑的 E2E 測試",
      decisionsTitle: "設計依據",
      items: [
        {
          title: "PickleScout",
          date: "2026/05",
          descriptor: "LLM 驅動的 E2E 測試自動生成工具",
          url: "https://github.com/iskWang/PickleScout",
          meta: "Open source side project",
          value: "一週完成 POC：從 URL 與自然語言操作，產出可直接執行的 Gherkin 與 Playwright 測試",
          flow: "Stagehand 探索 → ActionLog → Gherkin + Playwright → 零 LLM runtime 執行",
          highlights: [
            "Stagehand 探索頁面並記錄 ActionLog，讓生成與執行成為兩個可追蹤階段",
            "Fastify + BullMQ / Redis 解耦長時間任務，保留重試與狀態追蹤",
            "失敗時修復 selector 與 timeout；產物接入 GitHub Actions，執行時不依賴 LLM",
          ],
        },
      ],
    },
    experience: {
      title: "Experience",
      intro: "從產品交付、架構債清理到測試與 CI/CD，持續把工程流程變得更可靠",
      items: [
        {
          company: "Independent",
          role: "Full-Stack Engineer",
          period: "2023/06 – 至今",
          engagements: [
            {
              title: "CI/CD 架構與資安優化",
              client: "數據分析新創（SaaS）",
              highlights: [
                "主導 CI/CD 流程重構，將過度拆分的 5 個分支整併為 2 個，並優化 Monorepo 結構以降低維運負擔",
                "導入 Claude + Playwright MCP 自動生成 Gherkin 腳本，建立自動化驗收流程，降低 regression risk",
                "修補 CVE-2025-29927，完成急迫資安風險的 Critical Security Patching",
              ],
            },
            {
              title: "地圖系統開發與架構債清理",
              client: "知名房產集團",
              highlights: [
                "擔任技術主力，於期限內完成地圖 POI 篩選等複雜互動功能",
                "在既有 codebase 導入 Claude Code + MCP，將特定功能 POC 驗證從數週縮短至 1.5 天",
                "主導舊專案模組拆解與重構，從根源處理既有架構債",
              ],
            },
            {
              title: "即時交易資訊功能開發",
              client: "Vue 3 + Nuxt.js",
              highlights: [
                "接手 Vue 3 + Nuxt 3 + Pinia 專案，在既有架構慣例下擴充即時交易資訊功能",
                "整合 TradingView Widget 與 ECharts，實作即時股價、最佳五檔行情與數據視覺化",
              ],
            },
          ],
        },
        {
          company: "TeamT5 杜浦數位安全",
          role: "Front-End Developer (Platform & Architecture)",
          period: "2021/10 – 2023/06",
          highlights: [
            "主導前後端分離架構規劃，產出 ThreatSonar 技術規格與架構設計文件",
            "以 AWS S3 / CloudFront 與 Next.js 取代 Firebase / Cloudinary，降低雲端基礎設施成本 90%；並重構 50% 以上 legacy code",
            "以 Preact.js + Tailwind CSS 開發 CYBERSEC 2022/2023 與 InterOp23 活動頁，並推動外部廠商資安問題改善",
          ],
        },
        {
          company: "海碩集團 鑫享科技（OEC Group）",
          role: "Front-End Lead",
          period: "2019/05 – 2021/10",
          highlights: [
            "以 React Hooks、Context API 與 WebSocket 領導 B2B / B2C 後台系統前端架構，支援全球 50+ 國內部使用者",
            "設計單頁近百格欄位表單，使用 Formik、Yup 與 React.memo 控制驗證與效能",
            "於 2019/08 提案導入 GitHub Actions CI/CD，並在一個月內完成 Next.js + i18n 13 語系官方網站架構",
          ],
        },
      ],
      earlyCareer: {
        title: "Web Developer",
        period: "2014/07 – 2019/04",
        company: "新創團隊：Fullinn、CatFi、myTreat、Ecowork",
        highlights: [
          "以 Next.js SSR 建置 SEO 導向旅宿網站系統；使用 React / GraphQL 開發 OTA 與訂單系統，並主導 REST API 設計",
          "以 React Native、Redux 與 Redux-saga 開發跨平台行動應用，整合 Firebase Push、Code Push 與 WebRTC / RTMP",
          "以 Cucumber、RSpec 與 Vagrant 建立測試環境及部署流程，並以 Rails、Angular.js 完成全端與客服後台功能",
        ],
      },
      education: {
        title: "Education",
        school: "文藻外語大學",
        degree: "數位內容應用與管理系",
        period: "2009/09 – 2013/06",
      },
    },
    capabilities: {
      title: "Capabilities",
      intro: "以可維護的介面、可靠的服務與可驗收的交付流程串起產品",
      groups: [
        {
          title: "Frontend",
          description: "產品介面、前端架構與跨框架交付",
          tools: ["React", "Next.js", "TypeScript", "Redux", "Tailwind CSS", "Vue 3", "Nuxt.js"],
        },
        {
          title: "Backend",
          description: "API、背景任務與資料流的服務端設計",
          tools: ["Node.js", "Fastify", "Rails", "Koa", "RESTful API", "GraphQL", "Redis", "BullMQ"],
        },
        {
          title: "Architecture & Infra",
          description: "系統架構、基礎設施與持續整合交付",
          tools: ["Monorepo", "CI/CD", "GitHub Actions", "GitLab Runner", "Docker", "AWS"],
        },
        {
          title: "AI Workflow",
          description: "將 AI 協作工具整合至可重複的開發流程",
          tools: ["Claude Code", "MCP", "Windsurf"],
        },
        {
          title: "Testing",
          description: "建立可靠、可驗收的自動化測試流程",
          tools: ["Playwright", "Jest", "Cucumber", "RSpec"],
        },
        {
          title: "Mobile",
          description: "跨平台行動應用開發與測試發布",
          tools: ["React Native", "TestFlight"],
        },
      ],
    },
    contact: {
      title: "想聊聊你的產品？",
      lead: "樂於參與討論、分享觀點，通常不是會議中最安靜的那位",
      email: "spjay1@gmail.com",
      location: "Taipei, Taiwan",
      links: {
        email: "mailto:spjay1@gmail.com",
        github: "https://github.com/iskWang",
        zhResume: "/JoshWang_ZH_Resume.pdf",
        enResume: "/JoshWang_EN_Resume.pdf",
      },
    },
    footer: {
      builtWith: "Built with React, Vite and a verification-first mindset",
    },
  },
  en: {
    nav: {
      about: "About",
      work: "Work",
      experience: "Experience",
      capabilities: "Capabilities",
      contact: "Contact",
    },
    hero: {
      name: "Josh Wang",
      role: "Software Developer",
      summary:
        "A front-end-trained full-stack engineer who turns React / Next.js architecture, Node.js backends, and AI workflows into reliable, verifiable product delivery",
      evidence: [
        {
          label: "Cloud infrastructure cost",
          value: "-90%",
          context: "Migrated Firebase / Cloudinary to AWS S3, CloudFront, and Next.js",
        },
        {
          label: "AI-assisted POC validation",
          value: "Weeks → 1.5 days",
          context: "Introduced a Claude Code + MCP workflow to an existing codebase",
        },
      ],
      resumeBtn: "View English résumé",
      resumeUrl: "/JoshWang_EN_Resume.pdf",
      projectBtn: "View PickleScout",
    },
    projects: {
      title: "Selected Work",
      intro: "Turning natural-language user flows into traceable, repeatable E2E tests",
      decisionsTitle: "Design decisions",
      items: [
        {
          title: "PickleScout",
          date: "May 2026",
          descriptor: "LLM-driven E2E test generation tool",
          url: "https://github.com/iskWang/PickleScout",
          meta: "Open source side project",
          value: "Completed the POC in one week, turning a URL and natural-language flow into ready-to-run Gherkin and Playwright tests",
          flow: "Stagehand exploration → ActionLog → Gherkin + Playwright → Zero-LLM runtime",
          highlights: [
            "Stagehand explores the page and records an ActionLog, separating generation from execution into two traceable stages",
            "Fastify + BullMQ / Redis decouple long-running jobs with retries and status tracking",
            "Self-healing repairs selectors and timeouts; GitHub Actions runs the output without an LLM dependency",
          ],
        },
      ],
    },
    experience: {
      title: "Experience",
      intro: "From product delivery and architecture debt to testing and CI/CD, I make engineering workflows more reliable",
      items: [
        {
          company: "Independent",
          role: "Full-Stack Engineer",
          period: "Jun 2023 – Present",
          engagements: [
            {
              title: "CI/CD Architecture & Security",
              client: "Data analytics SaaS startup",
              highlights: [
                "Led CI/CD restructuring, consolidating 5 fragmented branches into 2 and optimizing the monorepo to reduce operational overhead",
                "Introduced Claude + Playwright MCP for automated Gherkin generation and acceptance testing, reducing regression risk",
                "Resolved CVE-2025-29927 through critical security patching under time pressure",
              ],
            },
            {
              title: "Map System Development & Architecture Debt",
              client: "Major real estate group",
              highlights: [
                "Served as the technical lead, delivering complex map POI filtering interactions on tight deadlines",
                "Introduced Claude Code + MCP to the existing codebase, cutting feature POC validation from weeks to 1.5 days",
                "Led module decomposition and refactoring to address legacy architecture debt at its root",
              ],
            },
            {
              title: "Real-Time Trading Feature Development",
              client: "Vue 3 + Nuxt.js",
              highlights: [
                "Took over a Vue 3 + Nuxt 3 + Pinia project and extended real-time trading features within its established conventions",
                "Integrated TradingView Widget and ECharts for real-time prices, order-book views, and data visualization",
              ],
            },
          ],
        },
        {
          company: "TeamT5 (Cybersecurity)",
          role: "Front-End Developer (Platform & Architecture)",
          period: "Oct 2021 – Jun 2023",
          highlights: [
            "Led ThreatSonar frontend/backend separation planning and produced the technical specifications and architecture documents",
            "Migrated Firebase / Cloudinary to AWS S3 / CloudFront and Next.js, reducing cloud infrastructure costs by 90%; refactored more than 50% of the legacy codebase",
            "Built CYBERSEC 2022/2023 and InterOp23 event pages with Preact.js + Tailwind CSS, while driving remediation of vendor security issues",
          ],
        },
        {
          company: "OEC Group",
          role: "Front-End Lead",
          period: "May 2019 – Oct 2021",
          highlights: [
            "Led frontend architecture for B2B / B2C back-office systems with React Hooks, Context API, and WebSocket messaging across internal systems in 50+ countries",
            "Designed near-100-field single-page forms using Formik, Yup, and React.memo for validation and performance control",
            "Proposed GitHub Actions CI/CD in Aug 2019 and delivered a Next.js + i18n architecture for a 13-language official website within one month",
          ],
        },
      ],
      earlyCareer: {
        title: "Web Developer",
        period: "Jul 2014 – Apr 2019",
        company: "Startups: Fullinn, CatFi, myTreat, Ecowork",
        highlights: [
          "Built an SEO-focused hospitality website system with Next.js SSR; developed an OTA and order system with React / GraphQL and led REST API design conventions",
          "Built cross-platform mobile apps with React Native, Redux, and Redux-saga, integrating Firebase Push, Code Push, and WebRTC / RTMP",
          "Built testing environments and deployment workflows with Cucumber, RSpec, and Vagrant; delivered full-stack and customer-service back-office features with Rails and Angular.js",
        ],
      },
      education: {
        title: "Education",
        school: "Wenzao Ursuline University of Languages",
        degree: "B.A. Digital Content Application and Management",
        period: "Sep 2009 – Jun 2013",
      },
    },
    capabilities: {
      title: "Capabilities",
      intro: "Connecting maintainable interfaces, reliable services, and verifiable delivery workflows",
      groups: [
        {
          title: "Frontend",
          description: "Product interfaces, frontend architecture, and cross-framework delivery",
          tools: ["React", "Next.js", "TypeScript", "Redux", "Tailwind CSS", "Vue 3", "Nuxt.js"],
        },
        {
          title: "Backend",
          description: "API, background jobs, and service-side data flow design",
          tools: ["Node.js", "Fastify", "Rails", "Koa", "RESTful API", "GraphQL", "Redis", "BullMQ"],
        },
        {
          title: "Architecture & Infra",
          description: "System architecture, infrastructure, and continuous delivery",
          tools: ["Monorepo", "CI/CD", "GitHub Actions", "GitLab Runner", "Docker", "AWS"],
        },
        {
          title: "AI Workflow",
          description: "Integrating AI collaboration tools into repeatable development workflows",
          tools: ["Claude Code", "MCP", "Windsurf"],
        },
        {
          title: "Testing",
          description: "Reliable, verifiable automated testing workflows",
          tools: ["Playwright", "Jest", "Cucumber", "RSpec"],
        },
        {
          title: "Mobile",
          description: "Cross-platform mobile development and testing distribution",
          tools: ["React Native", "TestFlight"],
        },
      ],
    },
    contact: {
      title: "Let's talk about what you're building",
      lead: "Passionate about sharing perspectives; rarely the quietest person in the room",
      email: "spjay1@gmail.com",
      location: "Taipei, Taiwan",
      links: {
        email: "mailto:spjay1@gmail.com",
        github: "https://github.com/iskWang",
        zhResume: "/JoshWang_ZH_Resume.pdf",
        enResume: "/JoshWang_EN_Resume.pdf",
      },
    },
    footer: {
      builtWith: "Built with React, Vite, and a verification-first mindset",
    },
  },
};
