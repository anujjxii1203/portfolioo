import type { Metadata } from "next";
import { Inter, Space_Grotesk, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteContent();
  const fullName = `${site.name} ${site.surname}`;

  return {
    metadataBase: new URL("https://yourdomain.com"),
    title: {
      default: `${fullName} — ${site.roleTag}`,
      template: `%s | ${fullName}`,
    },
    description: site.seoDescription,
    keywords: [
      "Graphic Designer",
      "Web Developer",
      "Creative Developer",
      "Brand Identity",
      "UI/UX Design",
      "Frontend Engineer",
      "Next.js Portfolio",
      site.location || "Noida, India",
    ],
    authors: [{ name: fullName, url: "https://yourdomain.com" }],
    creator: fullName,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://yourdomain.com",
      title: `${fullName} — ${site.roleTag}`,
      description: site.seoDescription,
      siteName: `${fullName} Portfolio`,
      images: [
        {
          url: site.ogImagePath,
          width: 1200,
          height: 630,
          alt: `${fullName} Portfolio Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullName} — ${site.roleTag}`,
      description: site.seoDescription,
      creator: "@yourhandle",
      images: [site.ogImagePath],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = getSiteContent();
  const fullName = `${site.name} ${site.surname}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    jobTitle: site.roleTag,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
    },
    email: site.email,
    sameAs: [
      site.socials.github,
      site.socials.linkedin,
      site.socials.behance,
      site.socials.x,
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansDevanagari.variable} dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0A0A0A] text-[#F5F5F5] antialiased selection:bg-[#FF5722] selection:text-neutral-950 font-sans">
        {/* Skip to Content */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FF5722] focus:text-black focus:font-mono focus:text-xs focus:rounded"
        >
          Skip to main content
        </a>

        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
