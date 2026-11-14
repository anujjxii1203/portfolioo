"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect password");
      }
    } catch {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 md:p-10 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl relative">
        <div className="w-12 h-12 rounded-xl bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center text-[#FF5722] mb-6">
          <Lock className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF5722] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local Environment Only</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
          Portfolio CMS
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          Enter the password defined in your <code className="text-[#FF5722] font-mono">.env.local</code> (ADMIN_PASSWORD).
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF5722] transition-colors font-mono text-sm"
            />
          </div>

          {error && (
            <p className="text-xs font-mono text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#FF5722] hover:bg-[#ff6c3b] text-neutral-950 font-medium text-sm transition-all disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Unlock Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-900 text-center">
          <a
            href="/"
            className="text-xs font-mono text-neutral-500 hover:text-white transition-colors"
          >
            ← Return to public website
          </a>
        </div>
      </div>
    </div>
  );
}

