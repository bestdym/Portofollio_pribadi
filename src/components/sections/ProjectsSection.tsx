import React from 'react';
import AntiGravityContainer from '../AntiGravityContainer';
import FloatingCard from '../FloatingCard';
import SkeletonCard from '../SkeletonCard';
import type { Project } from '../../hooks/usePortfolioData';
import { ExternalLink, Code } from 'lucide-react';

export default function ProjectsSection({ projects, loading }: { projects: Project[], loading: boolean }) {
  
  // Posisi awal acak untuk mencegah penumpukan di titik yang sama
  const getRandomPos = () => ({
    x: Math.random() * (window.innerWidth - 300) + 150,
    y: Math.random() * 200 + 100
  });

  return (
    <section id="projects" className="relative w-full bg-slate-50 border-t border-white">
      <div className="absolute top-10 w-full text-center z-10 pointer-events-none px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Featured Projects</h2>
        <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
          Interactive zero-gravity showcase. Drag and throw the cards!
        </p>
      </div>

      <div className="h-[80vh] min-h-[600px] w-full mt-24 md:mt-0">
        <AntiGravityContainer className="w-full h-full">
          {loading ? (
            // Skeleton Loader (3 kartu statis)
            <div className="flex flex-wrap justify-center gap-6 pt-32 px-4">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            // Supabase Projects
            projects.map((project, index) => {
              const pos = getRandomPos();
              return (
                <FloatingCard 
                  key={project.id}
                  initialX={pos.x}
                  initialY={pos.y}
                  weight={project.weight || 1.0 + (index * 0.2)} 
                  className="w-[300px] md:w-[340px] flex-col !p-0 overflow-hidden group"
                >
                  <div className="relative h-40 w-full bg-slate-200 overflow-hidden">
                    {project.thumbnail_url ? (
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-soft-primary/10">
                        No Image
                      </div>
                    )}
                    {/* Overlay Tags */}
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                      {project.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 w-full bg-white/50">
                    <h3 className="font-bold text-lg text-slate-800 mb-1 leading-tight">{project.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto pt-2 border-t border-slate-200/50">
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 text-sm font-medium text-soft-primary hover:text-soft-primary/80 transition-colors"
                          onPointerDown={(e) => e.stopPropagation()} // Supaya klik link tidak trigger drag Matter.js
                        >
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <Code size={16} /> Repo
                        </a>
                      )}
                    </div>
                  </div>
                </FloatingCard>
              );
            })
          )}
        </AntiGravityContainer>
      </div>
    </section>
  );
}
