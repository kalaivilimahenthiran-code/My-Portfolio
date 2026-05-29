"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = navItems.map(item => item.href.substring(1));
      let current = "home";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= (element.offsetTop - 200)) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "py-4 bg-[#050508]/80 backdrop-blur-md border-b border-white/10 shadow-lg" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">
            <span className="text-white">KALA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">VIZHI</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollTo(item.href)}
                className={`relative text-sm font-medium transition-colors hover:text-white ${
                  activeSection === item.href.substring(1) ? "text-white" : "text-gray-400"
                }`}
              >
                {item.name}
                {activeSection === item.href.substring(1) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-300 p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <HiMenuAlt3 size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-50 bg-[#050508]/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button
              className="absolute top-6 right-6 text-gray-300 p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HiX size={32} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => scrollTo(item.href)}
                  className={`text-2xl font-bold ${
                    activeSection === item.href.substring(1) 
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600" 
                      : "text-gray-300"
                  }`}
                >
                  {item.name}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
