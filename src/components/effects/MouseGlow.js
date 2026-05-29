"use client";
import { useMousePosition } from "@/hooks/useMousePosition";
import { motion } from "framer-motion";

export default function MouseGlow() {
  const { x, y } = useMousePosition();

  if (x === null || y === null) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
      animate={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(139, 92, 246, 0.08), transparent 40%)`,
      }}
    />
  );
}
