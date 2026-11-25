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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl rounded-full bg-[#FFFDF9]/80 backdrop-blur-md border border-[#E7E1D8] shadow-[0_8px_30px_rgba(28,25,23,0.06)] py-2.5 px-5 sm:px-6 flex items-center justify-between"
    >
      <button
        onClick={() => scrollTo('hero')}
        className="font-bold text-[#1C1917] text-xl tracking-tight cursor-pointer"
      >
        A<span className="text-[#8C6239]">.</span>
      </button>

      <div className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-medium text-[#57534E]">
        <button
          onClick={() => scrollTo('blog')}
          className="hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          Blog
        </button>
        <button
          onClick={() => scrollTo('projects')}
          className="hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          Projects
        </button>
        <button
          onClick={() => scrollTo('skills')}
          className="hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          Skills
        </button>
        <button
          onClick={() => scrollTo('contact')}
          className="hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          Contact
        </button>
      </div>

      <button
        onClick={() => scrollTo('contact')}
        className="px-4 sm:px-5 py-2 bg-[#1C1917] hover:bg-[#8C6239] text-[#FFFDF9] rounded-full text-xs sm:text-sm font-medium transition-all duration-300 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
      >
        Say Hello
      </button>
    </motion.nav>
  );
}
