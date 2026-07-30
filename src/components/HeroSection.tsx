import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense } from "react";
import ThreeStatue from "@/components/ThreeStatue";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-20 px-6 md:px-0"
      style={{
        background: "linear-gradient(135deg, hsl(220 20% 6%) 0%, hsl(220 15% 14%) 50%, hsl(220 12% 20%) 100%)",
      }}
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

      {/* 3D statue viewport – replaces the static image */}
      <div
        className="absolute right-0 top-0 w-full md:w-[60%] h-full z-5"
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
