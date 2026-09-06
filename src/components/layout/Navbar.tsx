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
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm py-3 px-6 flex items-center justify-between"
    >
      <div className="font-bold text-soft-text text-xl cursor-pointer" onClick={() => scrollTo('hero')}>
        A<span className="text-soft-primary">.</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
        <button onClick={() => scrollTo('projects')} className="hover:text-soft-primary transition-colors">Projects</button>
        <button onClick={() => scrollTo('skills')} className="hover:text-soft-primary transition-colors">Skills</button>
        <button onClick={() => scrollTo('contact')} className="hover:text-soft-primary transition-colors">Contact</button>
      </div>

      <button 
        onClick={() => scrollTo('contact')} 
        className="px-5 py-2 bg-soft-primary text-white rounded-full text-sm font-medium hover:bg-soft-primary/90 transition-all shadow-md shadow-soft-primary/20 hover:scale-105 active:scale-95"
      >
        Say Hello
      </button>
    </motion.nav>
  );
}
