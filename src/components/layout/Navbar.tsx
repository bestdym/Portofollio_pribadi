import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl rounded-full bg-white/85 backdrop-blur-md border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.05)] py-2.5 px-5 sm:px-6 flex items-center justify-between"
    >
      <button
        onClick={() => scrollTo('hero')}
        className="font-bold text-neutral-950 text-xl tracking-tight cursor-pointer"
      >
        A<span className="text-neutral-400">.</span>
      </button>

      <div className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-medium text-neutral-500">
        <button
          onClick={() => scrollTo('blog')}
          className="hover:text-neutral-950 transition-colors cursor-pointer"
        >
          Blog
        </button>
        <button
          onClick={() => scrollTo('projects')}
          className="hover:text-neutral-950 transition-colors cursor-pointer"
        >
          Projects
        </button>
        <button
          onClick={() => scrollTo('skills')}
          className="hover:text-neutral-950 transition-colors cursor-pointer"
        >
          Skills
        </button>
        <button
          onClick={() => scrollTo('contact')}
          className="hover:text-neutral-950 transition-colors cursor-pointer"
        >
          Contact
        </button>
      </div>

      <button
        onClick={() => scrollTo('contact')}
        className="px-4 sm:px-5 py-2 bg-neutral-950 hover:bg-neutral-700 text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
      >
        Say Hello
      </button>
    </motion.nav>
  );
}
