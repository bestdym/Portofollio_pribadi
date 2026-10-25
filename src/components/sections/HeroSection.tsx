import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ profile }: { profile: any }) {
  // Generate subtle background particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blue-200/40"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.name} 
              className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-md object-cover bg-white"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-blue-100 text-blue-600 flex items-center justify-center text-4xl shadow-md border-4 border-white">
              👋
            </div>
          )}
          
          <h2 className="text-sm md:text-base font-semibold text-blue-500 mb-2 uppercase tracking-widest">
            Hello, I am {profile?.name || 'A Developer'}
          </h2>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-800 tracking-tight mb-6 leading-tight">
            Building <span className="text-blue-500">Digital</span> Experiences.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {profile?.bio || 'I am a frontend engineer passionate about crafting fluid UI experiences and anti-gravity physics animations.'}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-slate-800 text-white rounded-full font-medium hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
          >
            Explore My Universe
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
