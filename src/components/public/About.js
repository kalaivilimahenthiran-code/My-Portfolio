"use client";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { HiCode, HiLightningBolt, HiGlobeAlt } from "react-icons/hi";
import { settings } from "@/data/settings";

const stats = [
  { label: "Years Experience", value: "1+" },
  { label: "Projects Completed", value: "5+" },
  { label: "Happy Clients", value: "3+" },
  { label: "Technologies", value: "20+" },
];

const highlights = [
  {
    icon: HiCode,
    title: "Clean Code",
    desc: "Writing maintainable, scalable code following best practices and modern patterns.",
  },
  {
    icon: HiLightningBolt,
    title: "Fast Performance",
    desc: "Optimizing for speed and efficiency in every project I build.",
  },
  {
    icon: HiGlobeAlt,
    title: "Global Reach",
    desc: "Creating seamless experiences across all devices and screen sizes.",
  },
];

export default function About() {
  const aboutText = settings.aboutText;

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          subtitle="About Me"
          title={
            <>
              Passionate About Creating <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                Digital Excellence
              </span>
            </>
          }
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-400 text-lg leading-relaxed mb-10 whitespace-pre-line">
              {aboutText}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15 }}
              >
                <GlassCard className="!p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 text-cyan-400">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
