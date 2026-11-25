import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/sections/HeroSection';
import BlogSection from './components/sections/BlogSection';
import ProjectsSection from './components/sections/ProjectsSection';
import AboutSkillsSection from './components/sections/AboutSkillsSection';
import ContactSection from './components/sections/ContactSection';
import { ScrollProgressBar } from './components/motion/ScrollMotion';
import { usePortfolioData } from './hooks/usePortfolioData';
import Admin from './pages/Admin';

function Home() {
  const { profile, projects, blogs, loading, error } = usePortfolioData();

  return (
    <div className="min-h-screen bg-soft-bg text-soft-text font-sans selection:bg-[#8C6239]/20 selection:text-[#1C1917] overflow-x-clip">
      <ScrollProgressBar />
      <Navbar />

      <main>
        {/* Error Boundary / Status sederhana */}
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#FFFDF9] text-[#8C6239] px-6 py-3 rounded-full shadow-lg border border-[#D6C7B2] text-sm">
            {error}
          </div>
        )}

        <HeroSection profile={profile} />

        <BlogSection blogs={blogs} loading={loading} />

        <ProjectsSection projects={projects} loading={loading} />

        <AboutSkillsSection />

        <ContactSection />
      </main>

      {/* Footer sederhana & rapi */}
      <footer className="py-10 text-center text-[#57534E] border-t border-[#E7E1D8]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p>
            © {new Date().getFullYear()} {profile?.name || 'Developer'}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[#78716C]">Built with React & Supabase</p>
            <span className="text-[#D6C7B2]">•</span>
            <Link
              to="/admin"
              className="text-[#78716C] hover:text-[#8C6239] transition-colors font-medium"
            >
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
