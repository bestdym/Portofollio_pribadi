import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection({ profile }: { profile: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
  });

  // Subtle pointer-reactive parallax for midground ambient shapes
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 90, damping: 24 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 90, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(nx * 28);
    pointerY.set(ny * 20);
  };

  // Layer 1 (Far Background): Slow-moving watermark & concentric ring
  const bgWatermarkY = useTransform(smoothProgress, [0, 1], [0, 180]);
  const bgWatermarkScale = useTransform(smoothProgress, [0, 1], [1, 1.12]);
  const ringRotate = useTransform(smoothProgress, [0, 1], [0, 40]);
  const ringY = useTransform(smoothProgress, [0, 1], [0, 130]);

  // Layer 2 (Midground Orbs): Opposite horizontal + vertical drift
  const orbLeftX = useTransform(smoothProgress, [0, 1], [0, -120]);
  const orbLeftY = useTransform(smoothProgress, [0, 1], [0, 140]);
  const orbRightX = useTransform(smoothProgress, [0, 1], [0, 120]);
  const orbRightY = useTransform(smoothProgress, [0, 1], [0, -90]);

  // Layer 3 (Foreground Content): Staggered Z-depth speeds on scroll
  const contentScale = useTransform(smoothProgress, [0, 1], [1, 0.9]);
  const contentRotateX = useTransform(smoothProgress, [0, 1], [0, 10]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0.1]);

  const avatarY = useTransform(smoothProgress, [0, 1], [0, -115]);
  const headingY = useTransform(smoothProgress, [0, 1], [0, -75]);
  const bioY = useTransform(smoothProgress, [0, 1], [0, -45]);
  const ctaY = useTransform(smoothProgress, [0, 1], [0, -20]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Layer 1 & 2: Multi-Plane Parallax Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Far background editorial watermark */}
        <motion.div
          style={{ y: bgWatermarkY, scale: bgWatermarkScale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[7rem] sm:text-[11rem] md:text-[15rem] font-black tracking-[0.16em] text-[#1C1917]/[0.028] uppercase will-change-transform"
        >
          PORTFOLIO
        </motion.div>

        {/* Warm Cream/Brown Orbs with opposing scroll parallax */}
        <motion.div
          style={{ x: orbLeftX, y: orbLeftY }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#D6C7B2]/40 blur-3xl will-change-transform"
        />
        <motion.div
          style={{ x: orbRightX, y: orbRightY }}
          className="absolute bottom-6 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#8C6239]/12 blur-3xl will-change-transform"
        />

        {/* Rotating concentric architectural rings */}
        <motion.div
          style={{
            y: ringY,
            rotate: ringRotate,
            x: smoothPointerX,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] md:w-[42rem] md:h-[42rem] rounded-full border border-[#E7E1D8]/80 will-change-transform"
        >
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8C6239]/40" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#1C1917]/25" />
        </motion.div>

        <motion.div
          style={{
            y: smoothPointerY,
            x: smoothPointerX,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[22rem] md:w-[28rem] md:h-[28rem] rounded-full border border-dashed border-[#8C6239]/15 will-change-transform"
        />
      </div>

      {/* Layer 3: Staggered Foreground Hero Content */}
      <div
        style={{ perspective: 1200 }}
        className="relative z-10 text-center px-4 max-w-3xl mx-auto"
      >
        <motion.div
          style={{
            scale: contentScale,
            rotateX: contentRotateX,
            opacity: contentOpacity,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            {/* Avatar layer (drifts fastest) */}
            <motion.div style={{ y: avatarY }}>
              {profile?.avatar_url ? (
                <motion.img
                  whileHover={{ scale: 1.06, rotateZ: -2 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-[#FFFDF9] shadow-[0_12px_30px_rgba(28,25,23,0.1)] object-cover bg-[#FFFDF9]"
                />
              ) : (
                <motion.div
                  whileHover={{ scale: 1.06, rotateZ: -3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="w-24 h-24 rounded-full mx-auto mb-6 bg-[#EAE4DC] text-[#8C6239] flex items-center justify-center text-4xl shadow-[0_12px_30px_rgba(28,25,23,0.08)] border-4 border-[#FFFDF9]"
                >
                  👋
                </motion.div>
              )}

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFDF9] border border-[#E7E1D8] text-xs font-semibold text-[#8C6239] uppercase tracking-[0.18em] mb-5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6239]" />
                Hello, I am {profile?.name || 'A Developer'}
              </div>
            </motion.div>

            {/* Headline layer */}
            <motion.h1
              style={{ y: headingY }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#1C1917] tracking-tight mb-6 leading-[1.08]"
            >
              Building <span className="text-[#8C6239]">Digital</span> Experiences.
            </motion.h1>

            {/* Bio layer */}
            <motion.p
              style={{ y: bioY }}
              className="text-base sm:text-lg md:text-xl text-[#57534E] max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {profile?.bio ||
                'I am a frontend engineer passionate about crafting fluid UI experiences and clean modern interfaces.'}
            </motion.p>

            {/* Buttons layer (drifts slowest for depth separation) */}
            <motion.div
              style={{ y: ctaY }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="px-8 py-4 bg-[#1C1917] text-[#FFFDF9] rounded-full font-medium hover:bg-[#8C6239] transition-colors duration-300 shadow-[0_14px_30px_rgba(28,25,23,0.16)] cursor-pointer"
              >
                Explore My Universe
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="px-7 py-4 bg-[#FFFDF9] text-[#1C1917] border border-[#D6C7B2] rounded-full font-medium hover:border-[#8C6239] hover:text-[#8C6239] transition-colors duration-300 cursor-pointer"
              >
                View Projects
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Scroll Hint */}
      <motion.button
        onClick={() =>
          document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 1, duration: 0.6 },
          y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#78716C] hover:text-[#1C1917] transition-colors flex flex-col items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] cursor-pointer z-10"
        aria-label="Scroll ke bawah"
      >
        <span>Scroll</span>
        <ArrowDown className="w-4 h-4" />
      </motion.button>
    </section>
  );
}
