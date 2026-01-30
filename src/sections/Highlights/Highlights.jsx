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
  );
};

export default Highlights;
