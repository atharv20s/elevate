import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Scale, Shield, Gavel, FileText, Users, Building2, Briefcase, Home, Landmark } from "lucide-react";
import ScrollStoryWrapper from "./ScrollStoryWrapper";

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
];

// Split into rows of 3
const rows = [areas.slice(0, 3), areas.slice(3, 6), areas.slice(6, 9)];

const rowVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const RowReveal = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.div
      ref={ref}
      variants={rowVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};

const PracticeSection = () => (
  <ScrollStoryWrapper
    id="practice"
    chapter="Chapter I"
    chapterTitle="Expertise"
    animationType="fade-up"
    className="py-24 md:py-32 bg-background relative overflow-hidden"
  >
    <div>
      {/* Glassmorphic ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-primary/2" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-primary/4 rounded-full blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[hsl(var(--gold-dark))] font-body text-sm uppercase tracking-[0.3em] mb-4">
            Expertise
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Practice Areas
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mx-auto" />
        </div>

        {/* Each row animates in on its own when it enters the viewport */}
        <div className="flex flex-col gap-5 md:gap-8">
          {rows.map((row, rowIdx) => (
            <RowReveal key={rowIdx}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {row.map((area) => (
                  <div
                    key={area.title}
                    className="group p-6 md:p-8 border border-border bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-lg h-full"
                  >
                    <area.icon className="w-8 h-8 text-primary mb-5 transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="font-display text-xl font-semibold text-card-foreground mb-3">
                      {area.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {area.desc}
                    </p>
                  </div>
                ))}
              </div>
            </RowReveal>
          ))}
        </div>
      </div>
    </div>
  </ScrollStoryWrapper>
);

export default PracticeSection;
