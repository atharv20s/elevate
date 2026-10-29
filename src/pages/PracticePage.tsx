import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import PracticeSection from "@/components/PracticeSection";
import TeamSection from "@/components/TeamSection";
import InternshipSection from "@/components/InternshipSection";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

/**
 * PracticePage — Route: /practice-areas
 * Contains: Practice Areas, Team/Counsel, Internship applications.
 * Has its own unique title and meta description injected via useEffect.
 */
const PracticePage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Page-specific title & meta override for this route
  useEffect(() => {
    document.title = "Practice Areas – BNS Legal | Civil, Criminal, Family & Corporate Law Mumbai";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Explore BNS Legal's practice areas: Civil Litigation, Criminal Defence, Bombay High Court, Family & Matrimonial, Consumer Law, Co-operative Society, NCLT, DRT, RERA, and Redevelopment. Meet our expert team of advocates."
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://bnslegal.in/practice-areas");
    return () => {
      // Restore home title on unmount
      document.title = "BNS Legal | Senior Advocate B.N. Shukla – Mumbai Law Firm";
      if (meta) {
        meta.setAttribute("content", "BNS Legal – Chambers of Senior Advocate B.N. Shukla. Expert legal services in Civil Litigation, Criminal Defense, High Court Practice, Family Law, Consumer Law, and Corporate matters. Serving Mumbai, Maharashtra since 1988.");
      }
      if (canonical) canonical.setAttribute("href", "https://bnslegal.in/");
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      <motion.div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--gold-dark))] via-primary to-white z-[100] origin-left shadow-[0_-2px_10px_rgba(255,191,0,0.3)]"
        style={{ scaleX }}
      />
      <Navbar />
      <main id="main-content" aria-label="Practice areas and team">
        {/* Page heading for this route */}
        <div
          className="pt-28 pb-8 px-6 text-center"
          style={{ background: "linear-gradient(135deg, hsl(220 20% 6%) 0%, hsl(220 15% 14%) 100%)" }}
        >
          <p className="text-primary font-body text-xs uppercase tracking-[0.35em] mb-3">BNS Legal</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            Our Practice Areas
          </h1>
          <div className="w-20 h-[2px] bg-gradient-to-r from-primary to-primary/40 mx-auto" />
        </div>
        <PracticeSection />
        <TeamSection />
        <InternshipSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ChatButton />
    </div>
  );
};

export default PracticePage;
