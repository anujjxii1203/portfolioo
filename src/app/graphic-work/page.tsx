"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { GraphicWorkContent } from "@/lib/content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Code, Eye, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const categories = ["All", "Branding", "Posters", "Social", "Editorial"] as const;
type CategoryFilter = (typeof categories)[number];

export default function GraphicWorkPage() {
  const [items, setItems] = useState<GraphicWorkContent[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/content?type=graphic");
        if (res.ok) {
          const data: GraphicWorkContent[] = await res.json();
          setItems(data.filter((item) => item.visible !== false));
        }
      } catch {
        // Fallback
      }
    }
    fetchItems();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const selectedItem =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < filteredItems.length
      ? filteredItems[selectedIndex]
      : null;

  // Reset loading & error states when switching selected index
  useEffect(() => {
    if (selectedIndex !== null) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [selectedIndex]);

  const handlePrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    setSelectedIndex((prev) =>
      prev === null ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length
    );
  }, [filteredItems.length]);

  const handleNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    setSelectedIndex((prev) =>
      prev === null ? 0 : (prev + 1) % filteredItems.length
    );
  }, [filteredItems.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  // Preload neighboring images for instant switching
  const prevItem =
    selectedIndex !== null && filteredItems.length > 1
      ? filteredItems[(selectedIndex - 1 + filteredItems.length) % filteredItems.length]
      : null;
  const nextItem =
    selectedIndex !== null && filteredItems.length > 1
      ? filteredItems[(selectedIndex + 1) % filteredItems.length]
      : null;

  return (
    <>
      <Navbar />

      {/* Preload adjacent images */}
      {prevItem?.imagePath && (
        <link rel="prefetch" href={prevItem.imagePath} as="image" />
      )}
      {nextItem?.imagePath && (
        <link rel="prefetch" href={nextItem.imagePath} as="image" />
      )}

      <main id="main" className="pt-32 pb-28">
        <div className="container-custom">
          {/* Breadcrumb / Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-[#FF5722] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO HOME</span>
          </Link>

          {/* Page Header */}
          <div className="max-w-4xl mb-14">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FF5722] mb-3">
              <Eye className="w-4 h-4" />
              <span>Posters, Brand Identity &amp; Print</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#F5F5F5] leading-tight">
              Graphic <span className="text-[#FF5722]">Work</span>.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-neutral-400 font-light leading-relaxed max-w-2xl">
              Posters, apparel graphics, brand assets, and personal concepts.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-12 pb-6 border-b border-white/[0.08]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? "bg-[#FF5722] text-neutral-950 font-semibold shadow-md shadow-[#FF5722]/20"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* True Masonry Column Layout */}
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]"
          >
            <AnimatePresence>
              {filteredItems.map((item, idx) => {
                const imgW = item.width || 1200;
                const imgH = item.height || 1600;

                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedIndex(idx)}
                    className="break-inside-avoid mb-6 group relative rounded-2xl border border-white/[0.08] hover:border-[#FF5722]/60 transition-all duration-300 overflow-hidden cursor-pointer bg-neutral-950 hover:shadow-2xl hover:shadow-black/60 flex flex-col"
                  >
                    {/* Uncropped Edge-to-Edge Image Presentation */}
                    <div className="relative w-full overflow-hidden bg-neutral-900">
                      {item.imagePath ? (
                        <Image
                          src={item.imagePath}
                          alt={item.title}
                          width={imgW}
                          height={imgH}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={idx < 3}
                          placeholder={item.blurDataURL ? "blur" : "empty"}
                          blurDataURL={item.blurDataURL}
                          className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div
                          className="w-full aspect-[3/4] flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950"
                        >
                          <span className="text-6xl font-serif text-white/20 select-none group-hover:text-[#FF5722]/50 group-hover:scale-110 transition-all duration-500">
                            ✦
                          </span>
                        </div>
                      )}

                      {/* Top Category Badge Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono pointer-events-none">
                        <span className="text-[#FF5722] bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 uppercase tracking-wider font-medium text-[11px]">
                          {item.category}
                        </span>
                        <span className="text-neutral-300 bg-neutral-950/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-[11px]">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    {/* Card Body Info */}
                    <div className="p-5 flex flex-col justify-between bg-neutral-950/95 border-t border-white/[0.06]">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-[#FF5722] transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 shrink-0 text-neutral-500 group-hover:text-[#FF5722] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>

                        <p className="mt-2 text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.04]">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono text-neutral-400 bg-neutral-900/90 px-2 py-0.5 rounded border border-white/[0.06]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Footer Navigation Links */}
          <div className="mt-20 pt-10 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-[#FF5722] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/web-dev"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700 hover:border-[#FF5722] text-sm text-[#F5F5F5] hover:text-[#FF5722] transition-all group"
            >
              <Code className="w-4 h-4 text-[#FF5722]" />
              <span>Explore Web Development</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-3 sm:p-6 md:p-8 flex items-center justify-center overflow-y-auto"
          >
            {/* Modal Dialog Box */}
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-[#FF5722] uppercase tracking-wider font-semibold">
                    {selectedItem.category}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-neutral-400">{selectedItem.year}</span>
                  <span className="text-neutral-600 hidden sm:inline">•</span>
                  <span className="text-neutral-500 hidden sm:inline">
                    {selectedIndex + 1} of {filteredItems.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 transition-colors"
                    aria-label="Previous graphic"
                    title="Previous (Left arrow)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 transition-colors"
                    aria-label="Next graphic"
                    title="Next (Right arrow)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="p-1.5 ml-2 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-900 transition-colors"
                    aria-label="Close lightbox"
                    title="Close (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Main Area: Scrollable Image Viewport with Natural Aspect Ratio */}
              <div className="relative min-h-[260px] max-h-[66vh] sm:max-h-[70vh] bg-neutral-950/90 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
                {/* Loading Spinner */}
                {imageLoading && !imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-500 font-mono text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FF5722]" />
                    <span>Loading preview...</span>
                  </div>
                )}

                {/* Error Fallback */}
                {imageError ? (
                  <div className="text-center p-8">
                    <span className="text-5xl font-serif text-white/20 select-none block mb-2">✦</span>
                    <p className="text-xs font-mono text-rose-400">Image could not be loaded</p>
                    <p className="text-[10px] font-mono text-neutral-600 mt-1">{selectedItem.imagePath}</p>
                  </div>
                ) : selectedItem.imagePath ? (
                  /* Reliable <img> display: Sizes itself from natural image aspect ratio, no collapse */
                  <img
                    key={selectedItem.id + selectedItem.imagePath}
                    src={selectedItem.imagePath}
                    alt={selectedItem.title}
                    loading="eager"
                    decoding="async"
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                      console.error("Image failed to load in lightbox:", selectedItem.imagePath);
                    }}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "68vh",
                      objectFit: "contain",
                      display: "block",
                      margin: "0 auto",
                    }}
                    className={`rounded-lg transition-opacity duration-200 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                  />
                ) : (
                  <div className="text-center p-8">
                    <span className="text-6xl font-serif text-white/20 select-none">✦</span>
                    <p className="mt-3 text-xs font-mono text-neutral-500">Visual preview not available</p>
                  </div>
                )}
              </div>

              {/* Modal Bottom Metadata Panel */}
              <div className="p-5 sm:p-6 border-t border-neutral-800/80 bg-neutral-950 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                    {selectedItem.title}
                  </h2>
                  <span className="text-xs font-mono text-neutral-500 shrink-0">
                    Full Resolution &bull; Natural Aspect
                  </span>
                </div>

                <p className="mt-2 text-sm text-neutral-300 font-light leading-relaxed max-w-3xl">
                  {selectedItem.description}
                </p>

                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-neutral-900">
                    {selectedItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
