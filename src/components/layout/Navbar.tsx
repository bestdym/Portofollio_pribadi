import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]['id'];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

  useEffect(() => {
    let rafId = 0;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Jika sudah mendekati paling bawah halaman, aktifkan section terakhir (Contact)
      if (scrollY + viewportHeight >= docHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const triggerPoint = viewportHeight * 0.35;
      let current: SectionId = 'hero';

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
          current = item.id;
        }
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[94vw] rounded-full bg-white/55 backdrop-blur-xl border border-white/80 ring-1 ring-neutral-900/[0.07] shadow-[0_12px_36px_rgba(0,0,0,0.07),inset_0_1px_1px_rgba(255,255,255,0.95)] p-1.5"
    >
      <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative px-3.5 sm:px-5 py-2 rounded-full transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'text-neutral-950 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeNavPill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-b from-white/95 via-neutral-100/75 to-neutral-200/55 backdrop-blur-md border border-white/90 ring-1 ring-neutral-900/[0.08] shadow-[0_4px_14px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                  <span className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
                </motion.span>
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
