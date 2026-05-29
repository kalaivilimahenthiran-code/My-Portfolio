import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Skills from "@/components/public/Skills";
import Projects from "@/components/public/Projects";
import Experience from "@/components/public/Experience";
import Services from "@/components/public/Services";
import Gallery from "@/components/public/Gallery";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";
import PageLoader from "@/components/effects/PageLoader";
import AnimatedBackground from "@/components/effects/AnimatedBackground";
import CustomCursor from "@/components/effects/CustomCursor";
import FloatingParticles from "@/components/effects/FloatingParticles";
import MouseGlow from "@/components/effects/MouseGlow";
import ScrollProgress from "@/components/effects/ScrollProgress";
import ServiceWorkerRegister from "@/components/effects/ServiceWorkerRegister";

export default function Home() {
  return (
    <>
      <PageLoader />
      <AnimatedBackground />
      <FloatingParticles />
      <MouseGlow />
      <CustomCursor />
      <ScrollProgress />
      <ServiceWorkerRegister />
      <Navbar />
      
      <main className="flex flex-col min-h-screen">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Experience />
        <Gallery />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
