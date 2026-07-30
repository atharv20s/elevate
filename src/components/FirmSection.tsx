import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "35+", label: "Years of Practice" },
  { value: "20,000+", label: "Total Cases" },
  { value: "90%+", label: "Success Rate" },
  { value: "10+", label: "Associate Advocates" },
];

const FirmSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="firm"
      ref={ref}
      className="py-24 md:py-32"
      style={{
        background: "radial-gradient(ellipse at 30% 50%, #1a202c 0%, #0f172a 50%, #020617 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">
              Our Legacy
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              A Tradition of
              <br />
              <span className="text-gradient-gold italic font-serif">Excellence</span>
            </h2>
            <div className="w-20 h-[2px] bg-gradient-to-r from-primary to-primary/40 mb-6" />
            <p className="font-body text-[hsl(var(--gold-light))]/70 leading-relaxed mb-4">
              Founded in 1988 by Senior Advocate Mr. B. N. Shukla, BNS LEGAL has an unbroken legacy of over three and a half decades. The firm is registered with Bar Council of Maharashtra and Goa (MAH-LF/802/2024).
            </p>
            <p className="font-body text-[hsl(var(--gold-light))]/70 leading-relaxed">
              With 10 dedicated associate advocates and 5 full-time legal interns under continuous mentorship, BNS LEGAL represents clients across Civil, Criminal, Appellate, Tribunal, and Regulatory Authorities in Mumbai, Thane, and Maharashtra.
            </p>
          </motion.div>

          {/* Right stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="p-6 border border-primary/15 text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="font-body text-[hsl(var(--gold-light))]/60 text-xs uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FirmSection;
