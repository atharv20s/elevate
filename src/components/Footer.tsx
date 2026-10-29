import { Scale } from "lucide-react";

/**
 * Footer — uses role="contentinfo" (correct semantic for page footer).
 * <address> contains only actual contact information (email, phone).
 * Professional description uses <p>, not <address>.
 */
const Footer = () => (
  <footer
    role="contentinfo"
    aria-label="BNS Legal site footer"
    className="border-t border-border/30 py-12 bg-background"
  >
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <Scale className="w-5 h-5 text-primary/60" aria-hidden="true" />
        <span className="font-display text-sm tracking-[0.15em] uppercase text-muted-foreground">
          BNS<span className="text-primary/60"> Legal</span>
        </span>
      </div>

      {/* Professional description — use <p>, not <address> */}
      <p className="font-body text-xs text-muted-foreground/60 tracking-wider text-center">
        Advocates, Legal Consultants &amp; Notary Public — Registered with Bar Council of Maharashtra &amp; Goa
      </p>

      {/* Actual contact information — appropriate use of <address> */}
      <address className="not-italic font-body text-xs text-muted-foreground/60 tracking-wider text-center">
        <a href="mailto:bnslegal01@gmail.com" className="hover:text-primary transition-colors">
          bnslegal01@gmail.com
        </a>
        {" · "}
        <a href="tel:+919223438655" className="hover:text-primary transition-colors">
          +91 9223438655
        </a>
      </address>

      <p className="font-mono text-xs text-muted-foreground/60 tracking-wider">
        © 2026 BNS Legal. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
