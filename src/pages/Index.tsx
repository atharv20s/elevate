import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FirmSection from "@/components/FirmSection";
import PracticeSection from "@/components/PracticeSection";
import ResultsSection from "@/components/ResultsSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <FirmSection />
    <PracticeSection />
    <ResultsSection />
    <TeamSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Index;
