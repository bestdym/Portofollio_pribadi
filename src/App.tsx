import React from 'react';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import ProjectsSection from './components/sections/ProjectsSection';
import AboutSkillsSection from './components/sections/AboutSkillsSection';
import ContactSection from './components/sections/ContactSection';
import { usePortfolioData } from './hooks/usePortfolioData';

function App() {
  const { profile, projects, loading, error } = usePortfolioData();

  return (
    <div className="min-h-screen bg-soft-bg text-soft-text font-sans selection:bg-soft-primary/30">
      <Navbar />
      
      <main>
        {/* Error Boundary / Status sederhana */}
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-100 text-red-600 px-6 py-3 rounded-full shadow-lg border border-red-200">
            {error}
          </div>
        )}

        <HeroSection profile={profile} />
        
        <ProjectsSection projects={projects} loading={loading} />
        
        <AboutSkillsSection />
        
        <ContactSection />
      </main>

      {/* Footer sederhana */}
      <footer className="py-8 text-center text-slate-500 bg-white border-t border-slate-100">
        <p>© {new Date().getFullYear()} {profile?.name || 'Developer'}. All rights reserved.</p>
        <p className="text-sm mt-1">Built with React, Matter.js & Supabase</p>
      </footer>
    </div>
  );
}

export default App;
