import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const navItems = [
  { label: "Practice", href: "/practice-areas" },
  { label: "About", href: "/#firm" },
  { label: "Team", href: "/practice-areas#team" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        role="banner"
        aria-label="BNS Legal site header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/30 py-3"
            : "py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="/" aria-label="BNS Legal Home" className="group flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <Logo size="sm" />
          </a>

          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={`Navigate to ${item.label} section`}
                className="font-body text-xs sm:text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block flex-shrink-0">
            <a
              href="/contact"
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-primary-foreground font-body text-xs font-semibold uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-300 hover:bg-[hsl(var(--gold-light))] whitespace-nowrap"
            >
              Consultation
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open mobile navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="lg:hidden text-foreground flex-shrink-0"
          >
            <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close mobile navigation menu"
              className="absolute top-6 right-6 text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
            <nav aria-label="Mobile primary navigation" className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="font-display text-2xl tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
              <a
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-[0.15em]"
              >
                Consultation
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
