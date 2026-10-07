import React from 'react';

const languages = [
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Dart", icon: "https://cdn.simpleicons.org/dart/0175C2" },
  { name: "Flutter", icon: "https://cdn.simpleicons.org/flutter/02569B" },
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Vue", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" }
];

const databases = [
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" }
];

export default function AboutSkillsSection() {
  return (
    <section id="skills" className="pb-24 pt-12 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-16 tracking-tight">Tech Stack</h2>
        
        <div className="flex flex-col gap-12">
          {/* Languages & Frameworks Row */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {languages.map((skill) => (
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

          {/* Databases Row */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {databases.map((skill) => (
              <div 
                key={skill.name}
                className="group relative flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <img 
                  src={skill.icon} 
                  alt={skill.name} 
                  className="w-12 h-12 md:w-14 md:h-14 object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none z-20">
                  <div className="bg-slate-800/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-xl flex flex-col items-center gap-0.5 min-w-[100px]">
                    <span className="text-xs font-semibold whitespace-nowrap">{skill.name}</span>
                    <div className="flex gap-0.5 text-[10px]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < skill.stars ? "text-amber-400" : "text-slate-500/50"}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800/80"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
