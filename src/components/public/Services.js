"use client";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { services } from "@/data/services";
import { getServiceIcon } from "@/lib/serviceIcons";

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader subtitle="What I Do" title="Premium Services" />

        {services.length === 0 ? (
          <div className="text-center text-gray-500 py-16">Services coming soon.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <GlassCard className="h-full flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
