import React from 'react';
import { CatFace } from '../../components/common';

const Contact = () => {
  return (
    <section className="pt-32 sm:pt-24 pb-24 px-6 bg-slate-800/30" id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
          <span className="text-emerald-400 font-mono">{'>'}</span>
          <span>聯繫方式</span>
          <CatFace size="text-2xl" className="ml-2" />
        </h2>
        
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 sm:p-8 backdrop-blur-sm inline-block max-w-full overflow-hidden">
          <div className="font-mono space-y-3 text-left overflow-x-auto custom-scrollbar text-xs sm:text-sm md:text-base">
            <p className="whitespace-nowrap">
              <span className="text-slate-500">// Feel free to contact me 🐱</span>
            </p>
            <p className="flex flex-wrap items-center">
              <span className="text-cyan-300">const</span>
              <span className="text-white ml-2">email</span>
              <span className="text-slate-400 mx-1 sm:mx-2">=</span>
              <a href="mailto:spjay1@gmail.com" className="text-amber-300 hover:text-amber-200 transition-colors break-all">
                "spjay1@gmail.com"
              </a>
              <span className="text-slate-400">;</span>
            </p>
            <p className="flex flex-wrap items-center">
              <span className="text-cyan-300">const</span>
              <span className="text-white ml-2">location</span>
              <span className="text-slate-400 mx-1 sm:mx-2">=</span>
              <span className="text-amber-300">"Taipei, Taiwan"</span>
              <span className="text-slate-400">;</span>
            </p>
            <p className="flex flex-wrap items-center">
              <span className="text-cyan-300">const</span>
              <span className="text-white ml-2">resume</span>
              <span className="text-slate-400 mx-1 sm:mx-2">=</span>
              <a href="https://www.cake.me/joshwang" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors break-all">
                "https://www.cake.me/joshwang"
              </a>
              <span className="text-slate-400">;</span>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-slate-400 flex items-center justify-center gap-2 px-4 italic sm:not-italic">
          <CatFace size="text-lg" className="flex-shrink-0" />
          <span className="text-xs sm:text-sm md:text-base">樂於參與討論分享觀點，通常不是會議中最安靜的那位</span>
          <CatFace size="text-lg" className="flex-shrink-0" />
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
  );
};

export default Contact;
