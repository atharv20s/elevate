import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "98%", label: "Success Rate" },
  { value: "$4.2B", label: "Recovered for Clients" },
  { value: "37", label: "Years of Excellence" },
  { value: "500+", label: "Landmark Cases" },
];

const ResultsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="results" ref={ref} className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-light via-background to-background" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <span className="chapter-number">Chapter 03</span>
          <h2 className="section-title">
            The <span className="text-gradient-gold">Record</span>
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="glass-panel p-8 text-center group hover:border-primary/30 transition-all duration-500"
            >
              <div className="stat-value mb-3 group-hover:text-foreground transition-colors duration-300">
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
