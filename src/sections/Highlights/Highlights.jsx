import React from 'react';
import { CatFace } from '../../components/common';

const Highlights = () => {
  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
          <span className="text-emerald-400 font-mono">{'>'}</span>
          <span>特色亮點</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="highlight-card highlight-card-cyan p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 cursor-default group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">🚀</div>
            <h3 className="text-lg font-semibold mb-2">雲端維運優化</h3>
            <p className="text-slate-400 text-sm">降低雲端基礎設施成本 90%，建置 13 語系網站架構</p>
          </div>
          <div className="highlight-card highlight-card-amber p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 cursor-default group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI 協作實踐</h3>
            <p className="text-slate-400 text-sm">熟練 Claude Code & MCP，將 POC 驗證縮短至 1.5 天</p>
          </div>
          <div className="highlight-card highlight-card-emerald p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 cursor-default group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">⚙️</div>
            <h3 className="text-lg font-semibold mb-2">CI/CD 與品質</h3>
            <p className="text-slate-400 text-sm">主導分支重構優化維運負擔，自動化測試提升驗收效率</p>
          </div>
          <div className="highlight-card highlight-card-cyan p-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 cursor-default group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">🔐</div>
            <h3 className="text-lg font-semibold mb-2">資安與防禦</h3>
            <p className="text-slate-400 text-sm">修補 CVE-2025-29927 關鍵漏洞，落實安全性 Patching</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
