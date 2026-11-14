"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Code, Eye } from "lucide-react";
import { SiteContent } from "@/lib/content";

export function About() {
  const [site, setSite] = useState<SiteContent | null>(null);

  useEffect(() => {
    async function loadSite() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) setSite(await res.json());
      } catch {}
    }
    loadSite();
  }, []);

  const professionTitle = site?.about?.professionTitle || "Designer & Engineer by profession";
  const professionBody =
    site?.about?.professionBody ||
    "I turn ideas into designs, and designs into working products. Clean in look, careful in code.";
  const ambitionTitle = site?.about?.ambitionTitle || "Storyteller & Explorer by ambition";
  const ambitionBody =
    site?.about?.ambitionBody ||
    "Beyond the screen, I chase stories, quiet roads and poetry that make ordinary moments feel vast.";
  const location = site?.location || "Noida, India";

  return (
    <section
      id="about"
      style={{ scrollMarginTop: "var(--nav-h, 80px)" }}
      className="border-t border-white/[0.06] relative py-24 sm:py-32"
    >
      <div className="container-custom">
        {/* Two-column layout on desktop: Left (heading, location), Right (blocks, buttons) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FF5722] mb-4">
              <span>01</span>
              <span className="w-6 h-[1px] bg-[#FF5722]" />
              <span>About &amp; Philosophy</span>
            </div>

            {/* Primary Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F5F5F5] leading-tight">
              Design with clarity. Code with care.
            </h2>

            {/* Context/Location */}
            <p className="mt-5 text-sm sm:text-base text-neutral-400 font-mono leading-relaxed">
              Based in {location}. Designing visual identities, print graphics, and web applications.
            </p>
          </div>

          {/* Right Column (7 cols on desktop): Block [01], Block [02], See My Work */}
          <div className="lg:col-span-7 flex flex-col space-y-10">
            {/* Narrative Blocks */}
            <div className="space-y-8">
              {/* Block 1: Profession */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h3 className="text-xs sm:text-sm uppercase tracking-widest font-mono text-[#FF5722]/90">
                  [01] {professionTitle}
                </h3>
                <p className="text-base sm:text-lg font-light text-neutral-200 leading-relaxed">
                  {professionBody}
                </p>
              </motion.div>

              {/* Block 2: Ambition */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-2"
              >
                <h3 className="text-xs sm:text-sm uppercase tracking-widest font-mono text-[#FF5722]/90">
                  [02] {ambitionTitle}
                </h3>
                <p className="text-base sm:text-lg font-light text-neutral-200 leading-relaxed">
                  {ambitionBody}
                </p>
              </motion.div>
            </div>

            {/* See My Work */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 shrink-0">
                See my work
              </span>

              <div className="flex items-center gap-3">
                <Link
                  href="/graphic-work"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700 hover:border-[#FF5722] text-[#F5F5F5] hover:text-[#FF5722] text-xs font-mono uppercase tracking-wider transition-all group"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>Graphic Work</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>

                <Link
                  href="/web-dev"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700 hover:border-[#FF5722] text-[#F5F5F5] hover:text-[#FF5722] text-xs font-mono uppercase tracking-wider transition-all group"
                >
                  <Code className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span>Web Dev</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
