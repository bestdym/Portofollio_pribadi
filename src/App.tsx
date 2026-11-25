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
    <div className="min-h-screen bg-white text-neutral-950 font-sans selection:bg-neutral-900 selection:text-white overflow-x-clip">
      <ScrollProgressBar />
      <Navbar />

      <main>
        {/* Error Boundary / Status sederhana */}
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-neutral-50 text-neutral-800 px-6 py-3 rounded-full shadow-lg border border-neutral-200 text-sm">
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
      <footer className="py-10 text-center text-neutral-500 border-t border-neutral-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="text-neutral-600">
            © {new Date().getFullYear()} {profile?.name || 'Developer'}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-neutral-400">Built with React & Supabase</p>
            <span className="text-neutral-300">•</span>
            <Link
              to="/admin"
              className="text-neutral-500 hover:text-neutral-950 transition-colors font-medium"
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
