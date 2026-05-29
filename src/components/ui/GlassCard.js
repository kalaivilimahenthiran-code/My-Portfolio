"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", tilt = true, ...props }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!tilt || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = -(e.clientY - top - height / 2) / 25;
    setRotateX(y);
    setRotateY(x);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000 }}
      className={`glass relative overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:bg-[var(--bg-card-hover)] hover:border-white/20 group ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
