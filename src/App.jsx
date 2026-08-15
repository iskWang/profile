import React, { useEffect } from 'react';
import { useLanguage } from './context/useLanguage';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCat from './components/common/FloatingCat';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

export default function JoshWangProfile() {
  const { content } = useLanguage();

  useEffect(() => {
    const hero = document.querySelector('#about');
    if (hero) hero.classList.add('section-visible');

    const sections = document.querySelectorAll('main section:not(#about)');
    sections.forEach(s => s.classList.add('section-animate'));

    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.05 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-paper text-ink overflow-x-hidden">
      {/* Single floating mascot detail */}
      <FloatingCat style={{ top: '15%', right: '10%' }} className="hidden sm:block" />

      <Header scrollToSection={scrollToSection} />

      <main>
        <Hero />
        <Projects projects={content.projects.items} />
        <Skills skills={content.skillsData} />
        <Experience experiences={content.experience.items} />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
