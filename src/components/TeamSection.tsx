import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Phone, Scale } from "lucide-react";
import ScrollStoryWrapper from "./ScrollStoryWrapper";

const team = [
  { name: "Mr. Deepak Shukla", role: "Advocate", qualifications: "B.L.S., LL.B., LL.M.", specialty: "Civil, Arbitration, DRT, High Court, NCLT, RERA", phone: "9967713812", hasWhatsapp: true },
  { name: "Mr. Sandeep Shukla", role: "Advocate", qualifications: "B.L.S., LL.B., LL.M.", specialty: "Civil, Criminal, Family, Consumer & Co-operative Laws", phone: "9220473363", hasWhatsapp: true },
  { name: "Ms. Neelam S. Shukla", role: "Advocate", qualifications: "B.C.A., M.A., LL.B., LL.M.", specialty: "Criminal, Civil, Family & Women's Rights", phone: "9479256501", hasWhatsapp: true },
  { name: "Mr. Vinayak Shukla", role: "Advocate", qualifications: "B.L.S., LL.B.", specialty: "Civil, Criminal, High Court & Co-operative Courts", phone: "9967713812", hasWhatsapp: false },
  { name: "Mr. Shivprasad Pathak", role: "Advocate", qualifications: "B.A., LL.B.", specialty: "Civil & Criminal Practice — City Civil, Sessions & High Courts", phone: "9967713812", hasWhatsapp: false },
  { name: "Mr. B. N. Shukla", role: "Senior Partner & Founder", qualifications: "B.A., LL.B.", specialty: "Civil, Society & Rent Control Law", phone: "9223438655", hasWhatsapp: false },
];

// Split into rows of 3
const rows = [team.slice(0, 3), team.slice(3, 6)];

const rowVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
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

const TeamSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const headingY = useTransform(scrollYProgress, [0, 0.4], [30, -10]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const noteOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const noteY = useTransform(scrollYProgress, [0.5, 0.65], [30, 0]);

  return (
    <ScrollStoryWrapper
      id="team"
      chapter="Chapter III"
      chapterTitle="Our Counsel"
      animationType="fade-up"
      className="py-24 md:py-32 bg-background"
    >
      <div ref={sectionRef} className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* Heading with depth parallax */}
          <motion.div
            style={{ y: headingY, opacity: headingOpacity }}
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

          {/* Rows reveal one at a time */}
          <div className="flex flex-col gap-5 md:gap-6">
            {rows.map((row, rowIdx) => (
              <RowReveal key={rowIdx}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {row.map((member) => (
                    <div
                      key={member.name}
                      className="group p-5 md:p-6 border border-border bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-lg h-full flex flex-col"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Scale className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="font-body text-primary text-xs uppercase tracking-wider mb-1">
                        {member.role}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground mb-3">
                        {member.qualifications}
                      </p>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed mb-5 flex-grow">
                        {member.specialty}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-auto">
                        <a
                          href={`tel:${member.phone}`}
                          className="inline-flex items-center gap-2 text-xs text-primary/70 hover:text-primary transition-colors bg-primary/10 px-3 py-1.5 rounded-full whitespace-nowrap"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="font-mono">{member.phone}</span>
                        </a>
                        {member.hasWhatsapp && (
                          <a
                            href={`https://api.whatsapp.com/send/?phone=91${member.phone}&text=Hello+BNS+Legal%2C+I+need+a+consultation&type=phone_number&app_absent=0`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs text-[#25D366]/80 hover:text-[#25D366] transition-colors bg-[#25D366]/10 px-3 py-1.5 rounded-full whitespace-nowrap"
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                            <span className="font-mono font-medium">WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </RowReveal>
            ))}
          </div>

          {/* Associate note */}
          <motion.div
            style={{ opacity: noteOpacity, y: noteY }}
            className="mt-8 p-6 border border-border bg-card text-center"
          >
            <p className="font-body text-muted-foreground text-sm">
              <span className="text-primary font-semibold">+ 10 Associate Advocates & 5 Legal Interns</span> practicing across Mumbai, Thane & Navi Mumbai — handling drafting, research, legal advisory, and trial advocacy in Civil, Criminal, Consumer, RERA & Tribunal matters.
            </p>
          </motion.div>
        </div>
      </div>
    </ScrollStoryWrapper>
  );
};

export default TeamSection;
