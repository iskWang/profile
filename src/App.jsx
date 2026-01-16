import React, { useState, useEffect } from 'react';

const TerminalLine = ({ children, delay = 0, prefix = ">" }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-emerald-400 mr-2 font-mono">{prefix}</span>
      {children}
    </div>
  );
};

const CatFace = ({ className = "", size = "text-2xl" }) => (
  <span className={`${size} ${className}`} style={{ display: 'inline-block' }}>🐱</span>
);

const FloatingCat = ({ style, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`absolute transition-all duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        ...style,
        animation: 'float 6s ease-in-out infinite',
        animationDelay: `${delay}ms`
      }}
    >
      <span className="text-4xl filter drop-shadow-lg">🐱</span>
    </div>
  );
};

const PawPrint = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="currentColor">
    <ellipse cx="12" cy="17" rx="4" ry="3.5"/>
    <circle cx="6" cy="10" r="2.5"/>
    <circle cx="18" cy="10" r="2.5"/>
    <circle cx="8.5" cy="5" r="2"/>
    <circle cx="15.5" cy="5" r="2"/>
  </svg>
);

const SkillBadge = ({ name, level = "primary" }) => {
  const colors = {
    primary: "skill-badge-emerald bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    secondary: "skill-badge-cyan bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    tertiary: "skill-badge-amber bg-amber-500/20 text-amber-300 border-amber-500/30"
  };
  
  return (
    <span className={`skill-badge px-3 py-1 rounded-full text-sm border ${colors[level]} font-mono inline-block m-1 cursor-default`}>
      {name}
    </span>
  );
};

const ExperienceCard = ({ company, role, period, highlights }) => {
  return (
    <div className="experience-card relative p-6 rounded-lg border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm cursor-default">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-xl font-semibold text-white">{role}</h3>
        <span className="text-sm text-slate-400 font-mono bg-slate-700/50 px-3 py-1 rounded">{period}</span>
      </div>
      <p className="text-emerald-400 font-medium mb-3">{company}</p>
      <ul className="space-y-2">
        {highlights.map((item, i) => (
          <li key={i} className="text-slate-300 text-sm flex items-start">
            <PawPrint className="text-amber-400/70 mr-2 mt-0.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function JoshWangProfile() {
  const [typedText, setTypedText] = useState('');
  const fullText = 'josh.init()';
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const startPosition = window.pageYOffset;
      const targetPosition = startPosition + elementPosition - headerOffset;
      const distance = targetPosition - startPosition;
      const duration = 400; // 400ms - 快速但平滑
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
      company: "擁樂數據服務",
      role: "Front-End Lead",
      period: "2025/11 - Present",
      highlights: [
        "重構 CI/CD 架構，整併 Git 分支（5→2）與 Monorepo（6→2）",
        "導入 BDD 測試框架 Cucumber + Playwright，結合 Claude MCP 自動產生測試腳本",
        "主導 CVE-2025-29927、CVE-2025-55182 安全性更新與部署修補"
      ]
    },
    {
      company: "信義房屋",
      role: "Front-End Developer",
      period: "2025/05 - 2025/09",
      highlights: [
        "設計實作「生活圈找屋」功能，支援 500m 範圍搜尋與 POI 篩選",
        "採用 Claude Code 輔助開發，一天半完成「AI 一鍵清空」功能"
      ]
    },
    {
      company: "TeamT5 杜浦數位安全",
      role: "Front-End Developer",
      period: "2021/10 - 2023/06",
      highlights: [
        "以 AWS S3/CloudFront + Next.js 取代 Firebase，降低十倍預算",
        "翻修 50%+ legacy code，導入效能檢測與自動縮圖系統",
        "開發 CYBERSEC 2022/2023 資安大會活動頁面"
      ]
    },
    {
      company: "海碩集團 鑫享科技",
      role: "Front-End Developer",
      period: "2019/05 - 2021/10",
      highlights: [
        "領導全新 IT 前端專案，覆蓋全球 50+ 國家",
        "設計單頁近百格欄位表單，使用 Formik + Yup + React.memo",
        "內部提案導入 GitHub Actions CI/CD（2019/8 首批採用者）"
      ]
    }
  ];

  const skills = {
    frontend: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "GraphQL"],
    backend: ["Node.js", "Rails", "AWS S3/CloudFront", "Docker"],
    mobile: ["React Native", "Code Push"],
    devops: ["GitHub Actions", "GitLab Runner", "CI/CD"],
    testing: ["Jest", "Cucumber", "Playwright"]
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
      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(3deg); }
          75% { transform: translateY(5px) rotate(-3deg); }
        }
        @keyframes pawWalk {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .hover-lift {
          transition: all 0.2s ease;
          transform: translateY(0);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
        }
        .experience-card {
          transition: all 0.2s ease;
          transform: translateY(0);
        }
        .experience-card:hover {
          transform: translateY(-8px);
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -4px rgba(16, 185, 129, 0.1);
        }
        .skill-badge {
          transition: all 0.2s ease;
          transform: translateY(0);
        }
        .skill-badge:hover {
          transform: translateY(-8px);
        }
        .skill-badge-emerald:hover {
          background-color: rgba(16, 185, 129, 0.3);
          border-color: rgba(52, 211, 153, 0.5);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
        }
        .skill-badge-cyan:hover {
          background-color: rgba(6, 182, 212, 0.3);
          border-color: rgba(34, 211, 238, 0.5);
          box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.2);
        }
        .skill-badge-amber:hover {
          background-color: rgba(245, 158, 11, 0.3);
          border-color: rgba(251, 191, 36, 0.5);
          box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2);
        }
        .highlight-card {
          transition: all 0.2s ease;
          transform: translateY(0);
        }
        .highlight-card:hover {
          transform: translateY(-8px);
        }
        .highlight-card-emerald:hover {
          border-color: rgba(52, 211, 153, 0.6);
          background-color: rgba(16, 185, 129, 0.15);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
        }
        .highlight-card-cyan:hover {
          border-color: rgba(34, 211, 238, 0.6);
          background-color: rgba(6, 182, 212, 0.15);
          box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.2);
        }
        .highlight-card-amber:hover {
          border-color: rgba(251, 191, 36, 0.6);
          background-color: rgba(245, 158, 11, 0.15);
          box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2);
        }
        .tag-emerald {
          transition: all 0.2s ease;
          transform: translateY(0);
        }
        .tag-emerald:hover {
          transform: translateY(-8px);
          background-color: rgba(16, 185, 129, 0.2);
          border-color: rgba(52, 211, 153, 0.5);
          box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
        }
        .tag-cyan {
          transition: all 0.2s ease;
          transform: translateY(0);
        }
        .tag-cyan:hover {
          transform: translateY(-8px);
          background-color: rgba(6, 182, 212, 0.2);
          border-color: rgba(34, 211, 238, 0.5);
          box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.2);
        }
        .tag-amber {
          transition: all 0.2s ease;
          transform: translateY(0);
        }
        .tag-amber:hover {
          transform: translateY(-8px);
          background-color: rgba(245, 158, 11, 0.2);
          border-color: rgba(251, 191, 36, 0.5);
          box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2);
        }
      `}</style>

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

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/70 border-b border-slate-700/50">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-mono text-emerald-400 flex items-center gap-2">
            <CatFace size="text-xl" />
            <span className="text-xl">~/</span>
            <span className="text-white">josh_wang</span>
            <span className="animate-pulse">_</span>
          </div>
          <div className="flex gap-6">
            {[
              { id: 'about', label: 'about' },
              { id: 'experience', label: 'experience' },
              { id: 'skills', label: 'skills' },
              { id: 'contact', label: 'contact' }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="font-mono text-sm transition-colors text-slate-400 hover:text-emerald-400"
              >
                .{section.label}()
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="about" className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl w-full">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-slate-400 text-sm font-mono">josh@taipei ~ %</span>
              <CatFace size="text-sm" className="ml-2" />
            </div>
            
            {/* Terminal content */}
            <div className="p-8 font-mono space-y-4">
              <TerminalLine delay={100}>
                <span className="text-slate-300">cat</span>
                <span className="text-cyan-400 ml-2">./profile.json</span>
              </TerminalLine>
              
              <div className="pl-6 space-y-2">
                <TerminalLine delay={300} prefix="">
                  <span className="text-slate-500">{'{'}</span>
                </TerminalLine>
                <TerminalLine delay={500} prefix="">
                  <span className="text-cyan-300 ml-4">"name"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-amber-300">"Josh Wang"</span>
                  <span className="text-slate-400">,</span>
                </TerminalLine>
                <TerminalLine delay={700} prefix="">
                  <span className="text-cyan-300 ml-4">"title"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-amber-300">"Front-End Lead / Developer"</span>
                  <span className="text-slate-400">,</span>
                </TerminalLine>
                <TerminalLine delay={900} prefix="">
                  <span className="text-cyan-300 ml-4">"experience"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-400">"10+ years"</span>
                  <span className="text-slate-400">,</span>
                </TerminalLine>
                <TerminalLine delay={1100} prefix="">
                  <span className="text-cyan-300 ml-4">"location"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-amber-300">"Taipei, Taiwan"</span>
                  <span className="text-slate-400">,</span>
                </TerminalLine>
                <TerminalLine delay={1300} prefix="">
                  <span className="text-cyan-300 ml-4">"personality"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-amber-300">"INTP 邏輯學家"</span>
                  <span className="text-slate-400">,</span>
                </TerminalLine>
                <TerminalLine delay={1500} prefix="">
                  <span className="text-cyan-300 ml-4">"pet"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-amber-300">"🐱"</span>
                </TerminalLine>
                <TerminalLine delay={1700} prefix="">
                  <span className="text-slate-500">{'}'}</span>
                </TerminalLine>
              </div>

              <TerminalLine delay={2000}>
                <span className="text-emerald-400">{typedText}</span>
                <span className="animate-pulse">▊</span>
              </TerminalLine>
            </div>
          </div>

          {/* Quick intro */}
          <div className="mt-12 text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                您好，我是 Josh!
              </span>
              <span className="ml-3 inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              專注於<span className="text-emerald-400">後台系統</span>及<span className="text-cyan-400">活動頁面</span>開發，
              擅長 CI/CD 架構優化、前端安全性及跨部門協作。
            </p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <span className="tag-cyan px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm flex items-center gap-2 cursor-default">
                <span>🤖</span> AI 工具整合
              </span>
              <span className="tag-amber px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm flex items-center gap-2 cursor-default">
                <span>📱</span> Mobile 開發
              </span>
              <span className="tag-emerald px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm flex items-center gap-2 cursor-default">
                <span>🤝</span> 跨部門與新創
              </span>
              <span className="tag-cyan px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm flex items-center gap-2 cursor-default">
                <span>🔐</span> 資安意識
              </span>
            </div>
            
            {/* CakeResume Link */}
            <div className="mt-8">
              <a 
                href="https://www.cake.me/joshwang" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-xl text-amber-300 hover:text-amber-200 hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-500/10 transition-all group"
              >
                <CatFace size="text-xl" className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">查看完整履歷 (PDF)</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-6" id="experience">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="text-emerald-400 font-mono">{'>'}</span>
            <span>工作經歷</span>
            <CatFace size="text-2xl" className="ml-2" />
          </h2>
          <p className="text-slate-400 mb-12 font-mono text-sm">// Recent positions</p>
          
          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <ExperienceCard key={i} {...exp} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm font-mono flex items-center justify-center gap-2">
              <PawPrint className="text-amber-400/50" />
              更多經歷：CatFi、myTreat、Ecowork 等新創團隊
              <PawPrint className="text-amber-400/50" />
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 px-6 bg-slate-800/30" id="skills">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="text-emerald-400 font-mono">{'>'}</span>
            <span>技能樹</span>
            <CatFace size="text-2xl" className="ml-2" />
          </h2>
          <p className="text-slate-400 mb-12 font-mono text-sm">// Tech stack overview</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-3 font-mono">
                  {'<'} Front-End {'/>'} 
                </h3>
                <div className="flex flex-wrap">
                  {skills.frontend.map((skill, i) => (
                    <SkillBadge key={i} name={skill} level="primary" />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 font-mono">
                  {'{'} Back-End {'}'}
                </h3>
                <div className="flex flex-wrap">
                  {skills.backend.map((skill, i) => (
                    <SkillBadge key={i} name={skill} level="secondary" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono flex items-center gap-2">
                  <span>📱</span> Mobile
                </h3>
                <div className="flex flex-wrap">
                  {skills.mobile.map((skill, i) => (
                    <SkillBadge key={i} name={skill} level="tertiary" />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-3 font-mono flex items-center gap-2">
                  <span>⚙️</span> DevOps & Testing
                </h3>
                <div className="flex flex-wrap">
                  {[...skills.devops, ...skills.testing].map((skill, i) => (
                    <SkillBadge key={i} name={skill} level="primary" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="text-emerald-400 font-mono">{'>'}</span>
            <span>特色亮點</span>
            <CatFace size="text-2xl" className="ml-2" />
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="highlight-card highlight-card-cyan p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 cursor-default group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">🤖</div>
              <h3 className="text-lg font-semibold mb-2">AI 工具整合</h3>
              <p className="text-slate-400 text-sm">Claude Code + Playwright MCP 自動產生測試腳本</p>
            </div>
            <div className="highlight-card highlight-card-amber p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 cursor-default group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">📱</div>
              <h3 className="text-lg font-semibold mb-2">Mobile 開發</h3>
              <p className="text-slate-400 text-sm">兩次獨立 React Native 專案，熟悉 Code Push、Firebase 推播整合</p>
            </div>
            <div className="highlight-card highlight-card-emerald p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 cursor-default group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">🤝</div>
              <h3 className="text-lg font-semibold mb-2">跨部門與新創</h3>
              <p className="text-slate-400 text-sm">與 SRE、設計師、HR、行銷協作，多間新創實戰經驗</p>
            </div>
            <div className="highlight-card highlight-card-cyan p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 cursor-default group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">🔐</div>
              <h3 className="text-lg font-semibold mb-2">資安意識</h3>
              <p className="text-slate-400 text-sm">TeamT5 經驗，考慮駭客攻擊點，預防 API/輸入框入侵</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-slate-800/30" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
            <span className="text-emerald-400 font-mono">{'>'}</span>
            <span>聯繫方式</span>
            <CatFace size="text-2xl" className="ml-2" />
          </h2>
          
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 backdrop-blur-sm inline-block">
            <div className="font-mono space-y-3 text-left">
              <p>
                <span className="text-slate-500">// Feel free to contact me 🐱</span>
              </p>
              <p>
                <span className="text-cyan-300">const</span>
                <span className="text-white ml-2">email</span>
                <span className="text-slate-400 mx-2">=</span>
                <a href="mailto:spjay1@gmail.com" className="text-amber-300 hover:text-amber-200 transition-colors">
                  "spjay1@gmail.com"
                </a>
                <span className="text-slate-400">;</span>
              </p>
              <p>
                <span className="text-cyan-300">const</span>
                <span className="text-white ml-2">location</span>
                <span className="text-slate-400 mx-2">=</span>
                <span className="text-amber-300">"Taipei, Taiwan"</span>
                <span className="text-slate-400">;</span>
              </p>
              <p>
                <span className="text-cyan-300">const</span>
                <span className="text-white ml-2">resume</span>
                <span className="text-slate-400 mx-2">=</span>
                <a href="https://www.cake.me/joshwang" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  "https://www.cake.me/joshwang"
                </a>
                <span className="text-slate-400">;</span>
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-slate-400 flex items-center justify-center gap-2">
            <CatFace size="text-lg" />
            樂於參與討論分享觀點，通常不是會議中最安靜的那位
            <CatFace size="text-lg" />
          </p>
          
          {/* CTA Button */}
          <div className="mt-8">
            <a 
              href="https://www.cake.me/joshwang" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:from-emerald-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-1 group"
            >
              <span>下載完整履歷</span>
              <CatFace size="text-xl" className="group-hover:rotate-12 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p className="font-mono flex items-center gap-2">
            © {Math.max(new Date().getFullYear(), 2026)} Josh Wang <CatFace size="text-base" />
          </p>
          <p className="font-mono">
            <span className="text-emerald-500">▸</span> Built with React
          </p>
        </div>
      </footer>
    </div>
  );
}
