import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, Scale } from "lucide-react";

const team = [
  { name: "Mr. B. N. Shukla", role: "Senior Partner & Founder", qualifications: "B.A., LL.B.", specialty: "Civil, Society & Rent Control Law", phone: "9223438655", since: "1988" },
  { name: "Mr. Deepak Shukla", role: "Advocate", qualifications: "B.L.S., LL.B., LL.M.", specialty: "Civil, Arbitration, DRT, High Court, NCLT, RERA", phone: "9967713812" },
  { name: "Mr. Sandeep Shukla", role: "Advocate", qualifications: "B.L.S., LL.B., LL.M.", specialty: "Civil, Criminal, Family, Consumer & Co-operative Laws", phone: "9220473363" },
  { name: "Ms. Neelam S. Shukla", role: "Advocate", qualifications: "B.C.A., M.A., LL.B., LL.M.", specialty: "Criminal, Civil, Family & Women's Rights", phone: "9479256501" },
  { name: "Mr. Vinayak Shukla", role: "Advocate", qualifications: "B.L.S., LL.B.", specialty: "Civil, Criminal, High Court & Co-operative Courts", phone: "8655890872" },
  { name: "Mr. Shivprasad Pathak", role: "Advocate", qualifications: "B.A., LL.B.", specialty: "Civil & Criminal Practice — City Civil, Sessions & High Courts", phone: "9867289818" },
];

const TeamSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" ref={ref} className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[hsl(var(--gold-dark))] font-body text-sm uppercase tracking-[0.3em] mb-4">
            Our Counsel
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mx-auto mb-6" />
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            The minds behind the strategy. Each member brings specialized experience and unwavering dedication.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group p-6 border border-border bg-card hover:border-primary/40 transition-all duration-500"
            >
              {/* Law icon avatar */}
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Scale className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">
                {member.name}
              </h3>
              <p className="font-body text-primary text-xs uppercase tracking-wider mb-1">
                {member.role}
              </p>
              <p className="font-mono text-xs text-muted-foreground mb-2">
                {member.qualifications}
              </p>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-3">
                {member.specialty}
              </p>
              <a
                href={`tel:${member.phone}`}
                className="inline-flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span className="font-mono">{member.phone}</span>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Associate advocates note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 p-6 border border-border bg-card text-center"
        >
          <p className="font-body text-muted-foreground text-sm">
            <span className="text-primary font-semibold">+ 10 Associate Advocates & 5 Legal Interns</span> practicing across Mumbai, Thane & Navi Mumbai — handling drafting, research, legal advisory, and trial advocacy in Civil, Criminal, Consumer, RERA & Tribunal matters.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
