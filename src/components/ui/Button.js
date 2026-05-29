"use client";
import { forwardRef } from "react";
import MagneticButton from "../effects/MagneticButton";

const Button = forwardRef(({ children, variant = "gradient", className = "", ...props }, ref) => {
  const baseStyles = "relative inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-medium transition-all duration-300 overflow-hidden";
  
  const variants = {
    gradient: "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] border-none",
    glass: "glass text-white hover:bg-white/10 hover:border-white/30",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    outline: "border border-white/20 text-white hover:bg-white/10"
  };

  return (
    <MagneticButton className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "gradient" && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-purple-600 to-cyan-500 transition-opacity duration-500 z-0" />
      )}
    </MagneticButton>
  );
});

Button.displayName = "Button";
export default Button;
