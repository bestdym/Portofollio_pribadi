import React from 'react';
import AntiGravityContainer from './components/AntiGravityContainer';
import FloatingCard from './components/FloatingCard';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-soft-bg text-soft-text font-sans selection:bg-soft-primary/30">
      
      {/* Header Statis */}
      <header className="p-8 pb-0 max-w-5xl mx-auto w-full z-10 relative pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-800">
            Anti-Gravity <span className="text-soft-primary">Portfolio</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Sentuh, seret, dan lempar kartu-kartu di bawah ini. Efek nol gravitasi dan physics engine didukung oleh Matter.js.
          </p>
        </motion.div>
      </header>

      {/* Physics Container - Memenuhi sisa layar */}
      <main className="absolute inset-0 top-[180px] overflow-hidden">
        <AntiGravityContainer className="w-full h-full">
          
          {/* Card 1: Pengenalan Diri */}
          <FloatingCard 
            initialX={window.innerWidth / 2 - 150} 
            initialY={100} 
            weight={1.2}
            className="w-[300px]"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-soft-primary/20 mx-auto flex items-center justify-center text-soft-primary">
                👨‍💻
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-700">Alex Frontend</h3>
                <p className="text-sm text-slate-500">Senior UI Engineer</p>
              </div>
            </div>
          </FloatingCard>

          {/* Card 2: Tech Stack (Lebih ringan) */}
          <FloatingCard 
            initialX={window.innerWidth / 4} 
            initialY={250} 
            weight={0.5}
            className="w-[200px]"
          >
            <div className="text-center">
              <h4 className="font-semibold text-slate-600 mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-medium border border-slate-100">React</span>
                <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-medium border border-slate-100">Tailwind</span>
                <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-medium border border-slate-100">TypeScript</span>
              </div>
            </div>
          </FloatingCard>

          {/* Card 3: Project 1 */}
          <FloatingCard 
            initialX={window.innerWidth * 0.7} 
            initialY={150} 
            weight={1.8} // Lebih berat, lebih lambat bergerak
            className="w-[320px] aspect-video flex-col !p-0 overflow-hidden"
          >
            <div className="bg-slate-200 h-1/2 w-full flex items-center justify-center text-slate-400">
              [ Thumbnail Project ]
            </div>
            <div className="p-4 h-1/2 flex flex-col justify-center">
              <h4 className="font-bold text-slate-700">E-Commerce Dashboard</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">A modern analytics dashboard for e-commerce platforms featuring real-time data.</p>
            </div>
          </FloatingCard>

        </AntiGravityContainer>
      </main>
    </div>
  );
}

export default App;
