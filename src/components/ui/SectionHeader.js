"use client";
import { motion } from "framer-motion";

export default function SectionHeader({ subtitle, title, description, className = "" }) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-4 inline-block"
      >
        {subtitle}
      </motion.span>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
      >
        {title}
      </motion.h2>
      
      {description && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          {description}
        </motion.p>
      )}
      
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-24 h-1 mx-auto mt-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
      />
    </div>
  );
}
