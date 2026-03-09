import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const team = [
  { name: "Victoria Ashworth", role: "Managing Partner", specialty: "Complex Litigation" },
  { name: "Marcus Chen", role: "Senior Partner", specialty: "Corporate M&A" },
  { name: "Elena Vasquez", role: "Partner", specialty: "Regulatory Defense" },
  { name: "James Blackwood", role: "Partner", specialty: "Intellectual Property" },
];

const TeamSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" ref={ref} className="relative py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--gold)/0.04)_0%,transparent_60%)]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <span className="chapter-number">Chapter 05</span>
          <h2 className="section-title">
            The <span className="text-gradient-gold">Counsel</span>
          </h2>
          <div className="divider-gold mx-auto" />
          <p className="section-subtitle mx-auto">
            The minds behind the strategy. Each partner brings decades of 
            specialized experience to every engagement.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              className="glass-panel overflow-hidden group"
            >
              {/* Placeholder portrait area */}
              <div className="aspect-[3/4] bg-gradient-to-b from-charcoal-medium to-background relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
              </div>
              <div className="p-6 space-y-1">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="font-mono text-xs tracking-wider text-primary uppercase">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm">
                  {member.specialty}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
