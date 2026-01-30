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
      company: "Independent / Project-based",
      role: "Senior Front-End Technical Consultant",
      period: "2023/06 - Current",
      description: "專精於舊有程式碼重構 (Legacy Code Refactoring)、AI 工作流整合，以及組織轉型期間的系統穩定化",
      subProjects: [
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
            "深度研究並實踐 Vibe Coding，熟練運用 Windsurf 與 Claude Code 進行開發縮短 POC 驗證時間",
            "探索 Model Context Protocol (MCP) 應用，提升 AI 對專案代碼庫的協作效率"
          ]
        },
        {
          title: "生成式 AI 工具鏈整合 (SD & ComfyUI)",
          highlights: [
            "架設 Stable Diffusion (A1111) 與 ComfyUI 工作流，研究本機端或雲端 (Runpod) 圖像生成邏輯，並探索整合至前端應用之可能性"
          ]
        },
        {
          title: "即時量化交易平台建構 | Vue 3 + Nuxt.js",
          highlights: [
            "跨出 React 生態系，獨立使用 Vue 3 + Nuxt 3 + Pinia 建構具備即時交易資訊之平台",
            "整合 TradingView Widget 與 ECharts，實作即時股價、最佳五檔行情及數據視覺化",
            "優化既有系統框架之資料存取邏輯，確保使用者權限與數據安全之嚴密性"
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
      company: "海碩集團 鑫享科技",
      role: "Front-End Developer",
      period: "2019/05 - 2021/10",
      highlights: [
        "採用 React Hook + Context API，領導集團全新 IT 前端專案，覆蓋全球 50+ 國家",
        "設計單頁近百格欄位表單，使用 Formik + Yup + React.memo 確保驗證和效能",
        "使用 WebSocket 實作留言互動及即時通知功能",
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
      <FloatingCat style={{ top: '15%', right: '10%' }} delay={500} className="hidden sm:block" />
      <FloatingCat style={{ top: '60%', left: '5%' }} delay={1500} className="hidden sm:block" />
      <FloatingCat style={{ bottom: '20%', right: '15%' }} delay={2500} className="hidden sm:block" />

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
