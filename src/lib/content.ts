import siteJson from "@/../content/site.json";
import webProjectsJson from "@/../content/web-projects.json";
import graphicWorksJson from "@/../content/graphic-works.json";

export interface SiteContent {
  name: string;
  surname: string;
  roleTag: string;
  heroHighlight: string;
  typewriterWords: string[];
  location?: string;
  playIntro?: boolean;
  about: {
    professionTitle: string;
    professionBody: string;
    ambitionTitle: string;
    ambitionBody: string;
    quote?: {
      original: string;
      translation: string;
      author: string;
      lang: string;
    };
  };
  contact: {
    heading: string;
    subheading: string;
  };
  showContactPhoto?: boolean;
  contactPhoto?: string;
  contactPhotoAlt?: string;
  contactPhotoFocusX?: number;
  contactPhotoFocusY?: number;
  contactPhotoWidth?: number;
  contactPhotoHeight?: number;
  contactPhotoBlurDataURL?: string;
  email: string;
  accentColor: string;
  socials: {
    github: string;
    linkedin: string;
    behance: string;
    x: string;
  };
  resumePath: string;
  ogImagePath: string;
  seoTitle: string;
  seoDescription: string;
}

export interface WebProjectContent {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  techTags: string[];
  keyResult: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  coverImage: string;
  year: string;
  role: string;
  order: number;
  visible: boolean;
}

export interface GraphicWorkContent {
  id: string;
  title: string;
  category: "Branding" | "Posters" | "Social" | "Editorial";
  description: string;
  imagePath: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  year: string;
  tags: string[];
  gradient?: string;
  accent?: string;
  aspect?: "tall" | "square" | "wide";
  order: number;
  visible: boolean;
}

export function getSiteContent(): SiteContent {
  return siteJson as SiteContent;
}

export function getWebProjects(): WebProjectContent[] {
  const list = [...(webProjectsJson as WebProjectContent[])];
  return list.sort((a, b) => a.order - b.order);
}

export function getGraphicWorks(): GraphicWorkContent[] {
  const list = [...(graphicWorksJson as GraphicWorkContent[])];
  return list.sort((a, b) => a.order - b.order);
}
