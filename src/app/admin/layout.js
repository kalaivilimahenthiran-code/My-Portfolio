"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { HiOutlineTemplate, HiOutlineCode, HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineMail, HiOutlineLogout, HiOutlineMenuAlt2, HiX, HiOutlineSparkles, HiOutlinePhotograph, HiOutlineCog, HiOutlineAdjustments } from "react-icons/hi";
import { useMessages } from "@/hooks/useMessages";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "@/components/effects/PageLoader";
import toast from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HiOutlineTemplate },
  { name: "Settings", href: "/admin/settings", icon: HiOutlineAdjustments },
  { name: "Projects", href: "/admin/projects", icon: HiOutlineCode },
  { name: "Skills", href: "/admin/skills", icon: HiOutlineSparkles },
  { name: "Services", href: "/admin/services", icon: HiOutlineCog },
  { name: "Experience", href: "/admin/experience", icon: HiOutlineBriefcase },
  { name: "Gallery", href: "/admin/gallery", icon: HiOutlinePhotograph },
  { name: "Testimonials", href: "/admin/testimonials", icon: HiOutlineUserGroup },
  { name: "Messages", href: "/admin/messages", icon: HiOutlineMail, showBadge: true },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { messages } = useMessages();
  const unreadCount = messages.filter((m) => !m.read).length;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (loading) return <PageLoader />;
  if (!user && pathname === "/admin/login") return <>{children}</>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050508] flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0c0c14] border-r border-white/10 z-50 transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="text-xl font-bold">
            <span className="text-white">Admin</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Panel</span>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <HiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-white border border-white/10" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}>
                  <item.icon size={20} className={isActive ? "text-cyan-400" : ""} />
                  <span className="font-medium flex-1">{item.name}</span>
                  {item.showBadge && unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <HiOutlineLogout size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0c0c14]/50 backdrop-blur-md flex items-center px-6 sticky top-0 z-30 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <HiOutlineMenuAlt2 size={24} />
          </button>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
      </div>
    </div>
  );
}
