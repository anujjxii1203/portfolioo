"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SiteContent } from "@/lib/content";
import { Typewriter } from "./Typewriter";

export const INTRO_TIMINGS = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  helloDelay: 0.1,
  wordDuration: 0.9,
  imDelay: 0.28,
  boxExpandDelay: 0.52,
  boxExpandDuration: 0.7,
  nameFadeDelay: 0.85,
  nameFadeDuration: 0.75,
  periodDelay: 1.15,
  periodDuration: 0.4,
  typewriterLineDelay: 1.35,
  typewriterLineDuration: 0.85,
  typewriterTypingDelayMs: 2200,
  scrollCueDelay: 2.1,
  scrollCueDuration: 0.65,
};

export function Hero() {
  const [site, setSite] = useState<SiteContent | null>(null);
  const [isIntroActive, setIsIntroActive] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

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
            setIsIntroActive(true);
            sessionStorage.setItem("intro-played", "true");

            const timer = setTimeout(() => {
              setAnimationFinished(true);
            }, 2800);
            return () => clearTimeout(timer);
          } else {
            setAnimationFinished(true);
          }
        }
      } catch {
        setAnimationFinished(true);
      }
    }
    loadSite();
  }, []);

  const highlightWord = site?.heroHighlight || "Anuj";
  const words = site?.typewriterWords || [
    "Graphic Designer",
    "Web Developer",
    "Creative Technologist",
    "Visual Storyteller",
  ];

  const wordVariant = (delay: number) => ({
    hidden: {
      opacity: 0,
      y: 16,
      filter: "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: INTRO_TIMINGS.wordDuration,
        delay,
        ease: INTRO_TIMINGS.ease,
      },
    },
  });

  return (
    <section className="relative h-[100svh] min-h-[100svh] flex flex-col justify-between pt-[var(--nav-h,80px)] pb-8 overflow-hidden">
      {/* Background ambient subtle glow */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15"
        style={{ backgroundColor: site?.accentColor || "#FF5722" }}
      />

      {/* Top spacer to balance vertical centering below navbar */}
      <div className="h-4" aria-hidden="true" />

      {/* Centered Hero Content */}
      <div className="container-custom relative z-10 my-auto flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl flex flex-col items-center">
          {/* Centered headline */}
          <h1 className="text-[clamp(2.5rem,5.5vw,4.75rem)] font-medium tracking-tight text-[#F5F5F5] leading-[1.12] flex items-center justify-center flex-wrap">
            {/* Word 1: "Hello," */}
            <motion.span
              variants={isIntroActive ? wordVariant(INTRO_TIMINGS.helloDelay) : undefined}
              initial={isIntroActive ? "hidden" : false}
              animate="visible"
              className={`inline-block mr-3 ${!animationFinished ? "will-change-[transform,opacity,filter]" : ""}`}
            >
              Hello,
            </motion.span>

            {/* Word 2: "I'm" */}
            <motion.span
              variants={isIntroActive ? wordVariant(INTRO_TIMINGS.imDelay) : undefined}
              initial={isIntroActive ? "hidden" : false}
              animate="visible"
              className={`inline-block mr-2.5 ${!animationFinished ? "will-change-[transform,opacity,filter]" : ""}`}
            >
              I&apos;m
            </motion.span>

            {/* Orange Box & Name Container */}
            <span
              className="relative inline-block align-baseline mx-0.5"
              style={{
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              {/* Expanding Orange Box Background: scaleX 0 to 1 from transform-origin left */}
              <motion.span
                initial={isIntroActive ? { scaleX: 0, opacity: 0 } : false}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={
                  isIntroActive
                    ? {
                      duration: INTRO_TIMINGS.boxExpandDuration,
                      delay: INTRO_TIMINGS.boxExpandDelay,
                      ease: INTRO_TIMINGS.ease,
                    }
                    : { duration: 0 }
                }
                className="absolute inset-0 bg-[#FF5722] shadow-md shadow-[#FF5722]/20 pointer-events-none"
                style={{
                  transformOrigin: "left center",
                  borderRadius: "0.12em",
                  willChange: !animationFinished ? "transform, opacity" : "auto",
                }}
              />

              {/* Name Text: fully padded so descenders ("j", "g", "y") sit inside box */}
              <motion.span
                variants={isIntroActive ? wordVariant(INTRO_TIMINGS.nameFadeDelay) : undefined}
                initial={isIntroActive ? "hidden" : false}
                animate="visible"
                className={`relative z-10 inline-block text-neutral-950 font-semibold ${!animationFinished ? "will-change-[transform,opacity,filter]" : ""
                  }`}
                style={{
                  padding: "0.04em 0.22em 0.2em",
                  lineHeight: 1,
                }}
              >
                {highlightWord}
              </motion.span>
            </span>

            {/* Final Period "." pops in last with scale (0.6 -> 1) */}
            <motion.span
              initial={isIntroActive ? { opacity: 0, scale: 0.6 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                isIntroActive
                  ? {
                    duration: INTRO_TIMINGS.periodDuration,
                    delay: INTRO_TIMINGS.periodDelay,
                    ease: INTRO_TIMINGS.ease,
                  }
                  : { duration: 0 }
              }
              className={`inline-block text-[#F5F5F5] ml-0.5 ${!animationFinished ? "will-change-[transform,opacity]" : ""
                }`}
            >
              .
            </motion.span>
          </h1>

          {/* Typewriter Line */}
          <motion.div
            variants={isIntroActive ? wordVariant(INTRO_TIMINGS.typewriterLineDelay) : undefined}
            initial={isIntroActive ? "hidden" : false}
            animate="visible"
            className={`mt-6 min-h-[2.5rem] sm:min-h-[3rem] text-xl sm:text-2xl md:text-3xl font-light text-neutral-400 flex items-center justify-center gap-2 leading-relaxed ${!animationFinished ? "will-change-[transform,opacity,filter]" : ""
              }`}
          >
            <span className="shrink-0">am a</span>
            <Typewriter
              words={words}
              className="font-normal"
              startDelay={isIntroActive ? INTRO_TIMINGS.typewriterTypingDelayMs : 0}
            />
          </motion.div>
        </div>
      </div>

      {/* Small Centered Scroll Cue at bottom */}
      <motion.div
        initial={isIntroActive ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={
          isIntroActive
            ? {
              duration: INTRO_TIMINGS.scrollCueDuration,
              delay: INTRO_TIMINGS.scrollCueDelay,
              ease: INTRO_TIMINGS.ease,
            }
            : { duration: 0.3 }
        }
        className="container-custom flex items-center justify-center text-xs font-mono text-neutral-500"
      >
        <Link
          href="/#about"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-[#FF5722] transition-colors group cursor-pointer"
        >
          <span>SCROLL</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}
