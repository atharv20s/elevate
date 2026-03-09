import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PracticeSection from "@/components/PracticeSection";
import FirmSection from "@/components/FirmSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <PracticeSection />
    <FirmSection />
    <TeamSection />
    <ContactSection />
    <Footer />
    <ChatButton />
  </div>
);

export default Index;
