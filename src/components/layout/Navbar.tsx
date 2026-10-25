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
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm py-3 px-6 flex items-center justify-between"
    >
      <div className="font-bold text-slate-800 text-xl cursor-pointer" onClick={() => scrollTo('hero')}>
        A<span className="text-blue-400">.</span>
      </div>

      <div className="flex items-center gap-6 md:gap-8 text-sm font-medium text-slate-500">
        <button onClick={() => scrollTo('projects')} className="hover:text-blue-500 transition-colors">Projects</button>
        <button onClick={() => scrollTo('skills')} className="hover:text-blue-500 transition-colors">Skills</button>
        <button onClick={() => scrollTo('contact')} className="hover:text-blue-500 transition-colors">Contact</button>
      </div>

      <button 
        onClick={() => scrollTo('contact')} 
        className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-all shadow-sm hover:scale-105 active:scale-95"
      >
        Say Hello
      </button>
    </motion.nav>
  );
}
