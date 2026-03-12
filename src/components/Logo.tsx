import { Scale } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const iconClasses = {
    sm: "w-5 h-5 sm:w-6 sm:h-6",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textClasses = {
    sm: "text-sm sm:text-base md:text-lg",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-2xl",
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <Scale className={`${iconClasses[size]} text-primary flex-shrink-0`} />
      <span className={`font-display ${textClasses[size]} tracking-[0.15em] uppercase text-primary font-bold whitespace-nowrap leading-[1.2]`}>
        BNS Legal
      </span>
    </div>
  );
};

export default Logo;
