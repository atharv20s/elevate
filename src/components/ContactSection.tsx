import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";

const ContactSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" ref={ref} className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-background to-background" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6"
        >
          <span className="chapter-number">Chapter 06</span>
          <h2 className="section-title">
            Begin Your <span className="text-gradient-gold">Case</span>
          </h2>
          <div className="divider-gold mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <p className="font-serif text-2xl italic text-foreground/80 leading-relaxed">
              "Every victory begins with a conversation. Every conversation 
              begins with trust."
            </p>
            <div className="divider-gold" />
            <div className="space-y-6">
              {[
                { icon: MapPin, text: "One Liberty Plaza, New York, NY 10006" },
                { icon: Phone, text: "+1 (212) 555-0190" },
                { icon: Mail, text: "counsel@aurumvale.com" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4 text-muted-foreground">
                  <item.icon className="w-5 h-5 text-primary/60 shrink-0" />
                  <span className="font-body text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="glass-panel-gold p-8 space-y-6"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display text-xl text-foreground">Thank you.</p>
                <p className="text-muted-foreground text-sm text-center">
                  A member of our team will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <>
                {[
                  { label: "Full Name", type: "text", placeholder: "Victoria Ashworth" },
                  { label: "Email", type: "email", placeholder: "v.ashworth@example.com" },
                  { label: "Phone", type: "tel", placeholder: "+1 (212) 555-0190" },
                ].map((field) => (
                  <div key={field.label} className="space-y-2">
                    <label className="stat-label">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      className="w-full bg-background/50 border border-border/50 rounded-sm px-4 py-3 
                                 text-foreground font-body text-sm placeholder:text-muted-foreground/50
                                 focus:outline-none focus:border-primary/50 transition-colors duration-300"
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="stat-label">Nature of Inquiry</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of your legal matter..."
                    className="w-full bg-background/50 border border-border/50 rounded-sm px-4 py-3 
                               text-foreground font-body text-sm placeholder:text-muted-foreground/50
                               focus:outline-none focus:border-primary/50 transition-colors duration-300 resize-none"
                  />
                </div>
                <button type="submit" className="cta-primary w-full justify-center">
                  <Send className="w-4 h-4" />
                  Submit Inquiry
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
