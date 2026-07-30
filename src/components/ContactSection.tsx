import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ScrollStoryWrapper from "./ScrollStoryWrapper";

const offices = [
  {
    label: "Head Office (Mira Road)",
    address: "103, Laxmi Classic CHS Ltd., Near Park View Hotel, Laxmi Park, Kanakia Road, Mira Road (E), Thane – 401105",
    mapQuery: "Laxmi+Classic+CHS+Ltd+Laxmi+Park+103+Kanakia+Rd+Mira+Road+East+Thane+Maharashtra+401105",
  },
  {
    label: "Branch (Dadar)",
    address: "4, Prabhadevi Building (Dolly House), Khed Galli, Sayani Road, Dadar (W), Mumbai – 400025",
    mapQuery: "Prabhadevi+Building+Khed+Galli+Sayani+Road+Dadar+Mumbai+400025",
  },
  {
    label: "Branch (Fort)",
    address: "102, Parikh Mansion, Near Pratap Lunch Home, Janmabhoomi Marg, Fort, Mumbai – 400001",
    mapQuery: "Parikh+Mansion+Janmabhoomi+Marg+Fort+Mumbai+400001",
  },
];

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Heading animation
  const headingOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.12], [40, 0]);

  // Form scales up from center
  const formOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const formScale = useTransform(scrollYProgress, [0.05, 0.2], [0.9, 1]);
  const formX = useTransform(scrollYProgress, [0.05, 0.2], [-60, 0]);

  // Contact info slides from right
  const infoOpacity = useTransform(scrollYProgress, [0.08, 0.22], [0, 1]);
  const infoX = useTransform(scrollYProgress, [0.08, 0.22], [60, 0]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      const { data: result, error } = await supabase.functions.invoke("send-notification", {
        body: { type: "consultation", data },
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Consultation request submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollStoryWrapper
      id="contact"
      chapter="Chapter V"
      chapterTitle="Reach Out"
      animationType="zoom"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      <div ref={sectionRef} className="py-24 md:py-32">
        {/* Glassmorphic background with 3D effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            style={{ opacity: headingOpacity, y: headingY }}
            className="text-center mb-16"
          >
            <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">
              Get in Touch
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Free Consultation
            </h2>
            <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mx-auto mb-6" />
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Every great case begins with a conversation. Reach out today and let us fight for what's right.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Form Container — slides in from left with scale */}
            <motion.div
              style={{ opacity: formOpacity, scale: formScale, x: formX }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-display text-xl text-foreground">Thank you.</p>
                  <p className="text-muted-foreground text-sm text-center">
                    A member of our team will be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input name="firstName" type="text" placeholder="First Name" required
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white/15 transition-all rounded-lg" />
                    <input name="lastName" type="text" placeholder="Last Name" required
                      className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white/15 transition-all rounded-lg" />
                  </div>
                  <input name="email" type="email" placeholder="Email Address" required
                    className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white/15 transition-all rounded-lg" />
                  <input name="phone" type="tel" placeholder="Phone Number" required
                    className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white/15 transition-all rounded-lg" />
                  <textarea name="message" rows={5} placeholder="Describe your legal matter..."
                    className="w-full px-4 py-3 backdrop-blur-md bg-white/10 border border-white/20 text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white/15 transition-all rounded-lg resize-none" />
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[hsl(var(--gold-light))] disabled:opacity-50">
                    {loading ? "Submitting..." : "Request Consultation"}
                  </button>
                </>
              )}
              </form>
            </motion.div>

            {/* Contact info — slides in from right */}
            <motion.div
              style={{ opacity: infoOpacity, x: infoX }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl space-y-8"
            >
              <div className="flex gap-4">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Call Us</p>
                  <p className="font-body text-foreground text-sm">9223438655 / 9967713812 / 9220473363</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                  <a href="mailto:bnslegal01@gmail.com" className="font-body text-foreground text-sm hover:text-primary transition-colors">bnslegal01@gmail.com</a>
                </div>
              </div>
              {offices.map((office) => (
                <div key={office.label} className="flex gap-4">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{office.label}</p>
                    <p className="font-body text-foreground text-sm">{office.address}</p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${office.mapQuery}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 font-body text-xs text-primary hover:text-primary/80 uppercase tracking-[0.15em] transition-colors">
                      <ExternalLink className="w-3 h-3" />Open in Maps
                    </a>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Hours</p>
                  <p className="font-body text-foreground text-sm whitespace-pre-line">Mon – Sat: 9:00 AM – 7:00 PM{"\n"}24/7 Emergency Line Available</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ScrollStoryWrapper>
  );
};

export default ContactSection;
