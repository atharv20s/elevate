import { Scale } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 py-12">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <Scale className="w-5 h-5 text-primary/60" />
        <span className="font-display text-sm tracking-[0.2em] uppercase text-muted-foreground">
          Aurum<span className="text-primary/60">&</span>Vale
        </span>
      </div>
      <p className="font-mono text-xs text-muted-foreground/60 tracking-wider">
        © 2025 Aurum & Vale LLP. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
