"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { FaStar } from "react-icons/fa";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const scrollRef = useRef(null);

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader subtitle="Client Reviews" title="What People Say" />
          <p className="text-center text-gray-500">No testimonials yet.</p>
        </div>
      </section>
    );
  }

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
        <SectionHeader subtitle="Client Reviews" title="What People Say" />
      </div>

      <div className="relative w-full flex overflow-x-hidden group">
        <motion.div
          ref={scrollRef}
          className="flex gap-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          style={{ width: "fit-content" }}
        >
          {duplicatedTestimonials.map((testimonial, i) => (
            <GlassCard key={`${testimonial.id}-${i}`} className="w-[350px] flex-shrink-0 !p-8">
              <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} size={16} className={idx < (testimonial.rating || 5) ? "" : "text-gray-600"} />
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <span className="text-sm text-gray-500">{testimonial.role}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
