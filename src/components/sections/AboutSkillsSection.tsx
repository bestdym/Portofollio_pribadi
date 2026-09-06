import React, { useMemo } from 'react';
import AntiGravityContainer from '../AntiGravityContainer';
import FloatingCard from '../FloatingCard';

const skills = [
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/333333" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Tailwind CSS", icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339939" },
  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/3ECF8E" },
  { name: "PostgreSQL", icon: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/4479A1" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20" },
  { name: "Vue", icon: "https://cdn.simpleicons.org/vuedotjs/4FC08D" }
];

export default function AboutSkillsSection() {
  // Mengatur posisi awal agar rapat di kiri atas. 
  // Mencegah masalah kartu spawn di luar layar pada window berukuran kecil.
  const randomizedSkills = useMemo(() => {
    return skills.map((skill, index) => {
      // 3 kolom memastikan lebar maksimal area spawn sangat kecil (aman untuk layar sempit)
      const cols = 3;
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const jitterX = (Math.random() - 0.5) * 15;
      const jitterY = (Math.random() - 0.5) * 15;
      
      return {
        ...skill,
        // Menyebar rapat pada X: 80px sampai ~220px (selalu masuk ke dalam layar)
        x: 80 + (col * 70) + jitterX,
        // Menyebar rapat pada Y: 80px sampai ~290px
        y: 80 + (row * 70) + jitterY,
        weight: 0.3 + (Math.random() * 0.5)
      };
    });
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
                shape="circle"
                className="!rounded-full w-16 h-16 !p-0 border border-slate-200/50 bg-white/80 backdrop-blur-md hover:bg-white hover:border-soft-primary/50 hover:shadow-lg transition-all flex justify-center items-center group relative"
              >
                {/* Ikon: Grayscale saat diam, berwarna saat di-hover */}
                <img 
                  src={skill.icon} 
                  alt={skill.name} 
                  className="w-8 h-8 object-contain pointer-events-none grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" 
                />
                
                {/* Nama skill muncul melayang di bawah saat di-hover */}
                <span className="absolute -bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none z-50 shadow-md">
                  {skill.name}
                </span>
              </FloatingCard>
            ))}
          </AntiGravityContainer>
        </div>

      </div>
    </section>
  );
}
