"use client";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useProjects } from "@/hooks/useProjects";
import { useSkills } from "@/hooks/useSkills";
import { useExperiences } from "@/hooks/useExperiences";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useMessages } from "@/hooks/useMessages";
import { useGallerys } from "@/hooks/useGallerys";
import { useServices } from "@/hooks/useServices";
import {
  HiOutlineCode,
  HiOutlineMail,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlinePhotograph,
  HiOutlineCog,
  HiOutlineArrowRight,
} from "react-icons/hi";

const quickLinks = [
  { name: "Add Project", href: "/admin/projects", desc: "Showcase your latest work" },
  { name: "Site Settings", href: "/admin/settings", desc: "Name, bio, contact & socials" },
  { name: "View Messages", href: "/admin/messages", desc: "Read client inquiries" },
  { name: "Manage Gallery", href: "/admin/gallery", desc: "Upload portfolio photos" },
];

export default function AdminDashboard() {
  const { projects, loading: lp } = useProjects();
  const { skills, loading: ls } = useSkills();
  const { experiences, loading: le } = useExperiences();
  const { testimonials, loading: lt } = useTestimonials();
  const { messages, loading: lm } = useMessages();
  const { gallerys, loading: lg } = useGallerys();
  const { services, loading: lsv } = useServices();

  const loading = lp || ls || le || lt || lm || lg || lsv;
  const unread = messages.filter((m) => !m.read).length;

  const stats = [
    { name: "Projects", value: projects.length, icon: HiOutlineCode, color: "from-cyan-400 to-blue-500", href: "/admin/projects" },
    { name: "Skills", value: skills.length, icon: HiOutlineSparkles, color: "from-violet-400 to-purple-500", href: "/admin/skills" },
    { name: "Experience", value: experiences.length, icon: HiOutlineBriefcase, color: "from-purple-400 to-pink-500", href: "/admin/experience" },
    { name: "Messages", value: messages.length, icon: HiOutlineMail, color: "from-emerald-400 to-teal-500", href: "/admin/messages", badge: unread },
    { name: "Testimonials", value: testimonials.length, icon: HiOutlineUserGroup, color: "from-amber-400 to-orange-500", href: "/admin/testimonials" },
    { name: "Gallery", value: gallerys.length, icon: HiOutlinePhotograph, color: "from-rose-400 to-red-500", href: "/admin/gallery" },
    { name: "Services", value: services.length, icon: HiOutlineCog, color: "from-indigo-400 to-blue-500", href: "/admin/services" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your portfolio content. Changes you make here appear on your public site."
      />

      {loading ? (
        <div className="text-center text-gray-400 py-16">Loading your portfolio data...</div>
      ) : (
        <>
          {unread > 0 && (
            <Link href="/admin/messages">
              <div className="mb-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-between hover:bg-cyan-500/15 transition-colors">
                <p className="text-cyan-300 font-medium">
                  You have {unread} unread message{unread !== 1 ? "s" : ""}
                </p>
                <HiOutlineArrowRight className="text-cyan-400" size={20} />
              </div>
            </Link>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <Link key={stat.name} href={stat.href}>
                <GlassCard className="!p-5 flex items-center justify-between hover:border-cyan-500/20 transition-colors cursor-pointer h-full">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{stat.name}</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                      {stat.badge > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {stat.badge} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center text-white opacity-80`}>
                    <stat.icon size={20} />
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4">Quick actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <GlassCard className="!p-5 flex items-center justify-between group hover:border-white/20 transition-colors">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{link.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
                  </div>
                  <HiOutlineArrowRight className="text-gray-500 group-hover:text-cyan-400 transition-colors" size={20} />
                </GlassCard>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
