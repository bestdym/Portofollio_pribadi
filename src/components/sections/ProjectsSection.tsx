import React from 'react';
import SkeletonCard from '../SkeletonCard';
import type { Project } from '../../hooks/usePortfolioData';
import {
  ScrollReveal,
  Tilt3DCard,
  ParallaxImage,
  ParallaxLayer,
  ParallaxSectionBackdrop,
} from '../motion/ScrollMotion';
import { ExternalLink, Code } from 'lucide-react';

export default function ProjectsSection({
  projects,
  loading,
}: {
  projects: Project[];
  loading: boolean;
}) {
  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <ParallaxSectionBackdrop label="WORKS" direction="right" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header: Kecil -> Besar */}
        <ScrollReveal variant="scale" className="text-center mb-16">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C6239] mb-2">
            Selected Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-[#57534E] max-w-lg mx-auto text-sm md:text-base">
            Explore a selection of my recent work and personal projects.
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const colOffset = index % 3 === 1 ? 26 : -14;

              return (
                <ParallaxLayer
                  key={project.id}
                  offsetY={colOffset}
                  desktopOnly
                  className="h-full"
                >
                  <ScrollReveal
                    variant="tilt3d"
                    delay={index * 0.08}
                    className="h-full"
                  >
                    <Tilt3DCard className="rounded-2xl">
                      <div className="h-full flex flex-col bg-[#FFFDF9] rounded-2xl overflow-hidden shadow-[0_8px_28px_rgba(28,25,23,0.05)] hover:shadow-[0_18px_40px_rgba(28,25,23,0.1)] transition-shadow duration-300 border border-[#E7E1D8] group">
                        {/* Thumbnail with Parallax Image */}
                        <div className="relative h-52 w-full bg-[#EAE4DC] overflow-hidden flex items-center justify-center">
                          {project.thumbnail_url ? (
                            <ParallaxImage
                              src={project.thumbnail_url}
                              alt={project.title}
                              strength={12}
                            />
                          ) : (
                            <div className="text-[#78716C] text-sm font-medium flex flex-col items-center gap-1">
                              <Code className="w-6 h-6 text-[#A8A29E]" />
                              <span className="text-xs font-mono text-[#78716C]">
                                Project Showcase
                              </span>
                            </div>
                          )}

                          {/* Overlay Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs font-medium px-2.5 py-1 bg-[#1C1917]/75 backdrop-blur-md text-[#FFFDF9] rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="font-bold text-xl text-[#1C1917] mb-2 leading-tight group-hover:text-[#8C6239] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-[#57534E] line-clamp-3 mb-6 flex-1 leading-relaxed">
                            {project.description || 'Tidak ada deskripsi proyek.'}
                          </p>

                          <div className="flex items-center gap-5 mt-auto pt-4 border-t border-[#EFEAE2]">
                            {project.demo_url && (
                              <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-sm font-semibold text-[#8C6239] hover:text-[#1C1917] transition-colors"
                              >
                                <ExternalLink size={16} /> Live Demo
                              </a>
                            )}
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-sm font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
                              >
                                <Code size={16} /> Repo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tilt3DCard>
                  </ScrollReveal>
                </ParallaxLayer>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
