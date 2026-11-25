import React from 'react';
import { motion } from 'framer-motion';
import {
  ScrollReveal,
  ScrollHorizontalTrack,
  ParallaxSectionBackdrop,
} from '../motion/ScrollMotion';

const languages = [
  { name: 'TypeScript', icon: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { name: 'Dart', icon: 'https://cdn.simpleicons.org/dart/0175C2' },
  { name: 'Flutter', icon: 'https://cdn.simpleicons.org/flutter/02569B' },
  { name: 'React', icon: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Vue', icon: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
  { name: 'Laravel', icon: 'https://cdn.simpleicons.org/laravel/FF2D20' },
  { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
];

const databases = [
  { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'MySQL', icon: 'https://cdn.simpleicons.org/mysql/4479A1' },
  { name: 'Supabase', icon: 'https://cdn.simpleicons.org/supabase/3ECF8E' },
];

export default function AboutSkillsSection() {
  return (
    <section
      id="skills"
      className="py-24 relative overflow-hidden flex flex-col items-center justify-center min-h-[45vh]"
    >
      <ParallaxSectionBackdrop label="STACK" direction="left" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center w-full">
        {/* Heading: Kecil -> Besar */}
        <ScrollReveal variant="scale" className="mb-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C6239] mb-2">
            Tools & Craft
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C1917] tracking-tight">
            Tech Stack
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-8">
          {/* Row 1: Scroll-driven Right -> Left */}
          <ScrollHorizontalTrack direction="left" distance={72}>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {languages.map((skill, idx) => (
                <ScrollReveal key={skill.name} variant="scale" delay={idx * 0.04}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.05, rotateY: 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E7E1D8] hover:border-[#8C6239]/50 shadow-[0_6px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_12px_28px_rgba(140,98,57,0.12)] transition-colors duration-300 cursor-pointer"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-8 h-8 md:w-9 md:h-9 object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <span className="text-[#57534E] group-hover:text-[#1C1917] text-xs md:text-sm font-semibold transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollHorizontalTrack>

          {/* Row 2: Scroll-driven Left -> Right */}
          <ScrollHorizontalTrack direction="right" distance={56}>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {databases.map((skill, idx) => (
                <ScrollReveal key={skill.name} variant="scale" delay={idx * 0.06}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.05, rotateY: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#FFFDF9] border border-[#E7E1D8] hover:border-[#8C6239]/50 shadow-[0_6px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_12px_28px_rgba(140,98,57,0.12)] transition-colors duration-300 cursor-pointer"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-8 h-8 md:w-9 md:h-9 object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <span className="text-[#57534E] group-hover:text-[#1C1917] text-xs md:text-sm font-semibold transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollHorizontalTrack>
        </div>
      </div>
    </section>
  );
}
