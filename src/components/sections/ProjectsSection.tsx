import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SkeletonCard from '../SkeletonCard';
import type { Project } from '../../hooks/usePortfolioData';
import {
  ScrollReveal,
  Tilt3DCard,
  ParallaxSectionBackdrop,
} from '../motion/ScrollMotion';
import { ExternalLink, Code, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectsSection({
  projects,
  loading,
}: {
  projects: Project[];
  loading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasInitializedRef = useRef(false);

  // Mouse drag-to-scroll state (works alongside native touchpad 2-finger swipe)
  const dragState = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    didDrag: false,
  });
  const [isDragging, setIsDragging] = useState(false);

  const scrollToCard = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const container = scrollRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    const targetLeft =
      card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
    container.scrollTo({ left: targetLeft, behavior });
    setActiveIndex(index);
  }, []);

  // Center the middle card initially once projects load (without vertical scroll jump)
  useEffect(() => {
    if (loading || projects.length === 0 || hasInitializedRef.current) return;
    const initialIdx = projects.length >= 3 ? 1 : 0;
    hasInitializedRef.current = true;

    const raf = requestAnimationFrame(() => {
      scrollToCard(initialIdx, 'auto');
    });
    return () => cancelAnimationFrame(raf);
  }, [loading, projects.length, scrollToCard]);

  // Detect whichever card is closest to the horizontal center while scrolling
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  // Smooth mouse/touchpad drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX,
      startScrollLeft: container.scrollLeft,
      didDrag: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!dragState.current.isDown || !container) return;

    const walk = e.pageX - dragState.current.startX;
    if (Math.abs(walk) > 6) {
      dragState.current.didDrag = true;
    }
    container.scrollLeft = dragState.current.startScrollLeft - walk * 1.15;
  };

  const endDrag = () => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    setIsDragging(false);
    // Gently snap to the closest centered card after drag release
    if (dragState.current.didDrag) {
      scrollToCard(activeIndex, 'smooth');
    }
  };

  const handlePrev = () => {
    if (projects.length === 0) return;
    const nextIdx = activeIndex > 0 ? activeIndex - 1 : projects.length - 1;
    scrollToCard(nextIdx, 'smooth');
  };

  const handleNext = () => {
    if (projects.length === 0) return;
    const nextIdx = activeIndex < projects.length - 1 ? activeIndex + 1 : 0;
    scrollToCard(nextIdx, 'smooth');
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <ParallaxSectionBackdrop label="WORKS" direction="right" />

      <div className="relative z-10 w-full">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal variant="scale" className="text-center mb-12">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 mb-2">
              Selected Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4 tracking-tight">
              Featured Projects
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-base">
              Explore a selection of my recent work and personal projects.
            </p>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
              <p className="text-neutral-900 font-semibold text-base mb-1">
                No projects yet
              </p>
              <p className="text-neutral-500 text-sm">
                Featured projects will appear here soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative max-w-[1480px] mx-auto">
            {/* Left Liquid Glass Arrow */}
            {projects.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous project"
                className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full absolute left-3 md:left-5 lg:left-7 top-1/2 -translate-y-1/2 z-30 overflow-hidden bg-gradient-to-b from-white/80 via-neutral-100/50 to-neutral-200/45 hover:from-white/95 hover:via-neutral-100/65 hover:to-neutral-200/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/90 ring-1 ring-neutral-900/[0.1] shadow-[0_10px_28px_rgba(0,0,0,0.09),0_2px_6px_rgba(0,0,0,0.05),inset_0_2px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.07)] text-neutral-700 hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-1.5 top-0.5 h-5 rounded-full bg-gradient-to-b from-white/95 to-transparent opacity-90"
                />
                <ChevronLeft className="relative z-10 w-5 h-5" />
              </button>
            )}

            {/* Right Liquid Glass Arrow */}
            {projects.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next project"
                className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full absolute right-3 md:right-5 lg:right-7 top-1/2 -translate-y-1/2 z-30 overflow-hidden bg-gradient-to-b from-white/80 via-neutral-100/50 to-neutral-200/45 hover:from-white/95 hover:via-neutral-100/65 hover:to-neutral-200/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/90 ring-1 ring-neutral-900/[0.1] shadow-[0_10px_28px_rgba(0,0,0,0.09),0_2px_6px_rgba(0,0,0,0.05),inset_0_2px_2px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.07)] text-neutral-700 hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-1.5 top-0.5 h-5 rounded-full bg-gradient-to-b from-white/95 to-transparent opacity-90"
                />
                <ChevronRight className="relative z-10 w-5 h-5" />
              </button>
            )}

            {/* Horizontal Center-Focus Carousel Track (Native Touchpad 2-finger Swipe + Mouse Drag) */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              className={`flex items-stretch gap-5 sm:gap-6 lg:gap-7 overflow-x-auto overscroll-x-contain py-10 px-[calc(50%-145px)] sm:px-[calc(50%-175px)] lg:px-[calc(50%-195px)] select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
                isDragging ? 'cursor-grabbing' : 'snap-x snap-proximity cursor-grab'
              }`}
              style={{ perspective: 1200 }}
            >
              {projects.map((project, index) => {
                const isActive = index === activeIndex;
                const offset = index - activeIndex;

                return (
                  <div
                    key={project.id}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    onClick={() => {
                      if (dragState.current.didDrag) return;
                      if (!isActive) scrollToCard(index, 'smooth');
                    }}
                    className="snap-center shrink-0 w-[290px] sm:w-[350px] lg:w-[390px]"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.06 : 0.91,
                        opacity: isActive ? 1 : 0.72,
                        y: isActive ? -8 : 8,
                        rotateY: isActive ? 0 : offset < 0 ? 5 : -5,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 26,
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className={`h-full will-change-transform ${
                        !isActive ? 'cursor-pointer' : ''
                      }`}
                    >
                      <Tilt3DCard
                        maxTilt={isActive && !isDragging ? 5 : 0}
                        className="rounded-3xl"
                      >
                        <div
                          className={`h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-300 border group ${
                            isActive
                              ? 'bg-white border-neutral-300 shadow-[0_24px_56px_rgba(0,0,0,0.11)]'
                              : 'bg-neutral-50/90 border-neutral-200/80 shadow-[0_6px_22px_rgba(0,0,0,0.04)] hover:opacity-95'
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative h-52 sm:h-56 w-full bg-neutral-100 overflow-hidden flex items-center justify-center">
                            {project.thumbnail_url ? (
                              <img
                                src={project.thumbnail_url}
                                alt={project.title}
                                draggable={false}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="text-neutral-400 text-sm font-medium flex flex-col items-center gap-1">
                                <Code className="w-6 h-6 text-neutral-300" />
                                <span className="text-xs font-mono text-neutral-400">
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
                                    className="text-xs font-medium px-2.5 py-1 bg-neutral-950/75 backdrop-blur-md text-white rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Body */}
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="font-bold text-xl text-neutral-950 mb-2 leading-tight group-hover:text-neutral-700 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-sm text-neutral-600 line-clamp-3 mb-6 flex-1 leading-relaxed">
                              {project.description || 'No project description provided.'}
                            </p>

                            <div className="flex items-center gap-5 mt-auto pt-4 border-t border-neutral-200/70">
                              {project.demo_url && (
                                <a
                                  href={project.demo_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
                                >
                                  <ExternalLink size={16} /> Live Demo
                                </a>
                              )}
                              {project.github_url && (
                                <a
                                  href={project.github_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-950 transition-colors"
                                >
                                  <Code size={16} /> Repo
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </Tilt3DCard>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Dots + Mobile Arrows */}
            {projects.length > 1 && (
              <div className="mt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="sm:hidden relative overflow-hidden p-2.5 rounded-full bg-gradient-to-b from-white/80 via-neutral-100/50 to-neutral-200/45 backdrop-blur-xl border border-white/90 ring-1 ring-neutral-900/[0.1] shadow-[0_6px_16px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1.5px_3px_rgba(0,0,0,0.06)] text-neutral-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  {projects.map((project, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => scrollToCard(idx, 'smooth')}
                        aria-label={`View ${project.title}`}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'w-7 bg-neutral-950'
                            : 'w-2 bg-neutral-300 hover:bg-neutral-500'
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next project"
                  className="sm:hidden relative overflow-hidden p-2.5 rounded-full bg-gradient-to-b from-white/80 via-neutral-100/50 to-neutral-200/45 backdrop-blur-xl border border-white/90 ring-1 ring-neutral-900/[0.1] shadow-[0_6px_16px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1.5px_3px_rgba(0,0,0,0.06)] text-neutral-700 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
