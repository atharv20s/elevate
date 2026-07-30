import { Scale } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-12 bg-background">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <Scale className="w-5 h-5 text-primary/60" />
        <span className="font-display text-sm tracking-[0.15em] uppercase text-muted-foreground">
          BNS<span className="text-primary/60"> Legal</span>
        </span>
      </div>
      <p className="font-body text-xs text-muted-foreground/60 tracking-wider text-center">
        Advocates, Legal Consultants & Notary Public — Registered with Bar Council of Maharashtra & Goa
      </p>
      <p className="font-mono text-xs text-muted-foreground/60 tracking-wider">
        © 2026 BNS Legal. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
