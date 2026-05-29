export const CONTENT = {
  zh: {
    nav: {
      about: "關於",
      experience: "經歷",
      projects: "專案",
      skills: "技能",
      contact: "聯繫",
    },
    hero: {
      name: "Josh Wang",
      title: "Software Developer",
      experience: "10+ years",
      focus: "React / AI Workflow",
      location: "Taipei, Taiwan",
      welcome: "您好，我是 Josh!",
      description: "10+ 年軟體開發經驗，橫跨前端架構、跨平台應用與 AI 驅動的工程工作流程",
      tags: ["🤖 AI 驅動開發", "🌐 跨平台開發", "🔐 資安意識"],
      resumeBtn: "查看完整履歷 (PDF)",
      resumeUrl: "/JoshWang_ZH_Resume.pdf",
    },
    experience: {
      title: "工作經歷",
      subtitle: "// Recent positions",
      earlyExperience: "早期經歷：Fullinn、CatFi、myTreat、Ecowork 等新創團隊",
      items: [
        {
          company: "Independent",
          role: "Frontend Architect (Contract-based)",
          period: "2023/06 - 至今",
          description: "CI/CD 架構與資安深度優化 | AI 輔助開發工作流程實踐",
          subProjects: [
            {
              title: "CI/CD 架構與資安深度優化 | 數據分析新創 (SaaS)",
              highlights: [
                "主導 CI/CD 流程重構，將過度拆分的 5 個分支整併為 2 個，優化 Monorepo 結構有效降低維運負擔",
                "規劃導入自動化測試架構，結合 Claude + Playwright MCP 自動生成 Gherkin 腳本，提升驗收效率",
                "針對急迫資安風險進行 Critical Security Patching，修補 CVE-2025-29927 漏洞，強化系統安全等級",
              ],
            },
            {
              title: "核心地圖系統開發與架構債清理 | 知名房產集團",
              highlights: [
                "擔任技術主力填補開發缺口，於期限內完成地圖 POI 篩選等複雜互動功能上線",
                "導入 Claude Code AI 輔助開發模式，將特定功能 POC 驗證時間從數週縮短至 1.5 天",
                "主導舊專案模組拆解與重構，從根源解決既有架構之技術債問題",
              ],
            },
            {
              title: "AI 輔助開發工作流程實踐與 MCP 應用",
              highlights: [
                "深度實踐 Claude Code 與 MCP，建立可重複使用的 AI-assisted development workflow，提升專案迭代效率",
                "探索 Model Context Protocol (MCP) 應用，提升 AI 對專案 codebase 的協作精準度",
                "建立自動化測試流程與驗收機制 (Playwright, Jest, Cucumber)，降低 regression risk 並提升 release 穩定性",
              ],
            },
            {
              title: "即時量化交易平台建構 | Vue 3 + Nuxt.js",
              highlights: [
                "跨出 React 生態系，獨立使用 Vue 3 + Nuxt 3 + Pinia 建構具備即時交易資訊之平台",
                "整合 TradingView Widget 與 ECharts，實作即時股價、最佳五檔行情及數據視覺化",
              ],
            },
          ],
        },
        {
          company: "TeamT5 杜浦數位安全",
          role: "Front-End Developer (Platform & Architecture)",
          period: "2021/10 - 2023/06",
          highlights: [
            "ThreatSonar 產品前端架構規劃：主導前後端分離架構、頁面結構與資料流遷移方案，產出技術規格與架構設計文件",
            "官方網站架構規劃與維護：以 AWS S3/CloudFront 及 Next.js 取代 Firebase/Cloudinary，降低雲端成本 90% 並提升網站可靠性",
            "重構 50%+ legacy code，改善維護效率；實作 file-upload 系統提供自動縮圖及雲端上傳功能",
            "在 ChatGPT 初期導入爬蟲進行 SEO 測試，研究成果於例會簡報獲得高層關注",
            "CYBERSEC 2022/2023 資安大會 & InterOp23 日本活動頁面開發；發現外部廠商系統資安設計問題並推動改善",
          ],
        },
        {
          company: "海碩集團 鑫享科技 (OEC Group)",
          role: "Front-End Lead",
          period: "2019/05 - 2021/10",
          highlights: [
            "B2B/B2C 後台系統：採用 React Hooks 及 Context API 領導集團前端專案，覆蓋全球 50+ 國內部使用者",
            "設計單頁近百格欄位表單並優化驗證效能；使用 WebSocket 實作留言互動及即時通知功能",
            "於 2019/08 提案導入 GitHub Actions CI/CD 流程，為內部早期採用者",
            "官方網站改版 / 前端成員內部訓練：接手外部廠商原始 HTML/CSS，於一個月內完成 Next.js + i18n 13 語系架構",
            "推動 Pull Request Code Review 機制，提升 code 可讀性及確保需求一致性",
          ],
        },
      ],
    },
    skills: {
      title: "技能樹",
      subtitle: "// Tech stack overview",
      categories: {
        frontend: "Front-End",
        backend: "Back-End",
        ai: "AI Workflow",
        mobile: "Mobile",
        testing: "Architecture & Infra",
        testing_extra: "Testing",
      },
    },
    contact: {
      title: "聯繫方式",
      subtitle: "// Feel free to contact me 🐱",
      quote: "樂於參與討論分享觀點，通常不是會議中最安靜的那位",
      downloadBtn: "下載完整履歷",
    },
    highlights: {
      title: "特色亮點",
      items: [
        {
          emoji: "🚀",
          title: "雲端維運優化",
          description: "降低雲端成本 90%，建置 13 語系網站架構，支援全球 50+ 國系統",
          color: "cyan",
        },
        {
          emoji: "🤖",
          title: "AI 協作實踐",
          description: "熟練 Claude Code & MCP，將 POC 驗證從數週縮短至 1.5 天",
          color: "amber",
        },
        {
          emoji: "⚙️",
          title: "CI/CD 與品質",
          description: "主導分支重構優化維運負擔，自動化測試提升驗收效率",
          color: "emerald",
        },
        {
          emoji: "🔐",
          title: "資安與防禦",
          description: "修補 CVE-2025-29927 關鍵漏洞，落實安全性 Patching",
          color: "cyan",
        },
      ],
    },
    projects: {
      title: "個人專案",
      subtitle: "// Side projects & Open source",
      items: [
        {
          title: "PickleScout — LLM 驅動的 E2E 測試自動生成工具",
          url: "https://github.com/iskWang/PickleScout",
          tags: ["AI Agent", "E2E Testing", "LLM", "Open Source"],
          highlights: [
            "設計自動化測試生成流程: 僅用 URL 網址輸入，自動分析使用者操作流程並產生 Gherkin 測試案例與 Playwright 測試腳本",
            "於一週內完成 E2E 測試自動化工具 POC，整合 Playwright、LLM 與 Browser Automation Workflow",
            "建立測試自我修復機制 (Self-healing): 測試失敗時自動修正 selector 與 timeout 後重新執行，提高測試穩定性",
            "採用 React/Vite、Fastify、BullMQ、Redis 與 Docker Compose 建構全端 Monorepo 架構",
            "支援 CI/CD 與 GitHub Actions 整合，產生之測試腳本可獨立執行，無需依賴 LLM Runtime",
          ],
        },
      ],
    },
    skillsData: {
      frontend: [
        "React",
        "Next.js",
        "TypeScript",
        "Redux",
        "GraphQL",
        "Tailwind CSS",
        "Vue 3",
        "Nuxt.js",
      ],
      backend: ["Node.js", "Rails", "Koa"],
      devops: [
        "monorepo",
        "CI/CD",
        "GitHub Actions",
        "GitLab Runner",
        "AWS",
        "Docker",
      ],
      ai: ["Claude Code", "MCP", "Playwright", "Windsurf"],
      mobile: ["React Native", "Code Push", "Fabric", "TestFlight"],
      testing: ["Jest", "Cucumber", "RSpec"],
    },
  },
  en: {
    nav: {
      about: "about",
      experience: "experience",
      projects: "projects",
      skills: "skills",
      contact: "contact",
    },
    hero: {
      name: "Josh Wang",
      title: "Software Developer",
      experience: "10+ years",
      focus: "React / AI Workflow",
      location: "Taipei, Taiwan",
      welcome: "Hi, I'm Josh!",
      description:
        "Senior Developer driving front-end, cross-platform & AI workflows.",
      tags: [
        "🤖 AI-Driven Development",
        "🌐 Cross-platform",
        "🔐 Security Awareness",
      ],
      resumeBtn: "View Full Resume (PDF)",
      resumeUrl: "/JoshWang_EN_Resume.pdf",
    },
    experience: {
      title: "Experience",
      subtitle: "// Recent positions",
      earlyExperience:
        "Early experience: Startups including Fullinn, CatFi, myTreat, Ecowork, etc.",
      items: [
        {
          company: "Independent",
          role: "Frontend Architect (Contract-based)",
          period: "Jun 2023 - Present",
          description:
            "CI/CD Architecture & Security | AI-Assisted Engineering Workflow",
          subProjects: [
            {
              title:
                "CI/CD Architecture & Security | Data Analytics SaaS Startup",
              highlights: [
                "Restructured CI/CD pipeline from 5 fragmented branches to 2, optimizing monorepo structure and reducing operational overhead.",
                "Planned and integrated automated testing architecture with Claude + Playwright MCP for Gherkin script generation, improving QA efficiency.",
                "Performed critical security patching under time pressure, resolving CVE-2025-29927 and strengthening system security posture.",
              ],
            },
            {
              title:
                "Map System Development & Tech Debt Cleanup | Major Real Estate Group",
              highlights: [
                "Served as technical lead to fill development gaps, delivering complex map POI filtering features on tight deadlines.",
                "Adopted Claude Code AI-assisted development, reducing POC validation from weeks to 1.5 days.",
                "Led systematic module decomposition and refactoring to resolve legacy architectural debt at the root.",
              ],
            },
            {
              title: "AI-Assisted Engineering Workflow & MCP",
              highlights: [
                "Built reusable AI-assisted development workflows with Claude Code and MCP, accelerating project iteration cycles.",
                "Explored Model Context Protocol (MCP) applications to improve AI collaboration accuracy across large codebases.",
                "Established automated testing and acceptance pipelines (Playwright, Jest, Cucumber), reducing regression risk and improving release stability.",
              ],
            },
            {
              title: "Real-time Trading Platform | Vue 3 + Nuxt.js",
              highlights: [
                "Built a real-time trading platform with Vue 3 / Nuxt 3 / Pinia, order book visualization, and data analytics.",
                "Integrated TradingView Widget and ECharts for real-time price feeds and data visualization.",
              ],
            },
          ],
        },
        {
          company: "TeamT5 (Cybersecurity)",
          role: "Front-End Developer (Platform & Architecture)",
          period: "Oct 2021 - Jun 2023",
          highlights: [
            "ThreatSonar Product — Frontend Architecture Planning: Led architecture planning for frontend/backend separation; produced technical specifications and design documents.",
            "Official Website: Led cloud architecture migration from Firebase/Cloudinary to AWS S3/CloudFront + Next.js, reducing cloud costs by 90% and improving reliability.",
            "Refactored 50%+ legacy codebase, improving maintainability; implemented file-upload system with AWS SDK / TypeScript / Pica.js.",
            "Conducted early ChatGPT-powered SEO crawler testing; findings presented to and recognized by executive team.",
            "CYBERSEC 2022/2023 & InterOp23 Event Pages: Built event pages with Preact.js + Tailwind CSS; identified and drove remediation for auth design flaws.",
          ],
        },
        {
          company: "OEC Group",
          role: "Front-End Lead",
          period: "May 2019 - Oct 2021",
          highlights: [
            "B2B/B2C Back-office System: Led frontend rebuild using React Hooks and Context API, covering internal systems across 50+ countries.",
            "Designed 100-field single-page forms using Formik / Yup / React.memo with strict validation; implemented real-time messaging via WebSockets.",
            "Proposed and adopted GitHub Actions CI/CD pipeline as an early adopter upon its launch in Aug 2019.",
            "Website Redesign / Internal Training: Completed Next.js + i18n architecture (13 languages) within one month.",
            "Led Pull Request Code Review culture to improve code quality and ensure requirement alignment.",
          ],
        },
      ],
    },
    skills: {
      title: "Skill Tree",
      subtitle: "// Tech stack overview",
      categories: {
        frontend: "Front-End",
        backend: "Back-End",
        ai: "AI Workflow",
        mobile: "Mobile",
        testing: "Architecture & Infra",
        testing_extra: "Testing",
      },
    },
    contact: {
      title: "Contact Me",
      subtitle: "// Feel free to contact me 🐱",
      quote:
        "Passionate about sharing perspectives; rarely the quietest one in the room.",
      downloadBtn: "Download Full Resume",
    },
    highlights: {
      title: "Highlights",
      items: [
        {
          emoji: "🚀",
          title: "Cloud Ops Optimization",
          description:
            "Reduced cloud costs by 90% and built 13-language site architectures across 50+ countries.",
          color: "cyan",
        },
        {
          emoji: "🤖",
          title: "AI Collaboration",
          description:
            "Expert in Claude Code & MCP, shortening POC validation from weeks to 1.5 days.",
          color: "amber",
        },
        {
          emoji: "⚙️",
          title: "CI/CD & Quality",
          description:
            "Led branch restructuring (5 to 2) and used automation to improve efficiency.",
          color: "emerald",
        },
        {
          emoji: "🔐",
          title: "Security & Defense",
          description:
            "Patched CVE-2025-29927 critical vulnerability and improved system security posture.",
          color: "cyan",
        },
      ],
    },
    projects: {
      title: "Projects",
      subtitle: "// Side projects & Open source",
      items: [
        {
          title: "PickleScout — LLM-Driven E2E Test Generation Agent",
          url: "https://github.com/iskWang/PickleScout",
          tags: ["AI Agent", "E2E Testing", "LLM", "Open Source"],
          highlights: [
            "Designed and developed an automated test generation workflow that analyzes user journeys solely from a URL input to automatically generate Gherkin test cases and Playwright test scripts.",
            "Built and delivered an E2E test automation tool POC within one week, integrating Playwright, LLMs, and browser automation workflows.",
            "Implemented a self-healing mechanism for tests that automatically corrects selectors and timeouts upon failure and re-executes, significantly improving test stability.",
            "Constructed a full-stack monorepo architecture utilizing React/Vite, Fastify, BullMQ, Redis, and Docker Compose.",
            "Integrated CI/CD pipelines with GitHub Actions, ensuring generated test scripts can be executed independently without requiring an LLM runtime.",
          ],
        },
      ],
    },
    skillsData: {
      frontend: [
        "React",
        "Next.js",
        "TypeScript",
        "Redux",
        "GraphQL",
        "Tailwind CSS",
        "Vue 3",
        "Nuxt.js",
      ],
      backend: ["Node.js", "Rails", "Koa"],
      devops: [
        "monorepo",
        "CI/CD",
        "GitHub Actions",
        "GitLab Runner",
        "AWS",
        "Docker",
      ],
      ai: ["Claude Code", "MCP", "Playwright", "Windsurf"],
      mobile: ["React Native", "Code Push", "Fabric", "TestFlight"],
      testing: ["Jest", "Cucumber", "RSpec"],
    },
  },
};
