import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';

/**
 * Ultra-thin top progress bar synced to page scroll
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-neutral-950 via-neutral-600 to-neutral-300 origin-left z-[60] pointer-events-none"
    />
  );
}

type RevealVariant = 'scale' | 'left' | 'right' | 'up' | 'tilt3d';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Clean viewport-triggered scroll reveal:
 * - scale: kecil -> besar
 * - left: kanan -> kiri
 * - right: kiri -> kanan
 * - up: bawah -> atas
 * - tilt3d: 3D perspective unfold + scale
 */
export function ScrollReveal({
  children,
  variant = 'scale',
  delay = 0,
  duration = 0.7,
  className = '',
}: ScrollRevealProps) {
  const initialMap: Record<RevealVariant, Record<string, number>> = {
    scale: { opacity: 0, scale: 0.88, y: 26 },
    left: { opacity: 0, x: 64, scale: 0.96 },
    right: { opacity: 0, x: -64, scale: 0.96 },
    up: { opacity: 0, y: 36 },
    tilt3d: { opacity: 0, scale: 0.9, y: 36, rotateX: 16, rotateY: -6 },
  };

  const animateMap: Record<RevealVariant, Record<string, number>> = {
    scale: { opacity: 1, scale: 1, y: 0 },
    left: { opacity: 1, x: 0, scale: 1 },
    right: { opacity: 1, x: 0, scale: 1 },
    up: { opacity: 1, y: 0 },
    tilt3d: { opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 },
  };

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        initial={initialMap[variant]}
        whileInView={animateMap[variant]}
        viewport={{ once: true, amount: 'some' }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ScrollZoomSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Continuous scroll-linked zoom (kecil -> besar) + subtle 3D pitch as element scrolls into view
 */
export function ScrollZoomSection({
  children,
  className = '',
}: ScrollZoomSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.6,
  });

  const scale = useTransform(smoothProgress, [0, 1], [0.92, 1]);
  const rotateX = useTransform(smoothProgress, [0, 1], [8, 0]);
  const y = useTransform(smoothProgress, [0, 1], [32, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.4, 1], [0.35, 0.9, 1]);

  return (
    <div ref={ref} style={{ perspective: 1400 }} className={className}>
      <motion.div
        style={{
          scale,
          rotateX,
          y,
          opacity,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center bottom',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ScrollHorizontalTrackProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  distance?: number;
  className?: string;
}

/**
 * Continuous scroll-linked horizontal parallax (kanan -> kiri atau kiri -> kanan)
 */
export function ScrollHorizontalTrack({
  children,
  direction = 'left',
  distance = 64,
  className = '',
}: ScrollHorizontalTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.5,
  });

  const x = useTransform(
    smoothProgress,
    [0, 1],
    direction === 'left' ? [distance, -distance] : [-distance, distance]
  );

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      <motion.div style={{ x }}>{children}</motion.div>
    </div>
  );
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  offsetY?: number;
  offsetX?: number;
  desktopOnly?: boolean;
  className?: string;
}

/**
 * Smooth continuous vertical/horizontal parallax wrapper synced to viewport scroll
 */
export function ParallaxLayer({
  children,
  offsetY = 36,
  offsetX = 0,
  desktopOnly = false,
  className = '',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(!desktopOnly);

  useEffect(() => {
    if (!desktopOnly) return;
    const check = () => setEnabled(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [desktopOnly]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
  });

  const y = useTransform(smooth, [0, 1], enabled ? [offsetY, -offsetY] : [0, 0]);
  const x = useTransform(smooth, [0, 1], enabled ? [offsetX, -offsetX] : [0, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, x }} className="h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}

/**
 * Editorial image parallax inside an overflow-hidden frame:
 * the image smoothly glides vertically as you scroll past the card
 */
export function ParallaxImage({
  src,
  alt,
  className = '',
  strength = 12,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.45,
  });

  const y = useTransform(smooth, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className="w-full h-full overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        style={{ y, scale: 1.24 }}
        className={`w-full h-full object-cover will-change-transform ${className}`}
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
}

interface ParallaxSectionBackdropProps {
  label: string;
  direction?: 'left' | 'right';
}

/**
 * Subtle multi-plane background parallax layer with faint editorial watermark & warm ambient ring
 */
export function ParallaxSectionBackdrop({
  label,
  direction = 'left',
}: ParallaxSectionBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.6,
  });

  const textX = useTransform(
    smooth,
    [0, 1],
    direction === 'left' ? ['8%', '-10%'] : ['-10%', '8%']
  );
  const textY = useTransform(smooth, [0, 1], [60, -60]);
  const orbY = useTransform(smooth, [0, 1], [-80, 90]);
  const ringRotate = useTransform(smooth, [0, 1], [0, direction === 'left' ? 35 : -35]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      {/* Slow-drifting editorial watermark */}
      <motion.div
        style={{ x: textX, y: textY }}
        className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6.5rem] sm:text-[9rem] md:text-[12rem] font-black tracking-[0.18em] text-neutral-950/[0.03] uppercase will-change-transform"
      >
        {label}
      </motion.div>

      {/* Soft neutral parallax orb */}
      <motion.div
        style={{ y: orbY }}
        className={`absolute top-1/3 ${
          direction === 'left' ? '-right-24' : '-left-24'
        } w-72 h-72 rounded-full bg-neutral-200/50 blur-3xl will-change-transform`}
      />

      {/* Subtle architectural rotating ring */}
      <motion.div
        style={{ y: textY, rotate: ringRotate }}
        className={`absolute bottom-12 ${
          direction === 'left' ? 'left-8' : 'right-8'
        } w-44 h-44 rounded-full border border-dashed border-neutral-300/80 hidden md:block will-change-transform`}
      />
    </div>
  );
}

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  onClick?: () => void;
}

/**
 * Subtle, modern 3D perspective card with interactive pointer tilt & warm sheen
 */
export function Tilt3DCard({
  children,
  className = '',
  maxTilt = 6,
  onClick,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]),
    { stiffness: 220, damping: 24 }
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]),
    { stiffness: 220, damping: 24 }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.max(0, Math.min(1, px)));
    mouseY.set(Math.max(0, Math.min(1, py)));
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`relative h-full will-change-transform ${className}`}
      >
        {children}
        {/* Subtle neutral light reflection overlay on hover */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(163,163,163,0.06) 55%, rgba(0,0,0,0.04) 100%)',
          }}
        />
      </motion.div>
    </div>
  );
}
