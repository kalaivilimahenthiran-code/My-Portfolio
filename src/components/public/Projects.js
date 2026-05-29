"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { projects } from "@/data/projects";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Full Stack", "Frontend", "Backend"];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader 
          subtitle="Portfolio"
          title="Featured Projects"
          description="A selection of my recent work, showcasing complex problem-solving and clean design."
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

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlassCard className="h-full flex flex-col !p-0 group">
                  {/* Image Area */}
                  <div className="relative h-56 w-full overflow-hidden bg-[#0c0c14]">
                    {project.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-purple-600/10 text-white/20">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#050508]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-cyan-500 rounded-full text-white transition-colors cursor-pointer">
                          <FaGithub size={20} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-purple-500 rounded-full text-white transition-colors cursor-pointer">
                          <FaExternalLinkAlt size={20} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.techStack?.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-gray-300 border border-white/10">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
