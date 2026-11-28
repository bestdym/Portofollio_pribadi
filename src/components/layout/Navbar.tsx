import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]['id'];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [hoveredSection, setHoveredSection] = useState<SectionId | null>(null);
  const [dragPreviewSection, setDragPreviewSection] = useState<SectionId | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [lensReady, setLensReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasInitializedLensRef = useRef(false);

  // Drag state ref (pointer down -> slide/geser across the pill bar)
  const dragRef = useRef({
    pointerDown: false,
    pointerId: -1,
    startX: 0,
    didDrag: false,
    previewId: 'hero' as SectionId,
  });

  // Liquid Glass Lens physics (position + width + velocity-driven liquid squash & stretch)
  const targetX = useMotionValue(0);
  const targetWidth = useMotionValue(84);

  const lensX = useSpring(targetX, {
    stiffness: 380,
    damping: 29,
    mass: 0.72,
  });
  const lensWidth = useSpring(targetWidth, {
    stiffness: 400,
    damping: 32,
    mass: 0.72,
  });

  // Real-time velocity drives fluid droplet stretch horizontally & gentle squash vertically
  const velocityX = useVelocity(lensX);
  const smoothVelocity = useSpring(velocityX, { stiffness: 260, damping: 28 });
  const liquidScaleX = useTransform(smoothVelocity, [-1200, 0, 1200], [1.16, 1, 1.16]);
  const liquidScaleY = useTransform(smoothVelocity, [-1200, 0, 1200], [0.91, 1, 0.91]);

  // Specular highlight cursor tracking across outer bar & inside liquid lens
  const rawPointerX = useMotionValue(120);
  const rawPointerY = useMotionValue(22);
  const glareX = useSpring(rawPointerX, { stiffness: 320, damping: 32 });
  const glareY = useSpring(rawPointerY, { stiffness: 320, damping: 32 });

  const trackSpecularBg = useMotionTemplate`radial-gradient(150px circle at ${glareX}px ${glareY}px, rgba(255,255,255,0.85), rgba(226,238,248,0.22) 45%, rgba(255,255,255,0) 75%)`;

  // Specular highlight localized inside the moving lens pill
  const lensGlareX = useTransform([glareX, lensX], ([gx, lx]) => (gx as number) - (lx as number));
  const lensSpecularBg = useMotionTemplate`radial-gradient(96px circle at ${lensGlareX}px 30%, rgba(255,255,255,0.95), rgba(240,248,255,0.38) 45%, rgba(255,255,255,0) 78%)`;

  // Measure target button bounds inside the track
  const moveLensToSection = useCallback(
    (sectionId: SectionId, immediate = false) => {
      const btn = buttonRefs.current[sectionId];
      if (!btn) return;
      const left = btn.offsetLeft;
      const width = btn.offsetWidth;
      if (width <= 0) return;

      if (immediate) {
        targetX.jump(left);
        targetWidth.jump(width);
        lensX.jump(left);
        lensWidth.jump(width);
      } else {
        targetX.set(left);
        targetWidth.set(width);
      }
      setLensReady(true);
    },
    [lensWidth, lensX, targetWidth, targetX]
  );

  // Sync lens to current visual target (drag preview -> hovered -> active section)
  const visualTargetSection: SectionId = isDragging
    ? dragPreviewSection ?? activeSection
    : hoveredSection ?? activeSection;

  useLayoutEffect(() => {
    if (isDragging) return;
    const isFirst = !hasInitializedLensRef.current;
    moveLensToSection(visualTargetSection, isFirst);
    if (isFirst && buttonRefs.current[visualTargetSection]) {
      hasInitializedLensRef.current = true;
    }
  }, [visualTargetSection, isDragging, moveLensToSection]);

  // Re-measure on window resize so lens stays pixel-aligned
  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) {
        moveLensToSection(visualTargetSection, true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDragging, visualTargetSection, moveLensToSection]);

  // Active section detection on page scroll
  useEffect(() => {
    let rafId = 0;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + viewportHeight >= docHeight - 60) {
        setActiveSection('contact');
        return;
      }

      const triggerPoint = viewportHeight * 0.35;
      let current: SectionId = 'hero';

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
          current = item.id;
        }
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Close mobile menu on Escape or resize to desktop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollTo = useCallback((id: SectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Find closest nav item to a local X coordinate inside trackRef
  const findClosestSection = useCallback((localX: number): SectionId => {
    let closest: SectionId = 'hero';
    let minDist = Infinity;

    for (const item of NAV_ITEMS) {
      const btn = buttonRefs.current[item.id];
      if (!btn) continue;
      const center = btn.offsetLeft + btn.offsetWidth / 2;
      const dist = Math.abs(localX - center);
      if (dist < minDist) {
        minDist = dist;
        closest = item.id;
      }
    }
    return closest;
  }, []);

  // Pointer handlers for hover glow + direct drag ("geser") of the Liquid Glass droplet
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    rawPointerX.set(localX);
    rawPointerY.set(localY);

    const closest = findClosestSection(localX);
    dragRef.current = {
      pointerDown: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      didDrag: false,
      previewId: closest,
    };

    try {
      track.setPointerCapture(e.pointerId);
    } catch {
      // ignore if capture not supported
    }
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    rawPointerX.set(localX);
    rawPointerY.set(localY);

    if (!dragRef.current.pointerDown) return;

    // Enter smooth Liquid Glass drag mode once pointer moves past 4px threshold
    if (!dragRef.current.didDrag && Math.abs(e.clientX - dragRef.current.startX) > 4) {
      dragRef.current.didDrag = true;
      setIsDragging(true);
    }

    if (dragRef.current.didDrag) {
      const closest = findClosestSection(localX);
      dragRef.current.previewId = closest;
      setDragPreviewSection(closest);

      const closestBtn = buttonRefs.current[closest];
      const desiredWidth = closestBtn ? closestBtn.offsetWidth : 92;
      const maxLeft = Math.max(0, track.clientWidth - desiredWidth);
      const clampedLeft = Math.max(0, Math.min(maxLeft, localX - desiredWidth / 2));

      targetWidth.set(desiredWidth);
      targetX.set(clampedLeft);
    }
  };

  const finishTrackPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.pointerDown) return;
    const track = trackRef.current;
    const wasDragging = dragRef.current.didDrag;
    const chosenId = dragRef.current.previewId;

    dragRef.current.pointerDown = false;
    dragRef.current.didDrag = false;

    if (track && dragRef.current.pointerId !== -1) {
      try {
        track.releasePointerCapture(dragRef.current.pointerId);
      } catch {
        // ignore
      }
      dragRef.current.pointerId = -1;
    }

    if (wasDragging) {
      setIsDragging(false);
      setDragPreviewSection(null);
      setHoveredSection(null);
      moveLensToSection(chosenId, false);
      scrollTo(chosenId);
    } else if (track) {
      const rect = track.getBoundingClientRect();
      const clickedId = findClosestSection(e.clientX - rect.left);
      scrollTo(clickedId);
    }
  };

  const activeLabel =
    NAV_ITEMS.find((item) => item.id === activeSection)?.label || 'Home';

  const isLiquidEngaged = isDragging || hoveredSection !== null;

  return (
    <>
      {/* Desktop macOS Liquid Glass Floating Pill Navbar (md+) */}
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => {
          setIsPointerInside(false);
          if (!isDragging) setHoveredSection(null);
        }}
        className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[94vw] rounded-full p-1.5 select-none touch-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(246,248,251,0.48) 100%)',
          backdropFilter: 'blur(24px) saturate(190%)',
          WebkitBackdropFilter: 'blur(24px) saturate(190%)',
          boxShadow: isDragging
            ? '0 20px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.05), inset 0 1.5px 1px rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.85), 0 0 0 1.5px rgba(15,23,42,0.07)'
            : '0 14px 38px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1.5px 1px rgba(255,255,255,0.96), inset 0 -1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.85), 0 0 0 1.5px rgba(15,23,42,0.06)',
          transition: 'box-shadow 260ms ease',
        }}
      >
        {/* Top optical glass rim reflection */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-95"
        />

        {/* Cursor-following caustic glass glow across the bar */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: isPointerInside || isDragging ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ background: trackSpecularBg }}
          className="pointer-events-none absolute inset-0 rounded-full"
        />

        {/* Interactive Track (supports both Hover gliding & Pointer Drag / Geser) */}
        <div
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={finishTrackPointer}
          onPointerCancel={finishTrackPointer}
          className={`relative flex items-center gap-1 text-sm font-medium ${
            isDragging ? 'cursor-grabbing' : 'cursor-pointer'
          }`}
        >
          {/* Floating macOS Liquid Glass Lens Droplet */}
          <motion.div
            aria-hidden="true"
            style={{
              x: lensX,
              width: lensWidth,
              scaleX: liquidScaleX,
              scaleY: liquidScaleY,
              opacity: lensReady ? 1 : 0,
            }}
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-0 will-change-transform"
          >
            <motion.div
              animate={{
                scale: isDragging ? 1.12 : isLiquidEngaged ? 1.04 : 1,
                y: isDragging ? -1 : 0,
              }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                background: isDragging
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.34) 48%, rgba(226,236,246,0.58) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(250,252,255,0.58) 52%, rgba(232,238,244,0.68) 100%)',
                backdropFilter: isDragging
                  ? 'blur(8px) saturate(240%) brightness(1.08)'
                  : 'blur(14px) saturate(200%) brightness(1.04)',
                WebkitBackdropFilter: isDragging
                  ? 'blur(8px) saturate(240%) brightness(1.08)'
                  : 'blur(14px) saturate(200%) brightness(1.04)',
                boxShadow: isDragging
                  ? '0 10px 28px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.06), inset 0 2px 2px rgba(255,255,255,1), inset 0 -2px 4px rgba(15,23,42,0.09), inset 1.5px 0 2px rgba(255,255,255,0.95), inset -1.5px 0 2px rgba(255,255,255,0.95), 0 0 0 1px rgba(255,255,255,0.95)'
                  : '0 6px 18px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.04), inset 0 1.5px 1.5px rgba(255,255,255,1), inset 0 -1.5px 3px rgba(15,23,42,0.06), inset 1px 0 1px rgba(255,255,255,0.9), inset -1px 0 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.9)',
              }}
            >
              {/* Top curved specular arc inside droplet */}
              <span className="absolute inset-x-2.5 top-[1px] h-[42%] rounded-full bg-gradient-to-b from-white/90 via-white/35 to-transparent" />

              {/* Bottom refractive edge bounce light */}
              <span className="absolute inset-x-3 bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-white/95 to-transparent" />

              {/* Live cursor-tracking specular glint inside the lens */}
              <motion.span
                style={{ background: lensSpecularBg }}
                animate={{ opacity: isLiquidEngaged ? 1 : 0.4 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 rounded-full"
              />
            </motion.div>
          </motion.div>

          {/* Navigation Labels */}
          {NAV_ITEMS.map((item) => {
            const isHighlighted = visualTargetSection === item.id;
            const isCurrentActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                ref={(el) => {
                  buttonRefs.current[item.id] = el;
                }}
                type="button"
                onMouseEnter={() => {
                  if (!isDragging) setHoveredSection(item.id);
                }}
                aria-current={isCurrentActive ? 'page' : undefined}
                className={`relative z-10 px-4 lg:px-5 py-2 rounded-full transition-all duration-200 whitespace-nowrap select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-pointer'
                } ${
                  isHighlighted
                    ? 'text-neutral-950 font-semibold scale-[1.03]'
                    : isCurrentActive
                    ? 'text-neutral-800 font-medium'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </motion.nav>

      {/* Mobile macOS Liquid Glass Navbar with Hamburger Button (< md) */}
      <div className="md:hidden fixed top-4 inset-x-4 z-50">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-between px-4 py-2 rounded-full border border-white/85 ring-1 ring-neutral-900/[0.07]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(246,248,251,0.52) 100%)',
            backdropFilter: 'blur(22px) saturate(190%)',
            WebkitBackdropFilter: 'blur(22px) saturate(190%)',
            boxShadow:
              '0 12px 32px rgba(0,0,0,0.08), inset 0 1.5px 1px rgba(255,255,255,0.96), inset 0 -1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
          />

          {/* Current active section indicator */}
          <div className="flex items-center gap-2.5 pl-1">
            <span className="w-2 h-2 rounded-full bg-neutral-900" />
            <span className="text-sm font-semibold text-neutral-950 tracking-tight">
              {activeLabel}
            </span>
          </div>

          {/* Liquid-Glass Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="relative overflow-hidden w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-b from-white/95 via-white/60 to-neutral-200/50 backdrop-blur-md border border-white/95 ring-1 ring-neutral-900/[0.08] shadow-[0_4px_14px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.05)] text-neutral-800 active:scale-95 transition-transform cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </motion.div>

        {/* Backdrop & Liquid Glass Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-neutral-950/15 backdrop-blur-[2px] -z-10"
              />

              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2.5 p-2 rounded-3xl border border-white/90 ring-1 ring-neutral-900/[0.08]"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(246,248,252,0.68) 100%)',
                  backdropFilter: 'blur(26px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(26px) saturate(200%)',
                  boxShadow:
                    '0 22px 52px rgba(0,0,0,0.13), inset 0 1.5px 1px rgba(255,255,255,0.98), inset 0 -1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollTo(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-b from-white/95 via-white/70 to-neutral-200/50 border border-white ring-1 ring-neutral-900/[0.08] shadow-[0_6px_16px_rgba(0,0,0,0.07),inset_0_1.5px_1px_rgba(255,255,255,1)] text-neutral-950 font-semibold'
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60 font-medium'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
