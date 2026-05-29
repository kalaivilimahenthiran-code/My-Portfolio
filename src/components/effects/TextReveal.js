"use client";
import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

export default function TextReveal({ text, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const words = text.split(" ");

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%", opacity: 0 },
              visible: { 
                y: 0, 
                opacity: 1,
                transition: { 
                  duration: 0.5,
                  ease: [0.33, 1, 0.68, 1],
                  delay: delay + i * 0.05 
                }
              }
            }}
            initial="hidden"
            animate={controls}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
