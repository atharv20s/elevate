import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Award, Globe } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "Uncompromising Advocacy",
    description: "Every case is a commitment to excellence. We approach each matter with the precision and tenacity that has defined our four-decade legacy.",
  },
  {
    icon: Award,
    title: "Proven Track Record",
    description: "Recognized by peers and publications alike as one of the most feared litigation firms in the nation.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "With offices spanning three continents, we bring international perspective to every domestic challenge.",
  },
];

const FirmSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="firm" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--gold)/0.03)_0%,transparent_60%)]" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <span className="chapter-number">Chapter 02</span>
          <h2 className="section-title">
            The <span className="text-gradient-gold">Firm</span>
          </h2>
          <div className="divider-gold mx-auto" />
          <p className="section-subtitle mx-auto">
            Founded on the principle that every client deserves not just 
            representation, but a strategic partner who will fight with 
            unwavering conviction.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="glass-panel-gold p-8 group hover:border-primary/40 transition-all duration-500"
            >
              <pillar.icon className="w-10 h-10 text-primary mb-6 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FirmSection;
