"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { SiteContent } from "@/lib/content";

export function Navbar() {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shouldAnimateIntro, setShouldAnimateIntro] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function loadSite() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data: SiteContent = await res.json();
          setSite(data);

          const urlParams = new URLSearchParams(window.location.search);
          const forceIntro = urlParams.get("intro") === "1";
          const hasSeen = sessionStorage.getItem("intro-played");
          const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          if (data.playIntro !== false && !prefersReduced && (forceIntro || !hasSeen)) {
            setShouldAnimateIntro(true);
          }
        }
      } catch {}
    }
    loadSite();

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 15);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = site ? `${site.name} ${site.surname}` : "Anuj Rai";
  const displayRole = site?.roleTag || "Graphic Designer & Web Developer";
  const resumeHref = site?.resumePath || "/resume.pdf";

  const navLinks = [
    { label: "ABOUT", href: "/#about", isAnchor: true, pageSection: "about" },
    { label: "WEB DEV", href: "/web-dev", isRoute: true, page: "web-dev" },
    { label: "GRAPHIC WORK", href: "/graphic-work", isRoute: true, page: "graphic-work" },
    { label: "CONTACT", href: "/#contact", isAnchor: true, pageSection: "contact" },
  ];

  const isLinkActive = (item: (typeof navLinks)[0]) => {
    if (item.isRoute && pathname === item.href) return true;
    if (item.page && pathname.startsWith(`/${item.page}`)) return true;
    return false;
  };

  return (
    <motion.header
      initial={shouldAnimateIntro ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color,padding] duration-200 ${
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.08] py-4"
          : "bg-transparent border-b border-transparent py-6"
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo / Identity */}
        <Link
          href="/"
          className="group flex items-baseline gap-2 text-sm font-medium tracking-tight text-[#F5F5F5] hover:text-[#FF5722] transition-colors"
        >
          <span className="font-semibold">{displayName}</span>
          <span className="text-neutral-500 hidden sm:inline text-xs font-mono">
            / {displayRole}
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest font-mono">
          {navLinks.map((item) => {
            const active = isLinkActive(item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-colors py-1 relative block ${
                  active
                    ? "text-[#FF5722] font-semibold"
                    : "text-neutral-400 hover:text-[#F5F5F5]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5722] rounded-full" />
                )}
              </Link>
            );
          })}

          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-700 hover:border-[#FF5722] text-[#F5F5F5] hover:text-[#FF5722] transition-colors"
          >
            <span>RESUME</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neutral-300 hover:text-white p-1"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile slide-down menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.08] px-6 py-6"
        >
          <div className="flex flex-col gap-4 text-sm font-mono uppercase tracking-wider">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 transition-colors ${
                  isLinkActive(item) ? "text-[#FF5722]" : "text-neutral-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-2 text-[#FF5722] pt-2 border-t border-white/[0.08]"
            >
              <span>RESUME</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
