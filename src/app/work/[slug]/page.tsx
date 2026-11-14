import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getWebProjects } from "@/lib/content";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const projects = getWebProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projects = getWebProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.description,
      images: [project.coverImage],
    },
  };
}

async function CaseStudyContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = getWebProjects();
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  if (!project || project.visible === false) {
    notFound();
  }

  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <div className="container-custom">
      {/* Back link */}
      <Link
        href="/web-dev"
        className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-[#FF5722] transition-colors mb-10 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>BACK TO ALL WEB PROJECTS</span>
      </Link>

      {/* Title and Category */}
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#FF5722] mb-3">
          <span>PROJECT {project.number}</span>
          <span className="w-8 h-[1px] bg-[#FF5722]" />
          <span>Web Development</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#F5F5F5] leading-[1.05]">
          {project.title}
        </h1>

        <p className="mt-6 text-xl sm:text-2xl font-light text-neutral-300 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Project Meta Grid */}
      <div className="mt-12 py-8 border-y border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
        <div>
          <span className="text-neutral-500 uppercase tracking-wider block mb-1">Timeline</span>
          <span className="text-neutral-200">{project.year}</span>
        </div>
        <div>
          <span className="text-neutral-500 uppercase tracking-wider block mb-1">My Role</span>
          <span className="text-neutral-200">{project.role}</span>
        </div>
        <div>
          <span className="text-neutral-500 uppercase tracking-wider block mb-1">Tech Stack</span>
          <span className="text-neutral-200">{project.techTags.join(", ")}</span>
        </div>
        <div>
          <span className="text-neutral-500 uppercase tracking-wider block mb-1">Key Impact</span>
          <span className="text-[#FF5722] font-semibold">{project.keyResult}</span>
        </div>
      </div>

      {/* Project Cover Visual */}
      <div className="mt-12 relative w-full h-[400px] sm:h-[550px] md:h-[650px] rounded-2xl overflow-hidden border border-white/[0.08]">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Case Study Content Sections */}
      <div className="mt-20 max-w-4xl mx-auto space-y-24">
        {/* The Challenge / Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-[#FF5722]" />
            <span>01. Project Context</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-neutral-100">
            Architecture &amp; Mission
          </h2>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* The Result / Impact */}
        <section className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#161413] to-[#0D0D0D] border border-[#FF5722]/30 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF5722]">
            <CheckCircle2 className="w-4 h-4" />
            <span>02. Measurable Result</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-white">
            Tangible Business &amp; Engineering Outcome
          </h2>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            {project.keyResult}
          </p>
        </section>
      </div>

      {/* Next Project Footer Link */}
      {nextProject && nextProject.slug !== project.slug && (
        <div className="mt-28 pt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-2">
              Next Project
            </span>
            <h3 className="text-2xl sm:text-3xl font-medium text-neutral-100">
              {nextProject.title}
            </h3>
          </div>

          <Link
            href={`/work/${nextProject.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-700 hover:border-[#FF5722] text-neutral-200 hover:text-white transition-all group"
          >
            <span>Read Case Study</span>
            <ArrowUpRight className="w-4 h-4 text-[#FF5722] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-32 pb-24">
        <Suspense
          fallback={
            <div className="container-custom min-h-[50vh] flex items-center justify-center font-mono text-xs text-neutral-500">
              Loading Case Study...
            </div>
          }
        >
          <CaseStudyContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
