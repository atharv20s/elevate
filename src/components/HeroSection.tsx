import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback } from "react";
import justiceStatue from "@/assets/justice-statue.png";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-driven 3D transforms for the statue
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollRotateY = useTransform(scrollYProgress, [0, 0.5], [0, -15]);
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 8]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 1.08, 0.92]);
  const scrollTranslateY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const scrollTranslateX = useTransform(scrollYProgress, [0, 0.6], [0, 40]);

  // Glow effect intensifies as you scroll
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.3, 0.6, 0.1]);

  // Mouse-tracking motion values (raw → spring-smoothed)
  const mouseRotateX = useMotionValue(0);
  const mouseRotateY = useMotionValue(0);
  const mouseMoveX = useMotionValue(0);
  const mouseMoveY = useMotionValue(0);

  // Smooth spring physics for buttery mouse tracking
  const springConfig = { stiffness: 150, damping: 12, mass: 0.5 };
  const smoothRotateX = useSpring(mouseRotateX, springConfig);
  const smoothRotateY = useSpring(mouseRotateY, springConfig);
  const smoothMoveX = useSpring(mouseMoveX, springConfig);
  const smoothMoveY = useSpring(mouseMoveY, springConfig);

  // Handle mouse move over the hero section
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Normalize mouse position to -1 to 1
    const xNorm = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const yNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Tilt: mouse left → statue rotates right, mouse up → statue tilts forward
    mouseRotateY.set(xNorm * 8);
    mouseRotateX.set(-yNorm * 5);
    // Subtle position shift following cursor
    mouseMoveX.set(xNorm * 15);
    mouseMoveY.set(yNorm * 10);
  }, [mouseRotateX, mouseRotateY, mouseMoveX, mouseMoveY]);

  // Reset on mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRotateX.set(0);
    mouseRotateY.set(0);
    mouseMoveX.set(0);
    mouseMoveY.set(0);
  }, [mouseRotateX, mouseRotateY, mouseMoveX, mouseMoveY]);

  // Multi-layered lifelike floating animation
  const floatingAnimation = {
    y: [0, -14, 2, -10, 0],
    x: [0, 3, -2, 4, 0],
    scale: [1, 1.008, 0.997, 1.005, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: [0, 0.25, 0.5, 0.75, 1],
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 px-6 md:px-0"
      style={{
        background: "linear-gradient(135deg, hsl(220 20% 6%) 0%, hsl(220 15% 14%) 50%, hsl(220 12% 20%) 100%)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glassmorphic ambient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Subtle left side overlay for text contrast only */}
      <div
        className="absolute left-0 top-0 w-full md:w-1/3 h-full z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, hsl(220 20% 6% / 0.85) 0%, hsl(220 20% 6% / 0.5) 80%, transparent 100%)",
        }}
      />

      {/* 3D Background image - positioned right - with parallax + mouse tracking */}
      <div
        className="absolute right-0 top-0 w-full md:w-2/3 h-full flex items-end md:items-center justify-end z-5"
        style={{ perspective: "1200px" }}
      >
        {/* Golden glow behind statue */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: glowOpacity }}
        >
          <div
            className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(43 80% 50% / 0.25) 0%, hsl(43 80% 50% / 0.08) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </motion.div>

        {/* 3D Statue: scroll transforms + mouse-tracking tilt */}
        <motion.div
          className="w-full h-full"
          style={{
            opacity,
            rotateY: smoothRotateY,
            rotateX: smoothRotateX,
            scale,
            y: scrollTranslateY,
            x: scrollTranslateX,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Inner wrapper: scroll-based rotation layered underneath */}
          <motion.div
            className="w-full h-full"
            style={{
              rotateY: scrollRotateY,
              rotateX: scrollRotateX,
              x: smoothMoveX,
              y: smoothMoveY,
              transformStyle: "preserve-3d",
            }}
          >
            <motion.img
              src={justiceStatue}
              alt="Lady Justice statue in bronze, blindfolded, holding scales and sword"
              className="w-full h-full object-contain md:object-cover object-right brightness-125 contrast-120 saturate-125"
              animate={floatingAnimation}
              style={{
                filter: "drop-shadow(0 0 40px hsl(43 80% 50% / 0.3)) drop-shadow(0 20px 60px rgba(0,0,0,0.5))",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Text content - glassmorphic container */}
      <div className="relative z-20 w-full md:w-1/2 py-16 md:py-24">
        <div className="max-w-xl pl-0 md:pl-12 lg:pl-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-body text-primary tracking-[0.35em] uppercase text-xs mb-8 drop-shadow-lg">
              Established 1988
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-8 text-primary drop-shadow-2xl italic font-serif"
          >
            BNS
            <br />
            <span className="text-primary">Legal</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mb-10 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-body text-base md:text-lg leading-relaxed text-foreground/90 drop-shadow-lg mb-12 max-w-lg"
          >
            Relentless advocacy. Unwavering integrity.
            <br />
            Justice is not just our practice — it's our promise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col gap-4 w-fit"
          >
            <a
              href="#contact"
              className="inline-block px-6 md:px-8 py-3 md:py-3.5 bg-primary text-primary-foreground font-body font-semibold text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[hsl(var(--gold-light))] hover:shadow-lg hover:shadow-primary/20"
            >
              Schedule a Consultation
            </a>
            <a
              href="#practice"
              className="inline-block px-6 md:px-8 py-3 md:py-3.5 border border-primary/50 text-primary font-body text-xs md:text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:border-primary hover:bg-primary/10"
            >
              Our Practice Areas
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

