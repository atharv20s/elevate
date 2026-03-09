import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import justiceStatue from "@/assets/justice-statue.png";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const statueY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const statueRotate = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const statueScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-charcoal-light" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.05)_0%,transparent_70%)]" />

      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center pt-24">
        {/* Left: Text */}
        <motion.div style={{ y: textY, opacity }} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="chapter-number">Est. 1987 — Chapter 01</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="section-title"
          >
            Beyond
            <br />
            <span className="text-gradient-gold">Justice</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="divider-gold"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="section-subtitle"
          >
            Where precision meets advocacy. We engineer legal outcomes with the 
            same relentless pursuit of excellence that defines the world's most 
            elite performers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#contact" className="cta-primary">
              Request Consultation
            </a>
            <a href="#firm" className="cta-glass">
              Explore Our Story
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Statue */}
        <motion.div
          style={{ y: statueY, rotateX: statueRotate, scale: statueScale }}
          className="relative perspective-1000 flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.12)_0%,transparent_70%)] animate-gold-pulse" />
            <img
              src={justiceStatue}
              alt="Lady Justice — symbol of fairness, law, and authority"
              className="relative w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Scroll to Explore
        </span>
        <ArrowDown className="w-4 h-4 text-primary animate-float" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
