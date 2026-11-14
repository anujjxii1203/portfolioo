"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Mail, Camera } from "lucide-react";
import { SiteContent } from "@/lib/content";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function Contact() {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function loadSite() {
      try {
        const res = await fetch("/api/content");
        if (res.ok) setSite(await res.json());
      } catch {}
    }
    loadSite();
  }, []);

  const email = site?.email || "hello@anuj.design";
  const heading = site?.contact?.heading || "Let’s craft something meaningful together.";
  const subheading =
    site?.contact?.subheading ||
    "Whether you have a brand looking for a distinct visual voice, an ambitious product needing clean frontend code, or just want to chat about design and coffee — my inbox is open.";

  const showPhoto = site?.showContactPhoto !== false;
  const photoSrc = site?.contactPhoto;
  const photoAlt = site?.contactPhotoAlt || "Portrait photo";
  const focusX = site?.contactPhotoFocusX ?? 50;
  const focusY = site?.contactPhotoFocusY ?? 30;
  const blurDataURL = site?.contactPhotoBlurDataURL;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-28 md:py-36 border-t border-white/[0.06] relative">
      <div className="container-custom">
        {/* Section Tag */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FF5722] mb-12">
          <span>02</span>
          <span className="w-8 h-[1px] bg-[#FF5722]" />
          <span>Get In Touch</span>
        </div>

        {/* Layout: Desktop (1024px+) 2-column grid when showPhoto is on, else single column */}
        <div
          className={
            showPhoto
              ? "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-stretch"
              : "max-w-4xl"
          }
        >
          {/* Left / Main Content Column */}
          <div className={showPhoto ? "lg:col-span-7 flex flex-col justify-between" : ""}>
            <div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#F5F5F5] leading-tight">
                {heading}
              </h2>

              <p className="mt-8 text-lg sm:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
                {subheading}
              </p>
            </div>

            {/* Action Row */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#FF5722] hover:bg-[#ff6c3b] text-neutral-950 font-medium text-sm transition-all shadow-lg shadow-[#FF5722]/20"
              >
                <Mail className="w-4 h-4" />
                <span>Send an Email</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-neutral-800 bg-neutral-900/60 hover:border-neutral-600 text-neutral-300 text-sm font-mono transition-colors"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-500" />
                    <span>{email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Contact Portrait Photo Card */}
          {showPhoto && (
            <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end w-full mt-10 lg:mt-0">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[340px] lg:max-w-[460px] h-full min-h-[380px] max-h-[640px] aspect-[4/5] lg:aspect-auto rounded-[24px] overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(255,87,34,0.06)] bg-gradient-to-b from-neutral-900/90 to-neutral-950 flex flex-col items-center justify-center group"
              >
                {photoSrc ? (
                  <>
                    <Image
                      src={photoSrc}
                      alt={photoAlt}
                      fill
                      sizes="(max-width: 1024px) 340px, 460px"
                      placeholder={blurDataURL ? "blur" : "empty"}
                      blurDataURL={blurDataURL}
                      loading="lazy"
                      style={{
                        objectFit: "cover",
                        objectPosition: `${focusX}% ${focusY}%`,
                      }}
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    {/* Soft dark gradient vignette at the bottom edge */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  </>
                ) : (
                  /* Elegant Empty State Placeholder */
                  <div className="flex flex-col items-center justify-center p-8 text-center select-none">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900/90 border border-white/10 flex items-center justify-center mb-4 text-neutral-400 group-hover:text-[#FF5722] group-hover:border-[#FF5722]/30 transition-all">
                      <Camera className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <span className="text-xs font-mono tracking-wider uppercase text-neutral-400 group-hover:text-neutral-200 transition-colors">
                      Your photo here
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600 mt-1">
                      Upload in Admin &gt; Site Settings
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
