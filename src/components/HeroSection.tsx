import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense } from "react";
import ThreeStatue from "@/components/ThreeStatue";

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
        background: "radial-gradient(circle at 70% 30%, #1a202c 0%, #0f172a 60%, #020617 100%)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Studio backdrop mesh layers */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(at 0% 0%, hsl(210 10% 15%) 0px, transparent 50%), radial-gradient(at 100% 100%, hsl(210 15% 8%) 0px, transparent 50%)",
          }}
        />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        {/* Noise overlay for premium tactile feel */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      {/* Subtle left side overlay for text contrast only */}
      <div
        className="absolute left-0 top-0 w-full md:w-[40%] h-full z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #020617 0%, rgba(2,6,23,0.7) 60%, transparent 100%)",
        }}
      />

      {/* 3D statue viewport – replaces the static image */}
      <div
        className="absolute right-0 top-0 w-full md:w-[75%] h-full z-5"
      >
        <motion.div className="w-full h-full" style={{ opacity }}>
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            }
          >
            <ThreeStatue />
          </Suspense>
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

      {/* Text content */}
      <div className="relative z-20 w-full md:w-[45%] py-12 md:py-16 flex items-center">
        <div className="max-w-xl pl-4 md:pl-12 lg:pl-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-body text-primary tracking-[0.35em] uppercase text-[11px] mb-4 drop-shadow-lg">
              Established 1988
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.88] mb-4 text-primary drop-shadow-2xl italic font-serif"
          >
            BNS
            <br />
            <span className="text-primary">Legal</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="w-20 h-[2px] bg-gradient-to-r from-primary to-primary/40 mb-5 origin-left"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-sm md:text-base uppercase tracking-[0.2em] text-foreground/50 mb-6"
          >
            Senior Advocate B. N. Shukla
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-body text-base md:text-lg leading-relaxed text-foreground/85 drop-shadow-lg mb-8 max-w-md"
          >
            Relentless advocacy. Unwavering integrity.
            <br />
            Justice is not just our practice — it's our promise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 w-fit mb-10"
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

          {/* Accent tagline to fill bottom space */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center gap-3"
          >
            <div className="w-[2px] h-8 bg-gradient-to-b from-primary/60 to-transparent" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground leading-relaxed">
              Defenders of Justice
              <br />
              <span className="text-primary/50">Since Three Decades</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

