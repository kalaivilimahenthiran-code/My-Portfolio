"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { skills } from "@/data/skills";

import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaFigma,
  FaGithub,
  FaGitAlt,
  FaPython,
  FaJava,
  FaDatabase,
} from "react-icons/fa";

import {
  SiJavascript,
  SiTailwindcss,
  SiMongodb,
  SiNextdotjs,
  SiFirebase,
  SiExpress,
  SiTypescript,
  SiMysql,
  SiPostman,
  SiFramer,
} from "react-icons/si";

const categories = [
  "All",
  "Frontend Development",
  "Backend Development",
  "Tools & Platforms",
  "Programming Languages",
  "UI/UX & Design",
];

const skillIcons = {
  "HTML5": FaHtml5,
  "CSS3": FaCss3Alt,
  "JavaScript (ES6+)": SiJavascript,
  "JavaScript": SiJavascript,
  "TypeScript": SiTypescript,
  "React.js": FaReact,
  "Next.js": SiNextdotjs,
  "Node.js": FaNodeJs,
  "Express.js": SiExpress,
  "Firebase": SiFirebase,
  "MongoDB": SiMongodb,
  "MySQL": SiMysql,
  "Git & GitHub": FaGithub,
  "Postman": SiPostman,
  "Python": FaPython,
  "Java": FaJava,
  "Framer Motion": SiFramer,
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          subtitle="My Expertise"
          title="Technical Skills"
          description="A showcase of my technical proficiencies and the tools I use to bring ideas to life."
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="flex flex-wrap justify-center gap-4"
        >
          <AnimatePresence>
            {filteredSkills.map((skill, index) => {
              const Icon = skillIcons[skill.name];

              return (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 flex items-center gap-3 group cursor-pointer relative overflow-hidden">
                    {/* Loading animation bar */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20"
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                    {Icon && (
                      <Icon className="text-xl text-cyan-400 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    )}
                    <span className="text-white font-medium group-hover:text-cyan-400 transition-colors duration-300 relative z-10">
                      {skill.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}