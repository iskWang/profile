export const CONTENT = {
  zh: {
    nav: {
      about: '關於',
      experience: '經歷',
      skills: '技能',
      contact: '聯繫'
    },
    hero: {
      name: "Josh Wang",
      title: "Software Developer",
      experience: "10+ years",
      focus: "React / AI Workflow",
      location: "Taipei, Taiwan",
      welcome: "您好，我是 Josh!",
      description: "專注於 React / Next.js 架構設計、AI 開發流程整合與快速交付的軟體開發者。",
      tags: ["🤖 AI 驅動開發", "🌐 跨平台開發", "🔐 資安意識"],
      resumeBtn: "查看完整履歷 (PDF)",
      resumeUrl: "/JoshWang_ZH_Resume.pdf"
    },
    experience: {
      title: "工作經歷",
      subtitle: "// Recent positions",
      earlyExperience: "早期經歷：Fullinn、CatFi、myTreat、Ecowork 等新創團隊",
      items: [
        {
          company: "Independent",
          role: "Front-End Technical Consultant (專案合作制)",
          period: "2023/06 - Current",
          description: "AI Workflow 整合 | CI/CD 架構與資安深度優化",
          subProjects: [
            {
              title: "⭐⭐⭐ PickleScout | LLM-driven Browser Agent (Open Source) - GitHub",
              url: "https://github.com/iskWang/PickleScout",
              highlights: [
                "開發基於 LLM 的自動化瀏覽器代理，自動探索 Web App 並生成 ready-to-run 的 Cucumber.js + Playwright 測試套件",
                "整合 Stagehand 進行瀏覽器自動化，利用 LLM 實作 Self-healing 選擇器與 Gherkin 腳本自動生成",
                "後端架構採用 Fastify 結合 Redis/BullMQ 處理異步任務隊列，優化大規模網頁探索效能"
              ]
            },
            {
              title: "CI/CD 架構與資安深度優化 | 數據分析新創 (SaaS)",
              highlights: [
                "主導 CI/CD 流程重構，將過度拆分的 5 個分支整併為 2 個，優化 Monorepo 結構有效降低維運負擔",
                "規劃導入自動化測試架構，結合 Claude + Playwright MCP 自動生成 Gherkin 腳本，提升驗收效率",
                "針對急迫資安風險進行 Critical Security Patching，修補 CVE-2025-29927 漏洞，強化系統安全等級"
              ]
            },
            {
              title: "核心地圖系統開發與架構債清理 | 知名房產集團",
              highlights: [
                "擔任技術主力填補開發缺口，於期限內完成地圖 POI 篩選等複雜互動功能上線",
                "導入 Claude Code AI 輔助開發模式，於 1.5 天內快速完成特定功能的 POC 驗證與初期實作",
                "主導舊專案模組拆解與重構，從根源解決既有架構之技術債問題"
              ]
            },
            {
              title: "Vibe Coding 模式實踐與 MCP 應用研究",
              highlights: [
                "深度研究並實踐 Vibe Coding，熟練運用 Windsurf 與 Claude Code 進行開發，縮短 POC 驗證時間",
                "探索 Model Context Protocol (MCP) 應用，提升 AI 對專案 codebase 的協作效率"
              ]
            }
          ]
        },
        {
          company: "TeamT5 杜浦數位安全",
          role: "Front-End Developer",
          period: "2021/10 - 2023/06",
          highlights: [
            "以 AWS S3/CloudFront + Next.js 取代 Firebase/Cloudinary，降低十倍預算及提升網站可靠性",
            "翻修 50%+ legacy code，使用 AWS SDK/TypeScript/Pica.js 實作自動縮圖系統",
            "開發 CYBERSEC 2022/2023 資安大會活動頁面（Svelte、Preact.js + Tailwind CSS）",
            "外部廠商系統資安問題反映: 密碼明碼傳輸及登入權限設計問題"
          ]
        },
        {
          company: "海碩集團 鑫享科技 (OEC Group)",
          role: "Front-End Developer",
          period: "2019/05 - 2021/10",
          highlights: [
            "採用 React Hook + Context API，領導集團全新 IT 前端專案，覆蓋全球 50+ 國家",
            "設計單頁近百格欄位表單，使用 Formik + Yup + React.memo 確保驗證和效能",
            "使用 WebSocket 實作留言互動及即時通知功能",
            "內部提案使用 GitHub Actions 建置 CI/CD 流程（2019/8 首批採用者）"
          ]
        }
      ]
    },
    skills: {
      title: "技能樹",
      subtitle: "// Tech stack overview",
      categories: {
        frontend: "Front-End",
        backend: "Back-End & DevOps",
        ai: "AI Workflow",
        mobile: "Mobile",
        testing: "CI/CD & Testing"
      }
    },
    contact: {
      title: "聯繫方式",
      subtitle: "// Feel free to contact me 🐱",
      quote: "樂於參與討論分享觀點，通常不是會議中最安靜的那位",
      downloadBtn: "下載完整履歷"
    },
    highlights: {
      title: "特色亮點",
      items: [
        {
          emoji: "🚀",
          title: "雲端維運優化",
          description: "降低雲端基礎設施成本 90%，建置 13 語系網站架構",
          color: "cyan"
        },
        {
          emoji: "🤖",
          title: "AI 協作實踐",
          description: "熟練 Claude Code & MCP，將 POC 驗證縮短至 1.5 天",
          color: "amber"
        },
        {
          emoji: "⚙️",
          title: "CI/CD 與品質",
          description: "主導分支重構優化維運負擔，自動化測試提升驗收效率",
          color: "emerald"
        },
        {
          emoji: "🔐",
          title: "資安與防禦",
          description: "修補 CVE-2025-29927 關鍵漏洞，落實安全性 Patching",
          color: "cyan"
        }
      ]
    },
    skillsData: {
      frontend: ["React.js/Next.js", "TypeScript", "Redux", "Tailwind CSS", "Sass", "GraphQL", "Vue.js/Nuxt.js"],
      backend: ["Node.js", "Fastify", "Redis", "BullMQ", "AWS (S3, CloudFront)", "Docker"],
      devops: ["GitHub Actions", "GitLab Runner", "Jest", "Cucumber"],
      mobile: ["React Native", "Code Push", "Fabric", "TestFlight"],
      ai: ["Claude Code", "MCP", "Stagehand (Browser Agent)", "Playwright", "Windsurf"]
    }
  },
  en: {
    nav: {
      about: 'about',
      experience: 'experience',
      skills: 'skills',
      contact: 'contact'
    },
    hero: {
      name: "Josh Wang",
      title: "Software Developer",
      experience: "10+ years",
      focus: "React / AI Workflow",
      location: "Taipei, Taiwan",
      welcome: "Hi, I'm Josh!",
      description: "A software developer focusing on React / Next.js architecture, AI workflow integration, and rapid delivery.",
      tags: ["🤖 AI-Driven Development", "🌐 Cross-platform", "🔐 Security Awareness"],
      resumeBtn: "View Full Resume (PDF)",
      resumeUrl: "/JoshWang_EN_Resume.pdf"
    },
    experience: {
      title: "Experience",
      subtitle: "// Recent positions",
      earlyExperience: "Early experience: Startups including Fullinn, CatFi, myTreat, Ecowork, etc.",
      items: [
        {
          company: "Independent",
          role: "Front-End Technical Consultant (Project-based)",
          period: "2023/06 - Current",
          description: "AI Workflow Integration | CI/CD Architecture & Security Optimization",
          subProjects: [
            {
              title: "⭐⭐⭐ PickleScout | LLM-driven Browser Agent (Open Source) - GitHub",
              url: "https://github.com/iskWang/PickleScout",
              highlights: [
                "Developed an LLM-driven autonomous browser agent that explores web apps and generates ready-to-run Cucumber.js + Playwright test suites.",
                "Integrated Stagehand for browser automation, utilizing LLMs for self-healing selectors and automated Gherkin script generation.",
                "Architected the backend with Fastify, Redis, and BullMQ to handle asynchronous job queues and optimize web exploration performance."
              ]
            },
            {
              title: "CI/CD Architecture & Security Optimization | Data Analytics Startup (SaaS)",
              highlights: [
                "Led CI/CD workflow restructuring, consolidating 5 branches into 2 and optimizing Monorepo structure to reduce maintenance burden.",
                "Planned and implemented automated testing architecture, integrating Claude + Playwright MCP to auto-generate Gherkin scripts, improving efficiency.",
                "Addressed critical security risks with patches, fixing CVE-2025-29927 and enhancing system security."
              ]
            },
            {
              title: "Core Map System & Tech Debt Cleanup | Famous Real Estate Group",
              highlights: [
                "Acted as lead developer to fill gaps, launching complex interactive features like map POI filtering on schedule.",
                "Adopted Claude Code AI-assisted development mode, completing POC and initial implementation within 1.5 days.",
                "Led legacy module decomposition and refactoring to resolve architectural technical debt at its source."
              ]
            },
            {
              title: "Vibe Coding Practice & MCP Research",
              highlights: [
                "Researched and practiced Vibe Coding, using Windsurf and Claude Code to accelerate POC verification.",
                "Explored Model Context Protocol (MCP) applications to improve AI collaboration efficiency within the codebase."
              ]
            }
          ]
        },
        {
          company: "TeamT5 Cyber Security",
          role: "Front-End Developer",
          period: "2021/10 - 2023/06",
          highlights: [
            "Replaced Firebase/Cloudinary with AWS S3/CloudFront + Next.js, reducing budget by 10x while improving reliability.",
            "Refactored 50%+ legacy code, implementing an auto-thumbnail system using AWS SDK/TypeScript/Pica.js.",
            "Developed CYBERSEC 2022/2023 security conference event pages (Svelte, Preact.js + Tailwind CSS).",
            "Identified and reported security issues in external vendor systems: plaintext password transmission and login permission flaws."
          ]
        },
        {
          company: "OEC Group",
          role: "Front-End Developer",
          period: "2019/05 - 2021/10",
          highlights: [
            "Led new group IT projects using React Hook + Context API, covering 50+ countries worldwide.",
            "Designed complex forms with nearly 100 fields, ensuring validation and performance with Formik + Yup + React.memo.",
            "Implemented real-time chat and notification features using WebSockets.",
            "Proposed and implemented CI/CD workflows using GitHub Actions (Early adopter in 2019/8)."
          ]
        }
      ]
    },
    skills: {
      title: "Skill Tree",
      subtitle: "// Tech stack overview",
      categories: {
        frontend: "Front-End",
        backend: "Back-End & DevOps",
        ai: "AI Workflow",
        mobile: "Mobile",
        testing: "CI/CD & Testing"
      }
    },
    contact: {
      title: "Contact Me",
      subtitle: "// Feel free to contact me 🐱",
      quote: "Passionate about sharing perspectives; rarely the quietest one in the room.",
      downloadBtn: "Download Full Resume"
    },
    highlights: {
      title: "Highlights",
      items: [
        {
          emoji: "🚀",
          title: "Cloud Ops Optimization",
          description: "Reduced infrastructure costs by 90% and built 13-language site architectures.",
          color: "cyan"
        },
        {
          emoji: "🤖",
          title: "AI Collaboration",
          description: "Expert in Claude Code & MCP, shortening POC verification to 1.5 days.",
          color: "amber"
        },
        {
          emoji: "⚙️",
          title: "CI/CD & Quality",
          description: "Led branch restructuring to reduce maintenance and used automation to improve efficiency.",
          color: "emerald"
        },
        {
          emoji: "🔐",
          title: "Security & Defense",
          description: "Patched CVE-2025-29927 critical vulnerability and implemented security patching.",
          color: "cyan"
        }
      ]
    },
    skillsData: {
      frontend: ["React.js/Next.js", "TypeScript", "Redux", "Tailwind CSS", "Sass", "GraphQL", "Vue.js/Nuxt.js"],
      backend: ["Node.js", "Fastify", "Redis", "BullMQ", "AWS (S3, CloudFront)", "Docker"],
      devops: ["GitHub Actions", "GitLab Runner", "Jest", "Cucumber"],
      mobile: ["React Native", "Code Push", "Fabric", "TestFlight"],
      ai: ["Claude Code", "MCP", "Stagehand (Browser Agent)", "Playwright", "Windsurf"]
    }
  }
};
