import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

interface ConsentPageProps {
  onConsentAccepted: () => void;
}

const ConsentPage = ({ onConsentAccepted }: ConsentPageProps) => {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card border border-border/50 rounded-xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center mb-8"
          >
            <Logo size="lg" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 mb-8"
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Welcome to BNS Legal
              </h2>
              <div className="w-16 h-[2px] bg-gradient-to-r from-primary to-primary/40" />
            </div>

            <div className="space-y-4 font-body text-foreground/80 leading-relaxed">
              <p>
                You are hereby informed that you are entering the BNS Legal website of your own 
                <span className="text-primary font-semibold"> volition and with your consent</span>.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 my-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M12 3v18M7 9l5-5 5 5M7 15l5 5 5-5" />
                  </svg>
                  Bar Council Compliance
                </h3>
                <p className="text-sm">
                  In accordance with the Bar Council of India's regulations and professional ethics, 
                  this website and the information contained within it shall not constitute legal advice, 
                  and you shall not consider any part of this website to be such advice.
                </p>
              </div>

              <p className="text-sm">
                By accessing this website, you acknowledge and agree that:
              </p>

              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>You are entering with your own free will and consent</li>
                <li>You understand the limitations of information provided online</li>
                <li>You will not hold BNS Legal liable for any consequences of your access</li>
                <li>Professional legal advice requires direct consultation</li>
              </ul>
            </div>
          </motion.div>

          {/* Acceptance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => setIsAccepted(e.target.checked)}
                className="w-5 h-5 rounded border border-primary/50 bg-background cursor-pointer transition-colors hover:border-primary accent-primary"
              />
              <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                I understand and accept the terms of entering this website with my own consent
              </span>
            </label>

            <motion.button
              onClick={onConsentAccepted}
              disabled={!isAccepted}
              whileHover={isAccepted ? { scale: 1.02 } : {}}
              whileTap={isAccepted ? { scale: 0.98 } : {}}
              className={`w-full py-3 px-6 font-semibold uppercase tracking-[0.1em] text-sm transition-all duration-300 flex items-center justify-center gap-2 rounded-lg ${
                isAccepted
                  ? "bg-primary text-primary-foreground hover:bg-[hsl(var(--gold-light))] cursor-pointer"
                  : "bg-primary/30 text-primary-foreground/50 cursor-not-allowed"
              }`}
            >
              Continue to Website
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          BNS Legal © 2026 | Registered with Bar Council of Maharashtra and Goa (MAH-LF/802/2024)
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ConsentPage;
