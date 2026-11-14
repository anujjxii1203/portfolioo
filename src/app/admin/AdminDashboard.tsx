"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SiteContent, WebProjectContent, GraphicWorkContent } from "@/lib/content";
import {
  Settings,
  Code,
  Sparkles,
  FileText,
  LogOut,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  PlayCircle,
} from "lucide-react";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"site" | "web" | "graphic" | "files">("site");
  const [site, setSite] = useState<SiteContent | null>(null);
  const [webProjects, setWebProjects] = useState<WebProjectContent[]>([]);
  const [graphicWorks, setGraphicWorks] = useState<GraphicWorkContent[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const loadAllData = async () => {
    try {
      const [siteRes, webRes, graphicRes] = await Promise.all([
        fetch("/api/admin/site"),
        fetch("/api/admin/web-projects"),
        fetch("/api/admin/graphic-works"),
      ]);
      if (siteRes.ok) setSite(await siteRes.json());
      if (webRes.ok) setWebProjects(await webRes.json());
      if (graphicRes.ok) setGraphicWorks(await graphicRes.json());
    } catch (err) {
      setStatusMsg({ text: "Error loading content: " + String(err), type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const uploadFile = async (
    file: File,
    previousPath?: string,
    fileType?: "resume" | "og" | "media" | "portrait" | "contact"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    if (previousPath) formData.append("previousPath", previousPath);
    if (fileType) formData.append("fileType", fileType);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "File upload failed");
    }
    const data = await res.json();
    return data;
  };

  const handleSaveSite = async () => {
    if (!site) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        setStatusMsg({ text: "Site settings saved & backed up successfully!", type: "success" });
      } else {
        const data = await res.json();
        setStatusMsg({ text: data.error || "Failed to save site settings", type: "error" });
      }
    } catch (err) {
      setStatusMsg({ text: String(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWebProjects = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/web-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webProjects),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        setStatusMsg({ text: "Web projects updated & backed up successfully!", type: "success" });
      } else {
        const data = await res.json();
        setStatusMsg({ text: data.error || "Failed to save web projects", type: "error" });
      }
    } catch (err) {
      setStatusMsg({ text: String(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGraphicWorks = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/graphic-works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphicWorks),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        setStatusMsg({ text: "Graphic works updated & backed up successfully!", type: "success" });
      } else {
        const data = await res.json();
        setStatusMsg({ text: data.error || "Failed to save graphic works", type: "error" });
      }
    } catch (err) {
      setStatusMsg({ text: String(err), type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center font-mono text-sm">
        Loading CMS state...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0E0E0E] border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white tracking-tight flex items-center gap-2">
            <span>Portfolio Admin</span>
            <span className="text-[10px] font-mono uppercase bg-[#FF5722] text-black px-2 py-0.5 rounded font-bold">
              Local Dev Only
            </span>
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-4">
          {hasUnsavedChanges && (
            <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-800 px-2.5 py-1 rounded">
              Unsaved changes
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0A0A0A] border-b md:border-b-0 md:border-r border-white/[0.08] p-4 flex md:flex-col gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("site")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all text-left ${
              activeTab === "site"
                ? "bg-[#FF5722] text-black font-semibold shadow-md shadow-[#FF5722]/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("web")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all text-left ${
              activeTab === "web"
                ? "bg-[#FF5722] text-black font-semibold shadow-md shadow-[#FF5722]/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Web Projects ({webProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("graphic")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all text-left ${
              activeTab === "graphic"
                ? "bg-[#FF5722] text-black font-semibold shadow-md shadow-[#FF5722]/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Graphic Work ({graphicWorks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono transition-all text-left ${
              activeTab === "files"
                ? "bg-[#FF5722] text-black font-semibold shadow-md shadow-[#FF5722]/20"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>File Assets</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl">
          {statusMsg && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center justify-between text-xs font-mono ${
                statusMsg.type === "success"
                  ? "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                  : "bg-rose-950/40 border border-rose-800 text-rose-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMsg.type === "success" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{statusMsg.text}</span>
              </div>
              <button
                onClick={() => setStatusMsg(null)}
                className="hover:opacity-75 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: SITE SETTINGS */}
          {activeTab === "site" && site && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-2xl font-medium text-white">General Site Settings</h2>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    Updates /content/site.json and refreshes your identity across pages.
                  </p>
                </div>
                <button
                  onClick={handleSaveSite}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5722] hover:bg-[#ff6c3b] text-neutral-950 font-medium text-xs font-mono transition-all shadow-md shadow-[#FF5722]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>

              {/* Identity Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-950/50 p-6 rounded-2xl border border-neutral-900">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={site.name}
                    onChange={(e) => {
                      setSite({ ...site, name: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Surname / Last Name
                  </label>
                  <input
                    type="text"
                    value={site.surname}
                    onChange={(e) => {
                      setSite({ ...site, surname: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Hero Headline Highlight Word (Orange Box)
                  </label>
                  <input
                    type="text"
                    value={site.heroHighlight}
                    onChange={(e) => {
                      setSite({ ...site, heroHighlight: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                    e.g. &quot;Anuj&quot; inside &quot;Hello, I&apos;m [Word].&quot;
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Role Tag
                  </label>
                  <input
                    type="text"
                    value={site.roleTag}
                    onChange={(e) => {
                      setSite({ ...site, roleTag: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                {/* Typewriter words list */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Typewriter Rotating Words (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(site.typewriterWords || []).join(", ")}
                    onChange={(e) => {
                      const words = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setSite({ ...site, typewriterWords: words });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Graphic Designer, Web Developer"
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm font-mono focus:border-[#FF5722] focus:outline-none"
                  />
                  <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                    Displays centered as: &quot;I am a [Word]&quot; with continuous typing and deletion cycle.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={site.location || ""}
                    onChange={(e) => {
                      setSite({ ...site, location: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                {/* Apple-Style Intro Animation Toggle */}
                <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-[#FF5722]" />
                    <div>
                      <span className="text-sm font-medium text-white block">
                        Play Apple-Style Intro Animation
                      </span>
                      <span className="text-xs text-neutral-500 font-mono">
                        ~2.6s blur-fade stagger on page load. When off, renders final state instantly.
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={site.playIntro !== false}
                      onChange={(e) => {
                        setSite({ ...site, playIntro: e.target.checked });
                        setHasUnsavedChanges(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5722]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={site.email}
                    onChange={(e) => {
                      setSite({ ...site, email: e.target.value });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
                    Accent Color (Hex)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={site.accentColor}
                      onChange={(e) => {
                        setSite({ ...site, accentColor: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-10 h-10 rounded border border-neutral-800 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={site.accentColor}
                      onChange={(e) => {
                        setSite({ ...site, accentColor: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm font-mono focus:border-[#FF5722] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* About & Quotes */}
              <div className="space-y-4 bg-neutral-950/50 p-6 rounded-2xl border border-neutral-900">
                <h3 className="text-sm font-mono uppercase text-[#FF5722]">About Section Blocks</h3>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Profession Block Title
                  </label>
                  <input
                    type="text"
                    value={site.about?.professionTitle || ""}
                    onChange={(e) => {
                      setSite({
                        ...site,
                        about: { ...site.about, professionTitle: e.target.value },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Profession Block Body
                  </label>
                  <textarea
                    rows={3}
                    value={site.about?.professionBody || ""}
                    onChange={(e) => {
                      setSite({
                        ...site,
                        about: { ...site.about, professionBody: e.target.value },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Ambition Block Title
                  </label>
                  <input
                    type="text"
                    value={site.about?.ambitionTitle || ""}
                    onChange={(e) => {
                      setSite({
                        ...site,
                        about: { ...site.about, ambitionTitle: e.target.value },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Ambition Block Body
                  </label>
                  <textarea
                    rows={3}
                    value={site.about?.ambitionBody || ""}
                    onChange={(e) => {
                      setSite({
                        ...site,
                        about: { ...site.about, ambitionBody: e.target.value },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Section & Photo */}
              <div className="space-y-6 bg-neutral-950/50 p-6 rounded-2xl border border-neutral-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
                  <div>
                    <h3 className="text-sm font-mono uppercase text-[#FF5722]">Contact Section</h3>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">
                      Customize contact headings and the portrait photo shown in &quot;02 — GET IN TOUCH&quot;.
                    </p>
                  </div>

                  {/* Toggle Show Contact Photo */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-neutral-400">Show photo</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={site.showContactPhoto !== false}
                        onChange={(e) => {
                          setSite({ ...site, showContactPhoto: e.target.checked });
                          setHasUnsavedChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5722]"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      Contact Heading
                    </label>
                    <input
                      type="text"
                      value={site.contact?.heading || ""}
                      onChange={(e) => {
                        setSite({
                          ...site,
                          contact: { ...site.contact, heading: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      Contact Subheading / Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={site.contact?.subheading || ""}
                      onChange={(e) => {
                        setSite({
                          ...site,
                          contact: { ...site.contact, subheading: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#FF5722] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact Photo Group */}
                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase text-neutral-300">Contact Photo Card</h4>
                      <p className="text-[11px] text-neutral-500 font-mono">
                        Auto-resized up to 1600px WebP, 4:5 ratio on mobile, adaptive full height on desktop.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Live Preview Card */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="relative w-full max-w-[220px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-neutral-900 flex items-center justify-center">
                        {site.contactPhoto ? (
                          <>
                            <img
                              src={site.contactPhoto}
                              alt={site.contactPhotoAlt || "Contact portrait preview"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: `${site.contactPhotoFocusX ?? 50}% ${site.contactPhotoFocusY ?? 30}%`,
                              }}
                            />
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                          </>
                        ) : (
                          <div className="p-4 text-center select-none text-neutral-500 font-mono text-xs">
                            <span className="block text-3xl mb-1">📷</span>
                            Your photo here
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono mt-2">
                        Live Preview (4:5 Card Ratio)
                      </span>
                    </div>

                    {/* Controls */}
                    <div className="md:col-span-7 space-y-4">
                      {/* Upload / Replace / Remove */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                          Upload / Replace Photo
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              try {
                                const uploadRes = await uploadFile(f, site.contactPhoto, "contact");
                                setSite({
                                  ...site,
                                  contactPhoto: uploadRes.url,
                                  contactPhotoWidth: uploadRes.width,
                                  contactPhotoHeight: uploadRes.height,
                                  contactPhotoBlurDataURL: uploadRes.blurDataURL,
                                });
                                setHasUnsavedChanges(true);
                                setStatusMsg({
                                  text: `Contact photo optimized & uploaded: ${uploadRes.url}`,
                                  type: "success",
                                });
                              } catch (upErr) {
                                setStatusMsg({ text: String(upErr), type: "error" });
                              }
                            }
                          }}
                          className="text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
                        />
                      </div>

                      {site.contactPhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            setSite({
                              ...site,
                              contactPhoto: "",
                              contactPhotoBlurDataURL: undefined,
                            });
                            setHasUnsavedChanges(true);
                          }}
                          className="text-xs font-mono text-rose-400 hover:text-rose-300 underline"
                        >
                          Remove photo (return to placeholder)
                        </button>
                      )}

                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={site.contactPhotoAlt || ""}
                          placeholder="e.g. Portrait of Anuj Rai"
                          onChange={(e) => {
                            setSite({ ...site, contactPhotoAlt: e.target.value });
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-[#FF5722] focus:outline-none"
                        />
                      </div>

                      {/* Focus Point Sliders */}
                      <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-neutral-300">
                            Focus Point (object-position)
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSite({
                                ...site,
                                contactPhotoFocusX: 50,
                                contactPhotoFocusY: 30,
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="text-[10px] font-mono text-[#FF5722] hover:underline"
                          >
                            Reset (50% / 30%)
                          </button>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                            <span>Horizontal (X)</span>
                            <span>{site.contactPhotoFocusX ?? 50}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={site.contactPhotoFocusX ?? 50}
                            onChange={(e) => {
                              setSite({
                                ...site,
                                contactPhotoFocusX: parseInt(e.target.value, 10),
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full accent-[#FF5722]"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                            <span>Vertical (Y)</span>
                            <span>{site.contactPhotoFocusY ?? 30}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={site.contactPhotoFocusY ?? 30}
                            onChange={(e) => {
                              setSite({
                                ...site,
                                contactPhotoFocusY: parseInt(e.target.value, 10),
                              });
                              setHasUnsavedChanges(true);
                            }}
                            className="w-full accent-[#FF5722]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950/50 p-6 rounded-2xl border border-neutral-900">
                <h3 className="sm:col-span-2 text-sm font-mono uppercase text-[#FF5722]">Social Links</h3>
                {Object.keys(site.socials).map((key) => (
                  <div key={key}>
                    <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={(site.socials as Record<string, string>)[key] || ""}
                      onChange={(e) => {
                        setSite({
                          ...site,
                          socials: { ...site.socials, [key]: e.target.value },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm font-mono focus:border-[#FF5722] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WEB PROJECTS */}
          {activeTab === "web" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-2xl font-medium text-white">Web Development Projects</h2>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    Manage project entries shown on /web-dev and dynamic case studies.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newId = `proj-${Date.now()}`;
                      const newNumber = String(webProjects.length + 1).padStart(2, "0");
                      const newItem: WebProjectContent = {
                        id: newId,
                        slug: `new-project-${Date.now()}`,
                        number: newNumber,
                        title: "Untitled Web Project",
                        description: "Short project description.",
                        techTags: ["Next.js", "TypeScript", "Tailwind CSS"],
                        keyResult: "+100% Impact",
                        liveUrl: "https://example.com",
                        caseStudyUrl: `/work/new-project-${Date.now()}`,
                        coverImage: "/images/work-01.svg",
                        year: "2024",
                        role: "Front-End Developer",
                        order: webProjects.length + 1,
                        visible: true,
                      };
                      setWebProjects([...webProjects, newItem]);
                      setHasUnsavedChanges(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white text-xs font-mono transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>

                  <button
                    onClick={handleSaveWebProjects}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5722] hover:bg-[#ff6c3b] text-neutral-950 font-medium text-xs font-mono transition-all shadow-md shadow-[#FF5722]/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save List"}</span>
                  </button>
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                {webProjects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-mono text-[#FF5722]">{proj.number}</span>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...webProjects];
                            updated[idx].title = e.target.value;
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="bg-transparent text-lg font-medium text-white border-b border-transparent focus:border-[#FF5722] focus:outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = [...webProjects];
                            updated[idx].visible = !updated[idx].visible;
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className={`p-2 rounded-lg text-xs font-mono flex items-center gap-1 ${
                            proj.visible
                              ? "text-emerald-400 bg-emerald-950/30"
                              : "text-neutral-500 bg-neutral-900"
                          }`}
                          title="Toggle visibility"
                        >
                          {proj.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...webProjects];
                            const temp = updated[idx - 1];
                            updated[idx - 1] = updated[idx];
                            updated[idx] = temp;
                            updated.forEach((p, i) => (p.order = i + 1));
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          disabled={idx === webProjects.length - 1}
                          onClick={() => {
                            if (idx === webProjects.length - 1) return;
                            const updated = [...webProjects];
                            const temp = updated[idx + 1];
                            updated[idx + 1] = updated[idx];
                            updated[idx] = temp;
                            updated.forEach((p, i) => (p.order = i + 1));
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete project "${proj.title}"?`)) {
                              const updated = webProjects.filter((_, i) => i !== idx);
                              updated.forEach((p, i) => (p.order = i + 1));
                              setWebProjects(updated);
                              setHasUnsavedChanges(true);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-neutral-500 uppercase mb-1">Slug (URL path)</label>
                        <input
                          type="text"
                          value={proj.slug}
                          onChange={(e) => {
                            const updated = [...webProjects];
                            updated[idx].slug = e.target.value;
                            updated[idx].caseStudyUrl = `/work/${e.target.value}`;
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase mb-1">Key Outcome</label>
                        <input
                          type="text"
                          value={proj.keyResult}
                          onChange={(e) => {
                            const updated = [...webProjects];
                            updated[idx].keyResult = e.target.value;
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase mb-1">Role &amp; Year</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => {
                              const updated = [...webProjects];
                              updated[idx].role = e.target.value;
                              setWebProjects(updated);
                              setHasUnsavedChanges(true);
                            }}
                            className="flex-1 px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                          />
                          <input
                            type="text"
                            value={proj.year}
                            onChange={(e) => {
                              const updated = [...webProjects];
                              updated[idx].year = e.target.value;
                              setWebProjects(updated);
                              setHasUnsavedChanges(true);
                            }}
                            className="w-24 px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase mb-1">Live URL (optional)</label>
                        <input
                          type="text"
                          value={proj.liveUrl || ""}
                          onChange={(e) => {
                            const updated = [...webProjects];
                            updated[idx].liveUrl = e.target.value;
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-neutral-500 uppercase mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...webProjects];
                            updated[idx].description = e.target.value;
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white font-sans text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-neutral-500 uppercase mb-1">
                          Tech Stack Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={proj.techTags.join(", ")}
                          onChange={(e) => {
                            const updated = [...webProjects];
                            updated[idx].techTags = e.target.value.split(",").map((s) => s.trim());
                            setWebProjects(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-4 pt-2">
                        <div className="relative w-28 h-18 rounded bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                          {proj.coverImage && (
                            <Image
                              src={proj.coverImage}
                              alt="preview"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <label className="block text-neutral-500 uppercase mb-1">
                            Cover Image ({proj.coverImage})
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                try {
                                  const res = await uploadFile(f, proj.coverImage, "media");
                                  const updated = [...webProjects];
                                  updated[idx].coverImage = res.url;
                                  setWebProjects(updated);
                                  setHasUnsavedChanges(true);
                                  setStatusMsg({ text: `Image uploaded: ${res.url}`, type: "success" });
                                } catch (upErr) {
                                  setStatusMsg({ text: String(upErr), type: "error" });
                                }
                              }
                            }}
                            className="text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GRAPHIC WORK */}
          {activeTab === "graphic" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-2xl font-medium text-white">Graphic Work Items</h2>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    Manage items for /graphic-work masonry gallery and lightbox.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const newId = `gw-${Date.now()}`;
                      const newItem: GraphicWorkContent = {
                        id: newId,
                        title: "Untitled Graphic Work",
                        category: "Branding",
                        description: "Short description of the graphic work.",
                        imagePath: "/images/work-01.svg",
                        year: "2024",
                        tags: ["Identity", "Design"],
                        gradient: "from-amber-600/30 via-orange-950/40 to-neutral-950",
                        accent: "#FF5722",
                        aspect: "square",
                        order: graphicWorks.length + 1,
                        visible: true,
                      };
                      setGraphicWorks([...graphicWorks, newItem]);
                      setHasUnsavedChanges(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-white text-xs font-mono transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>

                  <button
                    onClick={handleSaveGraphicWorks}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5722] hover:bg-[#ff6c3b] text-neutral-950 font-medium text-xs font-mono transition-all shadow-md shadow-[#FF5722]/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Gallery"}</span>
                  </button>
                </div>
              </div>

              {/* Graphic Work List */}
              <div className="space-y-4">
                {graphicWorks.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#FF5722] bg-[#FF5722]/10 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...graphicWorks];
                            updated[idx].title = e.target.value;
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="bg-transparent text-lg font-medium text-white border-b border-transparent focus:border-[#FF5722] focus:outline-none px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = [...graphicWorks];
                            updated[idx].visible = !updated[idx].visible;
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className={`p-2 rounded-lg text-xs font-mono flex items-center gap-1 ${
                            item.visible
                              ? "text-emerald-400 bg-emerald-950/30"
                              : "text-neutral-500 bg-neutral-900"
                          }`}
                          title="Toggle visibility"
                        >
                          {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const updated = [...graphicWorks];
                            const temp = updated[idx - 1];
                            updated[idx - 1] = updated[idx];
                            updated[idx] = temp;
                            updated.forEach((g, i) => (g.order = i + 1));
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button
                          disabled={idx === graphicWorks.length - 1}
                          onClick={() => {
                            if (idx === graphicWorks.length - 1) return;
                            const updated = [...graphicWorks];
                            const temp = updated[idx + 1];
                            updated[idx + 1] = updated[idx];
                            updated[idx] = temp;
                            updated.forEach((g, i) => (g.order = i + 1));
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete graphic item "${item.title}"?`)) {
                              const updated = graphicWorks.filter((_, i) => i !== idx);
                              updated.forEach((g, i) => (g.order = i + 1));
                              setGraphicWorks(updated);
                              setHasUnsavedChanges(true);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-950/40 text-rose-400 hover:text-rose-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-neutral-500 uppercase mb-1">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => {
                            const updated = [...graphicWorks];
                            updated[idx].category = e.target.value as GraphicWorkContent["category"];
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        >
                          <option value="Branding">Branding</option>
                          <option value="Posters">Posters</option>
                          <option value="Social">Social</option>
                          <option value="Editorial">Editorial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase mb-1">Grid Aspect Ratio</label>
                        <select
                          value={item.aspect || "square"}
                          onChange={(e) => {
                            const updated = [...graphicWorks];
                            updated[idx].aspect = e.target.value as "tall" | "square" | "wide";
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        >
                          <option value="square">Square</option>
                          <option value="tall">Tall (Span 2 rows)</option>
                          <option value="wide">Wide (Span 2 cols)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-500 uppercase mb-1">Year</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => {
                            const updated = [...graphicWorks];
                            updated[idx].year = e.target.value;
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-neutral-500 uppercase mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...graphicWorks];
                            updated[idx].description = e.target.value;
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white font-sans text-sm"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-neutral-500 uppercase mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={item.tags.join(", ")}
                          onChange={(e) => {
                            const updated = [...graphicWorks];
                            updated[idx].tags = e.target.value.split(",").map((s) => s.trim());
                            setGraphicWorks(updated);
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white"
                        />
                      </div>

                      <div className="sm:col-span-3 flex items-center gap-4 pt-2">
                        <div className="relative w-24 h-24 rounded bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                          {item.imagePath && (
                            <Image
                              src={item.imagePath}
                              alt="preview"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <label className="block text-neutral-500 uppercase mb-1">
                            Uploaded Image ({item.imagePath})
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                try {
                                  const uploadRes = await uploadFile(f, item.imagePath, "media");
                                  const updated = [...graphicWorks];
                                  updated[idx].imagePath = uploadRes.url;
                                  if (uploadRes.width) updated[idx].width = uploadRes.width;
                                  if (uploadRes.height) updated[idx].height = uploadRes.height;
                                  if (uploadRes.blurDataURL) updated[idx].blurDataURL = uploadRes.blurDataURL;
                                  setGraphicWorks(updated);
                                  setHasUnsavedChanges(true);
                                  setStatusMsg({ text: `Image uploaded & optimized: ${uploadRes.url} (${uploadRes.width}x${uploadRes.height})`, type: "success" });
                                } catch (upErr) {
                                  setStatusMsg({ text: String(upErr), type: "error" });
                                }
                              }
                            }}
                            className="text-xs text-neutral-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-mono file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FILES */}
          {activeTab === "files" && site && (
            <div className="space-y-8">
              <div className="pb-6 border-b border-neutral-800">
                <h2 className="text-2xl font-medium text-white">System Files &amp; Assets</h2>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Upload and replace your resume PDF and Open Graph social sharing image.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5722]" />
                  <h3 className="text-base font-medium text-white">Resume File (PDF)</h3>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  Currently served from: <code className="text-white">{site.resumePath}</code>
                </p>

                <div className="pt-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        try {
                          await uploadFile(f, undefined, "resume");
                          setStatusMsg({
                            text: "Resume PDF uploaded successfully and replaced at /public/resume.pdf",
                            type: "success",
                          });
                        } catch (err) {
                          setStatusMsg({ text: String(err), type: "error" });
                        }
                      }
                    }}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-[#FF5722] file:text-black file:font-semibold hover:file:bg-[#ff6c3b]"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 space-y-4">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-[#FF5722]" />
                  <h3 className="text-base font-medium text-white">Open Graph / Social Sharing Image</h3>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  Auto-optimized to 1200×630 WebP. Current: <code className="text-white">{site.ogImagePath}</code>
                </p>

                <div className="relative w-72 h-36 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden">
                  <Image src={site.ogImagePath} alt="OG image preview" fill className="object-cover" />
                </div>

                <div className="pt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        try {
                          const url = await uploadFile(f, site.ogImagePath, "og");
                          setSite({ ...site, ogImagePath: url });
                          setHasUnsavedChanges(true);
                          setStatusMsg({
                            text: `New OG Image saved to ${url}. Remember to click "Save Settings" on Site tab.`,
                            type: "success",
                          });
                        } catch (err) {
                          setStatusMsg({ text: String(err), type: "error" });
                        }
                      }
                    }}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-mono file:bg-[#FF5722] file:text-black file:font-semibold hover:file:bg-[#ff6c3b]"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
