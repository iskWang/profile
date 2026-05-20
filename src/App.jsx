import React from 'react';
import { useLanguage } from './context/useLanguage';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCat from './components/common/FloatingCat';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Highlights from './sections/Highlights';
import Contact from './sections/Contact';

export default function JoshWangProfile() {
  const { content } = useLanguage();

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
        <Experience experiences={content.experience.items} />
        <Projects projects={content.projects.items} />
        <Skills skills={content.skillsData} />
        <Highlights />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
