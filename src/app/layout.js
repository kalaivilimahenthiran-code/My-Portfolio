import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KALAIVIZHI MAHENDRAN | Full-Stack Developer & UI/UX Designer",
  description: "Award-winning portfolio of KALAIVIZHI MAHENDRAN, a senior full-stack developer and UI/UX designer specializing in creating premium digital experiences.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-[#050508] text-white antialiased selection:bg-cyan-500/30`}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0c0c14',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
