import React from 'react';
import SkeletonCard from '../SkeletonCard';
import type { Project } from '../../hooks/usePortfolioData';
import { ExternalLink, Code } from 'lucide-react';

export default function ProjectsSection({ projects, loading }: { projects: Project[], loading: boolean }) {
  return (
    <section id="projects" className="py-24 bg-slate-50 border-t border-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Featured Projects</h2>
          <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
            Explore a selection of my recent work and personal projects.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group"
              >
                <div className="relative h-56 w-full bg-slate-200 overflow-hidden">
                  {project.thumbnail_url ? (
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-soft-primary/10">
                      No Image
                    </div>
                  )}
                  {/* Overlay Tags */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {project.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-slate-800 mb-2 leading-tight">{project.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100">
                    {project.demo_url && (
                      <a 
                        href={project.demo_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-semibold text-soft-primary hover:text-soft-primary/80 transition-colors"
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Code size={16} /> Repo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
