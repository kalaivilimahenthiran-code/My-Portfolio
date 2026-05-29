"use client";
import { motion } from "framer-motion";
import { HiArrowUp } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#050508] pt-16 pb-8 overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12 items-center">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="text-3xl font-bold tracking-tighter mb-4">
              <span className="text-white">KALAI</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">VIZHI</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mx-auto md:mx-0">
              Building premium digital experiences that inspire and perform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex justify-center gap-8 text-sm font-medium">
            {["About", "Projects", "Experience", "Contact"].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Socials & Top Button */}
          <div className="flex items-center justify-center md:justify-end gap-6">
            {[FaGithub, FaLinkedin, FaTwitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-4"
            >
              <HiArrowUp size={20} />
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} KALAIVIZHI MAHENDRAN. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed & Built with passion.</p>
        </div>
      </div>
    </footer>
  );
}
