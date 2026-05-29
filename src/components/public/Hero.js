"use client";
import { motion } from "framer-motion";
import { HiArrowDown, HiOutlineDownload } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Button from "../ui/Button";
import { useTypewriter } from "@/hooks/useTypewriter";
import { settings } from "@/data/settings";

export default function Hero() {
  const s = settings;

  const roles = s.typewriterRoles
    ? s.typewriterRoles.split(",").map((r) => r.trim()).filter(Boolean)
    : ["Full-Stack Developer"];

  const role = useTypewriter(roles.length ? roles : ["Developer"], 100, 50, 2000);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const socials = [
    { Icon: FaGithub, href: s.github },
    { Icon: FaLinkedin, href: s.linkedin },
    { Icon: FaTwitter, href: s.twitter },
  ].filter((item) => item.href);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-gray-300">{s.availabilityText}</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4">
            <span className="block text-white">Hi, I&apos;m</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
              {s.name}
            </span>
          </h1>

          <div className="h-8 md:h-12 mb-6">
            <p className="text-xl md:text-3xl text-gray-400 font-light">
              I am a <span className="text-white font-medium">{role}</span>
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl leading-relaxed">
            {s.heroBio}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button variant="gradient" onClick={() => scrollTo("#contact")}>
              Hire Me
            </Button>
            <Button variant="outline" onClick={() => scrollTo("#projects")}>
              View Work
            </Button>
            {s.cvUrl && (
              <a href={s.cvUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">
                  <HiOutlineDownload className="text-xl" /> CV
                </Button>
              </a>
            )}
          </motion.div>

          {socials.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 mt-12"
            >
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyan-400 transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                  <Icon size={24} />
                </a>
              ))}
            </motion.div>
          )}
        </div>

        <div className="relative hidden lg:flex justify-center items-center h-full">
          <motion.div
            className="relative w-80 h-80 md:w-[400px] md:h-[400px] rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 border-r-purple-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-purple-500/20 border-b-purple-400 border-l-cyan-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-8 rounded-full bg-[#0c0c14] border border-white/10 overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.2)]">
  <img
    src="/assets/myimage.png"
    alt="Profile"
    className="w-full h-full object-cover"
  />
</div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer text-gray-500 hover:text-white transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => scrollTo("#about")}
      >
        <HiArrowDown size={32} />
      </motion.div>
    </section>
  );
}
