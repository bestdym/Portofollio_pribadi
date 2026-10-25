import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import ProjectsSection from './components/sections/ProjectsSection';
import AboutSkillsSection from './components/sections/AboutSkillsSection';
import ContactSection from './components/sections/ContactSection';
import { usePortfolioData } from './hooks/usePortfolioData';
import Admin from './pages/Admin';

function Home() {
  const { profile, projects, loading, error } = usePortfolioData();

  return (
    <div className="min-h-screen bg-soft-bg text-soft-text font-sans selection:bg-soft-primary/30">
      <Navbar />
      
      <main>
        {/* Error Boundary / Status sederhana */}
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-100 text-red-600 px-6 py-3 rounded-full shadow-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        <HeroSection profile={profile} />
        
        <ProjectsSection projects={projects} loading={loading} />
        
        <AboutSkillsSection />
        
        <ContactSection />
      </main>

      {/* Footer sederhana & rapi */}
      <footer className="py-8 text-center text-slate-500 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} {profile?.name || 'Developer'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Built with React & Supabase</p>
            <span className="text-slate-300">•</span>
            <Link to="/admin" className="text-slate-400 hover:text-blue-500 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
