import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PracticeSection from "@/components/PracticeSection";
import FirmSection from "@/components/FirmSection";
import TeamSection from "@/components/TeamSection";
import ReviewsSection from "@/components/ReviewsSection";
import InternshipSection from "@/components/InternshipSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const MainPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen relative">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--gold-dark))] via-primary to-white z-[100] origin-left shadow-[0_-2px_10px_rgba(255,191,0,0.3)]"
        style={{ scaleX }}
      />
      <Navbar />
      <HeroSection />
      <PracticeSection />
      <FirmSection />
      <TeamSection />
      <ReviewsSection />
      <ContactSection />
      <InternshipSection />
      <Footer />
      <FloatingWhatsApp />
      <ChatButton />
    </div>
  );
};

export default MainPage;

