"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import GlassCard from "../ui/GlassCard";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { FaWhatsapp, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";
import { settings } from "@/data/settings";

export default function Contact() {
  const s = settings;
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send email using mailto link
      const mailtoLink = `mailto:${s.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      window.location.href = mailtoLink;
      toast.success("Opening email client...");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to open email client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: HiOutlineMail, label: "Email", value: s.email, href: s.email ? `mailto:${s.email}` : null },
    { icon: HiOutlinePhone, label: "Phone", value: s.phone, href: s.phone ? `tel:${s.phone.replace(/\s/g, "")}` : null },
    { icon: HiOutlineLocationMarker, label: "Location", value: s.location, href: null },
  ];

  const socials = [
    { Icon: FaGithub, href: s.github },
    { Icon: FaLinkedin, href: s.linkedin },
    { Icon: FaTwitter, href: s.twitter },
  ].filter((item) => item.href);

  const whatsappHref = s.whatsapp?.startsWith("http")
    ? s.whatsapp
    : s.whatsapp
      ? `https://wa.me/${s.whatsapp.replace(/\D/g, "")}`
      : null;

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          subtitle="Get in Touch"
          title="Let's Work Together"
          description="Have a project in mind? Let's discuss how we can build something amazing together."
        />

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="!p-6 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                    <info.icon size={24} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-white font-medium hover:text-cyan-400 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{info.value}</p>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}

            {socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="pt-6"
              >
                <p className="text-gray-400 mb-4">Connect with me on social media:</p>
                <div className="flex gap-4">
                  {socials.map(({ Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <GlassCard className="!p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input label="Your Name" name="name" value={formData.name} onChange={handleChange} required />
                  <Input label="Your Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <Input label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
                <Input label="Message" type="textarea" name="message" value={formData.message} onChange={handleChange} required />
                <Button variant="gradient" type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {whatsappHref && (
        <motion.a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] z-50 hover:scale-110 hover:bg-green-400 transition-all duration-300 hidden md:flex"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        >
          <FaWhatsapp size={28} />
        </motion.a>
      )}
    </section>
  );
}
