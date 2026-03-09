import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import justiceStatue from "@/assets/justice-statue.png";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scrollLineY = useTransform(scrollYProgress, [0, 1], [0, 8]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-end overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(220 20% 6%) 0%, hsl(220 15% 14%) 50%, hsl(220 12% 20%) 100%)",
      }}
    >
      {/* Dark overlays */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(transparent 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.6) 75%, hsl(220 20% 6%) 100%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-1/2 h-full z-10 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, hsl(220 20% 6% / 0.7) 0%, transparent 100%)",
        }}
      />

      {/* Background image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="w-full h-full" style={{ opacity }}>
          <img
            src={justiceStatue}
            alt="Lady Justice statue in bronze, blindfolded, holding scales and sword"
            className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
          />
        </motion.div>
      </div>

      {/* Text content - bottom left */}
      <div className="relative z-20 px-8 md:px-16 pb-24 md:pb-32 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-body text-primary tracking-[0.35em] uppercase text-xs mb-5 drop-shadow-lg">
            Established 1988
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-4 text-primary drop-shadow-2xl"
        >
          BNS
          <br />
          <span className="text-gradient-gold italic font-serif">Legal</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mb-5 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-body text-lg md:text-xl max-w-md mb-10 font-light tracking-wide leading-relaxed text-foreground/85 drop-shadow-lg"
        >
          Relentless advocacy. Unwavering integrity.
          <br />
          Justice is not just our practice — it's our promise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#contact"
            className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[hsl(var(--gold-light))] hover:shadow-lg hover:shadow-primary/20"
          >
            Schedule a Consultation
          </a>
          <a
            href="#practice"
            className="inline-block px-8 py-3.5 border border-primary/50 text-primary font-body text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:border-primary hover:bg-primary/10"
          >
            Our Practice Areas
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
        className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-primary/50 text-xs font-body uppercase tracking-[0.2em]">
          Scroll
        </span>
        <motion.div
          style={{ y: scrollLineY }}
          className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
