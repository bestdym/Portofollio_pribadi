import React from 'react';
import { motion } from 'framer-motion';
import {
  ScrollReveal,
  ScrollHorizontalTrack,
  ParallaxLayer,
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
        {/* Heading: Kecil -> Besar with upward parallax */}
        <ParallaxLayer offsetY={-28} desktopOnly>
          <ScrollReveal variant="scale" className="text-center mb-16">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 mb-2">
              Tools & Craft
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4 tracking-tight">
              Tech Stack
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-base">
              Technologies, frameworks, and databases I use to build modern software.
            </p>
          </ScrollReveal>
        </ParallaxLayer>

        <div className="flex flex-col gap-8">
          {/* Row 1: Strong Scroll-driven Right -> Left */}
          <ScrollHorizontalTrack direction="left" distance={190}>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {languages.map((skill, idx) => (
                <ScrollReveal key={skill.name} variant="scale" delay={idx * 0.04}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.05, rotateY: 8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-400 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-8 h-8 md:w-9 md:h-9 object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <span className="text-neutral-600 group-hover:text-neutral-950 text-xs md:text-sm font-semibold transition-colors whitespace-nowrap">
                      {skill.name}
                    </span>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollHorizontalTrack>

          {/* Row 2: Strong Scroll-driven Left -> Right */}
          <ScrollHorizontalTrack direction="right" distance={175}>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {databases.map((skill, idx) => (
                <ScrollReveal key={skill.name} variant="scale" delay={idx * 0.06}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.05, rotateY: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-400 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="w-8 h-8 md:w-9 md:h-9 object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <span className="text-neutral-600 group-hover:text-neutral-950 text-xs md:text-sm font-semibold transition-colors whitespace-nowrap">
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
