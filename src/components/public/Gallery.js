"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/SectionHeader";
import Modal from "../ui/Modal";
import { HiOutlineZoomIn } from "react-icons/hi";
import { gallery } from "@/data/gallery";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader subtitle="Behind the scenes" title="Gallery" />

        {gallery.length === 0 ? (
          <div className="text-center text-gray-500 py-16">Gallery coming soon.</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {gallery.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl group cursor-pointer break-inside-avoid"
                onClick={() => setSelectedImage(item)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-[#050508]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div>
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                      <p className="text-cyan-400 text-sm">{item.category}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                      <HiOutlineZoomIn size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title={selectedImage?.title}>
          {selectedImage && (
            <div className="relative w-full rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-auto" />
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
