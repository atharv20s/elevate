import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const areasOfInterest = [
  "Civil Litigation",
  "Criminal Law",
  "High Court Practice",
  "Family & Matrimonial",
  "Consumer Law",
  "Co-operative Society",
  "Corporate & Tribunal",
  "Legal Advisory & Documentation",
  "Redevelopment",
  "Labour Laws",
];

const InternshipSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      college: formData.get("college") as string,
      yearOfStudy: formData.get("yearOfStudy") as string,
      areaOfInterest: formData.get("areaOfInterest") as string,
      message: formData.get("message") as string,
    };

    try {
      const { error } = await supabase.functions.invoke("send-notification", {
        body: { type: "internship", data },
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Internship application submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="internship"
      aria-label="Apply for internship at BNS Legal"
      ref={ref}
      className="py-24 md:py-32"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #1a202c 0%, #0f172a 50%, #020617 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body text-sm uppercase tracking-[0.3em] mb-4">
            Careers
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Apply for Internship
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/40 mx-auto mb-6" />
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            BNS LEGAL offers structured internship and mentorship programs for law students and graduates. Gain practical exposure to drafting, filing, client communication, and court procedure under senior advocates.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <p className="font-display text-xl text-foreground">Application Received!</p>
              <p className="text-muted-foreground text-sm text-center">
                We'll review your application and get back to you soon. Thank you for your interest in BNS Legal.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="intern-fullName" className="sr-only">Full Name</label>
                  <input id="intern-fullName" name="fullName" type="text" placeholder="Full Name" required
                    className="w-full px-4 py-3 border border-border bg-card text-card-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label htmlFor="intern-email" className="sr-only">Email Address</label>
                  <input id="intern-email" name="email" type="email" placeholder="Email Address" required
                    className="w-full px-4 py-3 border border-border bg-card text-card-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="intern-phone" className="sr-only">Phone Number</label>
                  <input id="intern-phone" name="phone" type="tel" placeholder="Phone Number" required
                    className="w-full px-4 py-3 border border-border bg-card text-card-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label htmlFor="intern-college" className="sr-only">College or University</label>
                  <input id="intern-college" name="college" type="text" placeholder="College / University" required
                    className="w-full px-4 py-3 border border-border bg-card text-card-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="intern-yearOfStudy" className="sr-only">Year of Study</label>
                  <select id="intern-yearOfStudy" name="yearOfStudy" required
                    className="w-full px-4 py-3 border border-border bg-card text-card-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors">
                    <option value="">Year of Study</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="intern-areaOfInterest" className="sr-only">Area of Interest</label>
                  <select id="intern-areaOfInterest" name="areaOfInterest" required
                    className="w-full px-4 py-3 border border-border bg-card text-card-foreground font-body text-sm focus:outline-none focus:border-primary transition-colors">
                    <option value="">Area of Interest</option>
                    {areasOfInterest.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="intern-message" className="sr-only">Why do you want to intern at BNS Legal</label>
                <textarea id="intern-message" name="message" rows={4} placeholder="Why do you want to intern at BNS Legal? (Optional)"
                  className="w-full px-4 py-3 border border-border bg-card text-card-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground font-body font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[hsl(var(--gold-light))] disabled:opacity-50">
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default InternshipSection;
