import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Building2, Gavel, FileText, Users, ShieldCheck } from "lucide-react";

const areas = [
  { icon: Gavel, title: "Complex Litigation", desc: "High-stakes disputes demanding aggressive, strategic advocacy." },
  { icon: Building2, title: "Corporate M&A", desc: "Guiding transformative transactions from inception to close." },
  { icon: Briefcase, title: "Private Equity", desc: "Structuring deals that maximize value and minimize exposure." },
  { icon: ShieldCheck, title: "Regulatory Defense", desc: "Navigating federal and international compliance landscapes." },
  { icon: FileText, title: "Intellectual Property", desc: "Protecting innovation across global markets." },
  { icon: Users, title: "Family Office", desc: "Discreet, comprehensive counsel for generational wealth." },
];

const PracticeSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="practice" ref={ref} className="relative py-32">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <span className="chapter-number">Chapter 04</span>
          <h2 className="section-title">
            Areas of <span className="text-gradient-gold">Mastery</span>
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass-panel p-8 group cursor-pointer hover:border-primary/30 transition-all duration-500 hover:translate-y-[-2px]"
            >
              <area.icon className="w-8 h-8 text-primary/70 mb-5 group-hover:text-primary transition-colors duration-300" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {area.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {area.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeSection;
