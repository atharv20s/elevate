import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollStoryWrapper from "./ScrollStoryWrapper";

const stats = [
  { value: "35+", label: "Years of Practice" },
  { value: "20,000+", label: "Total Cases" },
  { value: "90%+", label: "Success Rate" },
  { value: "10+", label: "Associate Advocates" },
];

const FirmSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Split-screen parallax: text and stats move at different speeds
  const textX = useTransform(scrollYProgress, [0, 0.3, 0.7], [-80, 0, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.7], [0, 1, 1]);
  const statsX = useTransform(scrollYProgress, [0, 0.35, 0.7], [80, 0, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.05, 0.25, 0.7], [0, 1, 1]);

  // Counter-scroll for decorative line
  const lineScale = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <ScrollStoryWrapper
      id="firm"
      chapter="Chapter II"
      chapterTitle="Our Legacy"
      animationType="fade-up"
      className="py-24 md:py-32"
    >
      <div
        ref={sectionRef}
        style={{
          background: "linear-gradient(135deg, hsl(220 20% 8%) 0%, hsl(220 18% 12%) 100%)",
        }}
        className="py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left text — slides in from left */}
            <motion.div style={{ x: textX, opacity: textOpacity }}>
              <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">
                Our Legacy
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                A Tradition of
                <br />
                <span className="text-gradient-gold italic font-serif">Excellence</span>
              </h2>
              <motion.div
                className="w-20 h-[2px] bg-gradient-to-r from-primary to-primary/40 mb-6 origin-left"
                style={{ scaleX: lineScale }}
              />
              <p className="font-body text-[hsl(var(--gold-light))]/70 leading-relaxed mb-4">
                Founded in 1988 by Senior Advocate Mr. B. N. Shukla, BNS LEGAL has an unbroken legacy of over three and a half decades. The firm is registered with Bar Council of Maharashtra and Goa (MAH-LF/802/2024).
              </p>
              <p className="font-body text-[hsl(var(--gold-light))]/70 leading-relaxed">
                With 10 dedicated associate advocates and 5 full-time legal interns under continuous mentorship, BNS LEGAL represents clients across Civil, Criminal, Appellate, Tribunal, and Regulatory Authorities in Mumbai, Thane, and Maharashtra.
              </p>
            </motion.div>

            {/* Right stats — slides in from right with stagger */}
            <motion.div
              style={{ x: statsX, opacity: statsOpacity }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, i) => {
                const StatCard = ({ children }: { children: React.ReactNode }) => {
                  const delay = 0.15 + i * 0.05;
                  const cardOpacity = useTransform(scrollYProgress, [delay, delay + 0.12], [0, 1]);
                  const cardY = useTransform(scrollYProgress, [delay, delay + 0.12], [40, 0]);
                  const cardScale = useTransform(scrollYProgress, [delay, delay + 0.12], [0.85, 1]);

                  return (
                    <motion.div style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}>
                      {children}
                    </motion.div>
                  );
                };

                return (
                  <StatCard key={stat.label}>
                    <div className="p-6 border border-primary/15 text-center">
                      <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                        {stat.value}
                      </p>
                      <p className="font-body text-[hsl(var(--gold-light))]/60 text-xs uppercase tracking-[0.2em]">
                        {stat.label}
                      </p>
                    </div>
                  </StatCard>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </ScrollStoryWrapper>
  );
};

export default FirmSection;
