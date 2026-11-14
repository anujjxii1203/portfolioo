import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* 0 to 100% Preloader */}
      <Preloader />

      {/* Global Minimal Nav */}
      <Navbar />

      <main id="main" className="relative">
        <Hero />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
