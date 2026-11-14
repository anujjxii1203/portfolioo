"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  holdTime?: number;
  className?: string;
  startDelay?: number; // Delay before first character types (for Apple intro sync)
}

export function Typewriter({
  words = ["Graphic Designer", "Web Developer"],
  typeSpeed = 70,
  deleteSpeed = 40,
  holdTime = 1600,
  className = "",
  startDelay = 0,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(startDelay === 0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Handle startDelay sync
  useEffect(() => {
    if (startDelay > 0) {
      const delayTimer = setTimeout(() => {
        setHasStarted(true);
      }, startDelay);
      return () => clearTimeout(delayTimer);
    } else {
      setHasStarted(true);
    }
  }, [startDelay]);

  useEffect(() => {
    if (prefersReducedMotion || !words || words.length === 0 || !hasStarted) return;

    const currentWord = words[currentWordIndex % words.length];

    if (!isDeleting && displayText === currentWord) {
      const timer = setTimeout(() => setIsDeleting(true), holdTime);
      return () => clearTimeout(timer);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const nextSpeed = isDeleting ? deleteSpeed : typeSpeed;
    const timer = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? currentWord.substring(0, prev.length - 1)
          : currentWord.substring(0, prev.length + 1)
      );
    }, nextSpeed);

    return () => clearTimeout(timer);
  }, [
    displayText,
    isDeleting,
    currentWordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    holdTime,
    prefersReducedMotion,
    hasStarted,
  ]);

  if (prefersReducedMotion) {
    const staticWord = words[0] || "Graphic Designer";
    return (
      <span className={`inline-flex items-center ${className}`} aria-label={`I am a ${staticWord}`}>
        <span className="text-[#F5F5F5] font-normal border-b border-[#FF5722]/50 pb-0.5">
          {staticWord}
        </span>
      </span>
    );
  }

  const currentTargetWord = words[currentWordIndex % words.length] || "";

  return (
    <span
      className={`inline-flex items-center ${className}`}
      aria-label={`I am a ${currentTargetWord}`}
      role="text"
    >
      <span className="text-[#F5F5F5] font-normal border-b border-[#FF5722]/50 pb-0.5 whitespace-nowrap min-w-[1ch]">
        {displayText}
      </span>
      {/* Blinking thin orange caret */}
      <span
        className="inline-block w-[2px] h-[1em] bg-[#FF5722] ml-1 align-middle animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}
