import { notFound } from "next/navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#FF5722] mb-6 font-mono font-bold text-xl">
        404
      </div>

      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF5722] mb-3">
        <span>Page Not Found</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-white max-w-md">
        This page doesn’t exist or was moved.
      </h1>

      <p className="mt-4 text-sm text-neutral-400 font-light max-w-sm leading-relaxed">
        Please check the URL or head back to the portfolio homepage.
      </p>

      <div className="mt-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5722] hover:bg-[#ff6c3b] text-neutral-950 text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-lg shadow-[#FF5722]/20"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
