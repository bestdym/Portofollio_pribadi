import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  experienceByYear,
  type ExperienceType,
} from '../../data/experienceData';
import {
  ScrollReveal,
  ParallaxLayer,
  ParallaxSectionBackdrop,
} from '../motion/ScrollMotion';
import {
  Briefcase,
  Trophy,
  Award,
  GraduationCap,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MapPin,
  Calendar,
  ArrowLeftRight,
} from 'lucide-react';

const typeIconMap: Record<
  ExperienceType,
  React.ComponentType<{ className?: string }>
> = {
  Work: Briefcase,
  Internship: Briefcase,
  Project: Layers,
  Award: Trophy,
  Certification: Award,
  Education: GraduationCap,
};

const STEP_ANGLE = 40; // degrees between each year along the curved arc
const DIAL_RADIUS = 132; // px radius of the rotary dial

export default function ExperienceSection() {
  // Default to the latest year (2026) or middle year (2025) — starting on 2025 puts 2024 above & 2026 below, matching the sketch!
  const defaultIdx = Math.min(1, experienceByYear.length - 1);
  const [activeYearIdx, setActiveYearIdx] = useState(defaultIdx);

  const cardsTrackRef = useRef<HTMLDivElement>(null);

  // Mouse drag-to-scroll for the horizontal cards track
  const dragState = useRef({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const currentGroup = experienceByYear[activeYearIdx];

  const updateScrollArrows = () => {
    const el = cardsTrackRef.current;
    if (!el) return;
    const nextLeft = el.scrollLeft > 8;
    const nextRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 8;
    setCanScrollLeft((prev) => (prev === nextLeft ? prev : nextLeft));
    setCanScrollRight((prev) => (prev === nextRight ? prev : nextRight));
  };

  // Reset horizontal scroll position smoothly whenever the selected year changes
  useEffect(() => {
    const el = cardsTrackRef.current;
    if (el) {
      el.scrollTo({ left: 0, behavior: 'auto' });
    }
    const timer = setTimeout(updateScrollArrows, 80);
    window.addEventListener('resize', updateScrollArrows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScrollArrows);
    };
  }, [activeYearIdx]);

  const rotatePrevYear = () => {
    setActiveYearIdx((prev) =>
      prev > 0 ? prev - 1 : experienceByYear.length - 1
    );
  };

  const rotateNextYear = () => {
    setActiveYearIdx((prev) =>
      prev < experienceByYear.length - 1 ? prev + 1 : 0
    );
  };

  // Horizontal card track scroll controls
  const scrollCardsBy = (dir: 'left' | 'right') => {
    const el = cardsTrackRef.current;
    if (!el) return;
    const distance = Math.min(380, el.clientWidth * 0.8);
    el.scrollBy({
      left: dir === 'right' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardsTrackRef.current;
    if (!el) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX,
      startScrollLeft: el.scrollLeft,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardsTrackRef.current;
    if (!dragState.current.isDown || !el) return;
    const walk = e.pageX - dragState.current.startX;
    el.scrollLeft = dragState.current.startScrollLeft - walk * 1.15;
  };

  const endDrag = () => {
    if (!dragState.current.isDown) return;
    dragState.current.isDown = false;
    setIsDragging(false);
  };

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <ParallaxSectionBackdrop label="EXPERIENCE" direction="right" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header with subtle upward parallax */}
        <ParallaxLayer offsetY={-28} desktopOnly>
          <ScrollReveal variant="scale" className="text-center mb-14">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400 mb-2">
              Career &amp; Milestones
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-950 mb-4 tracking-tight">
              Experience
            </h2>
            <p className="text-neutral-500 max-w-lg mx-auto text-sm md:text-base">
              Rotate the year dial to explore my work history, awards, certifications, and key milestones.
            </p>
          </ScrollReveal>
        </ParallaxLayer>

        {/* Mobile & Tablet Curved Horizontal Year Selector */}
        <div className="lg:hidden mb-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/75 backdrop-blur-xl border border-neutral-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={rotatePrevYear}
              aria-label="Previous year"
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {experienceByYear.map((group, idx) => {
                const isActive = idx === activeYearIdx;
                return (
                  <button
                    key={group.year}
                    type="button"
                    onClick={() => setActiveYearIdx(idx)}
                    className={`relative px-4 py-1.5 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'text-neutral-950'
                        : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobileYearPill"
                        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-neutral-100/80 to-neutral-200/60 border border-white ring-1 ring-neutral-900/[0.08] shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{group.year}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={rotateNextYear}
              aria-label="Next year"
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Split: Left Curved Rotary Year Dial + Right Scrollable Experience Cards (opposing parallax planes) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-8 lg:gap-10">
          {/* LEFT: Curved Rotary Year Dial (Desktop) */}
          <ParallaxLayer offsetY={65} desktopOnly className="hidden lg:block shrink-0">
            <div
              className="flex flex-col items-center justify-center relative w-[240px] xl:w-[260px] h-[360px] select-none"
            >
            {/* Rotate Up Arrow */}
            <button
              type="button"
              onClick={rotatePrevYear}
              aria-label="Rotate to previous year"
              className="absolute top-1 left-[96px] z-20 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-white/85 via-neutral-100/60 to-neutral-200/45 hover:from-white hover:to-neutral-200/65 backdrop-blur-xl border border-white ring-1 ring-neutral-900/[0.09] shadow-[0_6px_18px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,1)] text-neutral-600 hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Curved Semicircle Track (SVG) */}
            <svg
              viewBox="0 0 240 320"
              className="w-[240px] h-[320px] pointer-events-none overflow-visible"
              aria-hidden="true"
            >
              {/* Outer soft ring */}
              <circle
                cx="10"
                cy="160"
                r={DIAL_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-neutral-200"
              />
              {/* Inner dashed architectural arc */}
              <circle
                cx="10"
                cy="160"
                r={DIAL_RADIUS - 18}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 6"
                className="text-neutral-300/80"
              />
              {/* Active focal notch indicator at 0 deg (rightmost apex of the curve) */}
              <circle
                cx={10 + DIAL_RADIUS}
                cy="160"
                r="5"
                className="fill-neutral-950"
              />
              <line
                x1={10 + DIAL_RADIUS + 8}
                y1="160"
                x2={10 + DIAL_RADIUS + 26}
                y2="160"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-neutral-300"
              />
            </svg>

            {/* Rotating Dial Container */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                initial={false}
                animate={{ rotate: -activeYearIdx * STEP_ANGLE }}
                transition={{ type: 'spring', stiffness: 170, damping: 22, mass: 0.9 }}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 180,
                  width: 0,
                  height: 0,
                }}
              >
                {experienceByYear.map((group, idx) => {
                  const angleDeg = idx * STEP_ANGLE;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const x = Math.cos(angleRad) * (DIAL_RADIUS + 46);
                  const y = Math.sin(angleRad) * (DIAL_RADIUS + 46);
                  const isActive = idx === activeYearIdx;

                  return (
                    <div
                      key={group.year}
                      style={{
                        position: 'absolute',
                        left: x,
                        top: y,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="pointer-events-auto"
                    >
                      {/* Counter-rotate text so year numbers stay horizontally upright */}
                      <motion.button
                        type="button"
                        initial={false}
                        onClick={() => setActiveYearIdx(idx)}
                        animate={{
                          rotate: activeYearIdx * STEP_ANGLE,
                          scale: isActive ? 1.15 : 0.88,
                          opacity: isActive ? 1 : 0.52,
                        }}
                        whileHover={{ scale: isActive ? 1.18 : 0.98, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 22,
                        }}
                        className={`px-3.5 py-1.5 rounded-full font-display font-extrabold tracking-tight transition-colors cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'text-2xl text-neutral-950 bg-gradient-to-b from-white/95 via-neutral-100/80 to-neutral-200/55 backdrop-blur-xl border border-white ring-1 ring-neutral-900/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.09),inset_0_1.5px_1px_rgba(255,255,255,1)]'
                            : 'text-base text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        {group.year}
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Rotate Down Arrow */}
            <button
              type="button"
              onClick={rotateNextYear}
              aria-label="Rotate to next year"
              className="absolute bottom-1 left-[96px] z-20 w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-b from-white/85 via-neutral-100/60 to-neutral-200/45 hover:from-white hover:to-neutral-200/65 backdrop-blur-xl border border-white ring-1 ring-neutral-900/[0.09] shadow-[0_6px_18px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,1)] text-neutral-600 hover:text-neutral-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            </div>
          </ParallaxLayer>

          {/* RIGHT: Year Summary + Horizontal Scrollable Experience Cards */}
          <ParallaxLayer offsetY={-35} desktopOnly className="flex-1 min-w-0">
            <div className="flex flex-col">
            {/* Active Year Bar + Scroll Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl font-display font-black text-neutral-950 tracking-tight">
                    {currentGroup.year}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                    {currentGroup.items.length} milestones
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                  {currentGroup.subtitle}
                </p>
              </div>

              {/* Liquid Glass Horizontal Scroll Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCardsBy('left')}
                  disabled={!canScrollLeft}
                  aria-label="Scroll experiences left"
                  className="relative overflow-hidden w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-white/85 via-neutral-100/55 to-neutral-200/45 backdrop-blur-xl border border-white/90 ring-1 ring-neutral-900/[0.09] shadow-[0_6px_18px_rgba(0,0,0,0.07),inset_0_1.5px_1px_rgba(255,255,255,1)] text-neutral-700 hover:text-neutral-950 hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100 transition-all cursor-pointer disabled:cursor-default"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCardsBy('right')}
                  disabled={!canScrollRight}
                  aria-label="Scroll experiences right"
                  className="relative overflow-hidden w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-b from-white/85 via-neutral-100/55 to-neutral-200/45 backdrop-blur-xl border border-white/90 ring-1 ring-neutral-900/[0.09] shadow-[0_6px_18px_rgba(0,0,0,0.07),inset_0_1.5px_1px_rgba(255,255,255,1)] text-neutral-700 hover:text-neutral-950 hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100 transition-all cursor-pointer disabled:cursor-default"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Cards Area (Animated per Year) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGroup.year}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  ref={cardsTrackRef}
                  onScroll={updateScrollArrows}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={endDrag}
                  onMouseLeave={endDrag}
                  className={`flex items-stretch gap-5 overflow-x-auto overscroll-x-contain pb-4 pt-1 px-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                >
                  {currentGroup.items.map((item, idx) => {
                    const TypeIcon = typeIconMap[item.type] || Briefcase;

                    return (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: idx * 0.06,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="snap-start shrink-0 w-[295px] sm:w-[345px] lg:w-[360px] flex flex-col bg-neutral-50/80 hover:bg-white rounded-3xl border border-neutral-200/90 hover:border-neutral-300 shadow-[0_6px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_38px_rgba(0,0,0,0.08)] p-6 transition-all duration-300"
                      >
                        {/* Top Badge & Period */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-950 text-white">
                            <TypeIcon className="w-3 h-3" />
                            {item.type}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            {item.period}
                          </span>
                        </div>

                        {/* Role & Organization */}
                        <h3 className="font-bold text-lg text-neutral-950 leading-snug mb-1">
                          {item.role}
                        </h3>
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs font-medium text-neutral-500 mb-3.5">
                          <span>{item.organization}</span>
                          {item.location && (
                            <>
                              <span className="text-neutral-300">•</span>
                              <span className="inline-flex items-center gap-0.5 text-neutral-400">
                                <MapPin className="w-3 h-3" />
                                {item.location}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Summary */}
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                          {item.summary}
                        </p>

                        {/* Bullet Highlights */}
                        <ul className="space-y-1.5 mb-5 flex-1">
                          {item.highlights.map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="text-xs text-neutral-600 leading-relaxed flex items-start gap-2"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="pt-3.5 border-t border-neutral-200/70 flex flex-wrap gap-1.5 mt-auto">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Subtle Horizontal Scroll Cue (matching sketch's "Scroll <--->") */}
            {(canScrollLeft || canScrollRight) && (
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Scroll horizontally for more</span>
              </div>
            )}
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
}
