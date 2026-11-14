"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/siteConfig";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Lock body scroll while preloader is active
    document.body.style.overflow = "hidden";

    const duration = 1800; // 1.8 seconds duration
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = "";
          onComplete?.();
        }, 350);
      }
    };

    const animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#0A0A0A] p-8 md:p-14 text-[#F5F5F5] select-none"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          {/* Top greeting metadata */}
          <div className="flex justify-between items-center text-xs tracking-widest uppercase text-neutral-500 font-mono">
            <span>Portfolio Edition</span>
            <span>{siteConfig.location}</span>
          </div>

          {/* Centered statement */}
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-2xl md:text-4xl font-light tracking-tight text-neutral-200"
            >
              <span className="text-[#FF5722]">✦</span>
            </motion.p>
            <p className="mt-3 text-base md:text-lg text-neutral-400 font-light">
              Graphic Design <span className="text-[#FF5722] font-mono">×</span> Web Engineering
            </p>
            <p className="mt-2 text-xs text-neutral-600 font-mono">
              Portfolio &bull; Selected Works
            </p>
          </div>

          {/* Bottom progress bar & counter */}
          <div className="space-y-4">
            {/* Visual subtle progress line */}
            <div className="w-full h-[2px] bg-neutral-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF5722] to-amber-400 transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-end border-t border-neutral-900 pt-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Initializing Experience
              </span>
              <div className="text-6xl md:text-8xl font-mono font-medium tracking-tighter text-[#F5F5F5]">
                {progress}
                <span className="text-sm md:text-base text-[#FF5722] ml-1.5 font-normal">%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
