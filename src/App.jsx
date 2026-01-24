import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCat from './components/common/FloatingCat';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Highlights from './sections/Highlights';
import Contact from './sections/Contact';

export default function JoshWangProfile() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 640;
      const headerOffset = isMobile ? 128 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const startPosition = window.pageYOffset;
      const targetPosition = startPosition + elementPosition - headerOffset;
      const distance = targetPosition - startPosition;
      const duration = 400;
      let startTime = null;
      
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      
      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easeProgress);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };
      
      requestAnimationFrame(animation);
    }
  };

  const experiences = [
    {
      company: "專案導向",
      role: "資深前端技術顧問",
      period: "2023/06 - Current",
      subProjects: [
        {
          title: "數據分析新創 (SaaS)",
          period: "2025/11 – 2026/01",
          highlights: [
            "主導 CI/CD 流程重構，整併 Git 分支（5→2）與 Monorepo 結構優化",
            "規劃導入自動化測試架構，利用 Claude + Playwright MCP 自動生成 Gherkin 腳本",
            "負責資安弱點修補（CVE-2025-29927 等）及安全性更新"
          ]
        },
        {
          title: "知名房產集團",
          period: "2025/05 – 2025/09",
          highlights: [
            "負責集團核心產品之地圖功能開發，實作選定範圍搜尋與多種 POI 篩選互動",
            "導入 AI 輔助開發模式（Claude Code），一天半內完成特定功能驗證與初期實作",
            "協助舊專案模組拆解與程式碼重構，解決既有架構之技術債"
          ]
        },
        {
          title: "獨立開發者：AI 應用與前端技術研究",
          period: "2023/06 – 2025/05",
          highlights: [
            "深度研究 Vibe Coding 模式，熟練運用 Windsurf 與 Claude Code 輔助開發",
            "探索 MCP 應用，串接不同開發工具與 Context，提升 AI 協作效率",
            "架設 SD A1111 與 ComfyUI Workflow，研究本機端圖像生成",
            "使用 Vue 3 + Nuxt.js + Pinia 獨立建構即時交易資訊平台"
          ]
        }
      ]
    },
    {
      company: "TeamT5 杜浦數位安全",
      role: "Front-End Developer",
      period: "2021/10 - 2023/06",
      highlights: [
        "以 AWS S3/CloudFront + Next.js 取代 Firebase/Cloudinary，降低十倍預算",
        "翻修 50%+ legacy code，導入效能檢測與自動縮圖系統",
        "開發 CYBERSEC 2022/2023 資安大會活動頁面（Svelte、Preact.js）"
      ]
    },
    {
      company: "海碩集團 鑫享科技",
      role: "Front-End Developer",
      period: "2019/05 - 2021/10",
      highlights: [
        "採用 React Hook + Context API，領導集團全新 IT 前端專案，覆蓋全球 50+ 國家",
        "設計單頁近百格欄位表單，使用 Formik + Yup + React.memo",
        "內部提案使用 GitHub Actions 建置 CI/CD 流程（2019/8 首批採用者）"
      ]
    },
    {
      company: "Fullinn 滿房寶房宿系統（新創）",
      role: "Front-End Developer",
      period: "2017/12 - 2019/04",
      highlights: [
        "協助轉移 Redux + Reducer 到 Apollo 2.0，使用 React.js 及 GraphQL 開發",
        "協助 React Native 實作，引入 Firebase Push + Code Push",
        "領導前端架構設計，以 Next.js 開發 SEO 友善的民宿官網系統"
      ]
    }
  ];

  const skills = {
    frontend: ["React.js/Next.js", "TypeScript", "React Context", "Redux", "Tailwind.css", "Sass", "GraphQL", "Vue.js/Nuxt.js"],
    backend: ["Node.js", "Koa", "Rails", "AWS (S3, CloudFront)"],
    devops: ["Docker", "GitHub Actions", "GitLab Runner"],
    mobile: ["React Native", "Code Push", "Fabric", "TestFlight"],
    testing: ["Jest", "Cucumber", "Jenkins"]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden" style={{
      backgroundImage: `
        radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%),
        linear-gradient(to bottom, #0f172a, #1e293b)
      `
    }}>
      {/* Animated grid background with paw prints */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating cats */}
      <FloatingCat style={{ top: '15%', right: '10%' }} delay={500} />
      <FloatingCat style={{ top: '60%', left: '5%' }} delay={1500} />
      <FloatingCat style={{ bottom: '20%', right: '15%' }} delay={2500} />

      <Header scrollToSection={scrollToSection} />

      <main>
        <Hero />
        <Experience experiences={experiences} />
        <Skills skills={skills} />
        <Highlights />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
