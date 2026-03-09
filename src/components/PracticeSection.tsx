import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Scale, Shield, Gavel, FileText, Users, Building2, Briefcase, Home, Landmark, HardHat } from "lucide-react";

const areas = [
  { icon: Scale, title: "Civil Litigation", desc: "Property disputes, co-operative society matters, redevelopment issues, RERA, NCLT, DRT, Rent Act matters, injunctions, and recovery." },
  { icon: Shield, title: "Criminal Defense", desc: "Cheating, fraud, breach of trust, assault, domestic violence, bail, FIR quashing, and trial defense." },
  { icon: Landmark, title: "High Court Practice", desc: "Expert representation before the Bombay High Court — writ petitions, appeals, revisions, and PILs." },
  { icon: Users, title: "Family & Matrimonial", desc: "Divorce petitions, maintenance, custody, domestic violence, mediation, and women's rights protection." },
  { icon: FileText, title: "Consumer Law", desc: "Consumer disputes, deficiency of services, unfair trade practices, and consumer appellate proceedings." },
  { icon: Building2, title: "Co-operative Society", desc: "Society disputes, elections, recovery cases, and proceedings before Co-operative Court and Registrar." },
  { icon: Gavel, title: "Corporate & Tribunal", desc: "NCLT, DRT, RERA, Arbitration Panels, corporate restructuring, and compliance issues." },
  { icon: Briefcase, title: "Legal Advisory", desc: "Drafting of agreements, contracts, notices, affidavits, deeds, and comprehensive legal opinions." },
  { icon: Home, title: "Redevelopment", desc: "End-to-end legal support for co-operative housing society redevelopment — title verification to dispute resolution." },
  { icon: HardHat, title: "Labour Laws", desc: "Comprehensive advisory, compliance, and litigation support in Labour & Employment Laws." },
];

const PracticeSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="practice" ref={ref} className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[hsl(var(--gold-dark))] font-body text-sm uppercase tracking-[0.3em] mb-4">
            Expertise
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Practice Areas
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="group p-8 border border-border bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-lg"
            >
              <area.icon className="w-8 h-8 text-primary mb-5 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="font-display text-xl font-semibold text-card-foreground mb-3">
                {area.title}
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
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
