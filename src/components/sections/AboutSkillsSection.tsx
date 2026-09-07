import React from 'react';

const skills = [
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339939" },
  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "Vue", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
  { name: "Flutter", icon: "https://cdn.simpleicons.org/flutter/02569B" },
  { name: "Dart", icon: "https://cdn.simpleicons.org/dart/0175C2" }
];

export default function AboutSkillsSection() {
  return (
    <section id="skills" className="pb-24 pt-12 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-16 tracking-tight">Tech Stack</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {skills.map((skill) => (
            <div 
              key={skill.name}
              className="group relative flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <img 
                src={skill.icon} 
                alt={skill.name} 
                className="w-12 h-12 md:w-14 md:h-14 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
              <span className="absolute -bottom-8 text-slate-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
