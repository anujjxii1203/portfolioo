"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { SiteContent } from "@/lib/content";

export function Footer() {
  const [currentYear, setCurrentYear] = useState("2025");
  const [site, setSite] = useState<SiteContent | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
    async function loadSite() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) setSite(await res.json());
      } catch {}
    }
    loadSite();
  }, []);

  const authorName = site ? `${site.name} ${site.surname}` : "Anuj Rai";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.08] py-12 text-neutral-500 text-xs font-mono">
      <div className="container-custom flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-neutral-400">
            Designed &amp; Developed by <span className="text-[#F5F5F5]">{authorName}</span>
          </p>
          <p className="mt-1 text-[11px] text-neutral-600">
            © {currentYear} • Next.js &amp; Tailwind CSS
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden md:inline text-neutral-600">
            Noida, India
          </span>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3 text-[#FF5722]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
