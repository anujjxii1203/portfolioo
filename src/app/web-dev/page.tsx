import Link from "next/link";
import { getWebProjects, getSiteContent } from "@/lib/content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowUpRight, Code, ExternalLink, Image as ImageIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteContent();
  return {
    title: `Web Development — ${site.name} ${site.surname}`,
    description:
      "Engineering high-performance web applications, trading dashboards, design systems, and fluid digital experiences with Next.js and TypeScript.",
    openGraph: {
      title: `Web Development — ${site.name} ${site.surname}`,
      description: "Engineering high-performance web applications, design systems, and frontend architectures.",
      images: [site.ogImagePath],
    },
  };
}

export default function WebDevPage() {
  const allProjects = getWebProjects();
  const visibleProjects = allProjects.filter((p) => p.visible);

  return (
    <>
      <Navbar />

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
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FF5722] mb-3">
              <Code className="w-4 h-4" />
              <span>Full-Stack &amp; Front-End Engineering</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#F5F5F5] leading-tight">
              Web <span className="text-[#FF5722]">Development</span>.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-neutral-400 font-light leading-relaxed max-w-2xl">
              Websites and applications built with Next.js, React, and TypeScript. Focused on responsive layout, performance, and clean code.
            </p>
          </div>

          {/* Numbered Project List */}
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className="group py-10 md:py-14 transition-colors hover:bg-neutral-900/30 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Number & Year */}
                  <div className="lg:col-span-2 flex lg:flex-col items-baseline lg:items-start gap-3 font-mono">
                    <span className="text-4xl sm:text-5xl font-light text-neutral-600 group-hover:text-[#FF5722] transition-colors">
                      {project.number}
                    </span>
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">
                      {project.year} • {project.role}
                    </span>
                  </div>

                  {/* Project Details */}
                  <div className="lg:col-span-6 space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-medium text-[#F5F5F5] group-hover:text-[#FF5722] transition-colors">
                      {project.title}
                    </h2>

                    <p className="text-base text-neutral-400 font-light leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech stack badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.techTags.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono text-neutral-400 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Metric & Links */}
                  <div className="lg:col-span-4 flex flex-col justify-between gap-6 lg:items-end">
                    <div className="lg:text-right">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                        Key Outcome
                      </span>
                      <span className="inline-block text-xs font-mono text-[#FF5722] bg-[#FF5722]/10 border border-[#FF5722]/20 px-3 py-1.5 rounded font-medium">
                        {project.keyResult}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {project.caseStudyUrl && (
                        <Link
                          href={project.caseStudyUrl}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-700 hover:border-[#FF5722] text-[#F5F5F5] hover:text-[#FF5722] transition-all group/btn"
                        >
                          <span>View case study</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
              href="/graphic-work"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-700 hover:border-[#FF5722] text-sm text-[#F5F5F5] hover:text-[#FF5722] transition-all group"
            >
              <ImageIcon className="w-4 h-4 text-[#FF5722]" />
              <span>Explore Graphic Work</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
