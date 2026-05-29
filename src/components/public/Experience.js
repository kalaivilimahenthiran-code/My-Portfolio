"use client";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Badge from "../ui/Badge";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionHeader subtitle="My Journey" title="Work Experience" />

        {experience.length === 0 ? (
          <div className="text-center text-gray-500 py-16">Experience coming soon.</div>
        ) : (
          <div className="relative mt-16">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent md:-translate-x-1/2" />

            <div className="space-y-12">
              {experience.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex flex-col md:flex-row gap-8 items-start ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-[#050508] border-4 border-cyan-400 md:-translate-x-1/2 mt-1.5 shadow-[0_0_15px_rgba(6,182,212,0.6)] z-10" />
                    <div className="hidden md:block w-1/2" />
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                      <div className="glass p-6 rounded-2xl hover:bg-white/[0.05] transition-colors duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <Badge variant="cyan">{exp.startDate} - {exp.endDate}</Badge>
                          <Badge variant="purple">{exp.location}</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                        <h4 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                          {exp.company}
                        </h4>
                        <p className="text-gray-400 leading-relaxed text-sm">{exp.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
