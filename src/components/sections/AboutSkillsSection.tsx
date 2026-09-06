import React, { useMemo } from 'react';
import AntiGravityContainer from '../AntiGravityContainer';
import FloatingCard from '../FloatingCard';

const skills = [
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Vue", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" },
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/333333" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
  { name: "Dart", icon: "https://cdn.simpleicons.org/dart/0175C2" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339939" },
  { name: "GraphQL", icon: "https://cdn.simpleicons.org/graphql/E10098" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" },
  { name: "Matter.js", icon: "https://cdn.simpleicons.org/javascript/F7DF1E" },
  { name: "Vite", icon: "https://cdn.simpleicons.org/vite/646CFF" }
];

export default function AboutSkillsSection() {
  // Mengacak posisi awal sekali saja saat render pertama
  const randomizedSkills = useMemo(() => {
    return skills.map((skill) => ({
      ...skill,
      // Acak X dari 50px hingga 350px (area aman container)
      x: 50 + Math.random() * 300,
      // Acak Y dari 50px hingga 250px (area aman container)
      y: 50 + Math.random() * 250,
      // Acak massa kartu
      weight: 0.3 + (Math.random() * 0.5)
    }));
  }, []);

  return (
    <section id="skills" className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Behind the Code</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            I believe that great software is a combination of robust logic and delightful user experiences. 
            My approach blends clean architecture with micro-interactions that make interfaces feel alive.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            When I'm not coding, I'm usually exploring new animation libraries or contributing to open-source UI components. 
            Grab and throw the skill badges on the right to see the physics engine in action!
          </p>
        </div>

        {/* Physics Skills Canvas */}
        <div className="h-[400px] w-full bg-soft-bg rounded-3xl overflow-hidden shadow-inner border border-slate-100 relative">
          <AntiGravityContainer className="w-full h-full min-h-[400px]">
            {randomizedSkills.map((skill) => (
              <FloatingCard 
                key={skill.name}
                initialX={skill.x}
                initialY={skill.y}
                weight={skill.weight}
                className="!rounded-full px-5 py-2 !p-0 h-12 border-soft-primary/40 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 font-medium whitespace-nowrap flex flex-row gap-3 items-center"
              >
                <img src={skill.icon} alt={skill.name} className="w-6 h-6 object-contain drop-shadow-sm pointer-events-none" />
                <span className="pointer-events-none">{skill.name}</span>
              </FloatingCard>
            ))}
          </AntiGravityContainer>
        </div>

      </div>
    </section>
  );
}
