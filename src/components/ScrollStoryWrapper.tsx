import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollStoryWrapperProps {
  children: ReactNode;
  animationType?: "fade-up" | "slide-left" | "slide-right" | "zoom" | "reveal-up";
  className?: string;
  id?: string;
}

const ScrollStoryWrapper = ({
  children,
  animationType = "fade-up",
  className = "",
  id,
}: ScrollStoryWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Core transforms driven by scroll position through the section
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Animation-specific transforms
  const fadeUpY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -60]);
  const slideLeftX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [-120, 0, 0, 80]);
  const slideRightX = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [120, 0, 0, -80]);
  const zoomScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.92]);
  const revealClip = useTransform(scrollYProgress, [0, 0.25], [100, 0]);

  // Parallax background layer
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const getAnimationStyle = () => {
    switch (animationType) {
      case "fade-up":
        return { y: fadeUpY };
      case "slide-left":
        return { x: slideLeftX };
      case "slide-right":
        return { x: slideRightX };
      case "zoom":
        return { scale: zoomScale };
      case "reveal-up":
        return { y: fadeUpY, clipPath: useTransform(revealClip, (v) => `inset(0 0 ${v}% 0)`) };
      default:
        return { y: fadeUpY };
    }
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} id={id}>
      {/* Parallax background layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.02]" />
      </motion.div>

      {/* Animated content */}
      <motion.div
        className="relative z-10"
        style={{
          opacity,
          ...getAnimationStyle(),
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollStoryWrapper;
