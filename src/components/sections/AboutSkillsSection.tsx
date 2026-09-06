import React from 'react';
import AntiGravityContainer from '../AntiGravityContainer';
import FloatingCard from '../FloatingCard';

const skills = [
  "React", "TypeScript", "Tailwind CSS", "Next.js", 
  "Supabase", "Node.js", "Framer Motion", "GraphQL", 
  "PostgreSQL", "Matter.js", "Vite"
];

export default function AboutSkillsSection() {
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
            {skills.map((skill, index) => (
              <FloatingCard 
                key={skill}
                initialX={100 + (index * 20)}
                initialY={50 + (index * 15)}
                weight={0.3 + (Math.random() * 0.5)}
                className="!rounded-full px-6 py-3 !p-0 h-12 border-soft-primary/40 bg-white/60 hover:bg-white text-slate-700 font-medium whitespace-nowrap"
              >
                {skill}
              </FloatingCard>
            ))}
          </AntiGravityContainer>
        </div>

      </div>
    </section>
  );
}
