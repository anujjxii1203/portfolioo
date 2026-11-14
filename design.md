# design.md — Portfolio Website Design Spec
Reference: https://jaspreetsingh.xyz/ (structure and design approach only)
Goal: A portfolio for a **graphic designer + web developer**, built with the same level of craft, but with my own content, identity and visuals.

> Legend: **[Observed]** = seen on the reference page. **[Recommended]** = my suggestion, because the reference's exact fonts/colors/animations could not be read from the page text. Verify these in the browser DevTools.

---

## 1. Concept & Positioning
1. **[Observed]** Single-page portfolio with a personal, storytelling tone, not a corporate one.
2. **[Observed]** Title format: `Name | Role` ("Designer & Developer").
3. **[Observed]** Core promise: make complex things feel simple.
4. **[Observed]** The person is shown as a whole human: hobbies, travel, philosophy, poetry, not only skills.
5. **[Recommended]** My version: "Graphic Designer & Web Developer", with one line that shows both sides of me (visual craft + code).

## 2. Site Map
1. **[Observed]** One home page with 3 anchor sections: `#about`, `#work`, `#contact`.
2. **[Observed]** Separate case-study pages: `/work/<project-slug>`.
3. **[Observed]** Resume as a downloadable PDF.
4. **[Observed]** "Skip to content" link for keyboard users (`#main`).
5. **[Recommended]** For me: Home, `/work/<slug>` pages, optional `/gallery` for pure graphic work (posters, logos, branding).

## 3. Navigation
1. **[Observed]** Minimal top nav with only 3 links: About, Work, Contact.
2. **[Observed]** Resume link placed separately, next to the role label.
3. **[Observed]** Role label "Designer & Developer" shown in the header area.
4. **[Recommended]** Fixed/sticky nav, small text, smooth scroll to anchors, active-section highlight.
5. **[Recommended]** Mobile: collapse to a simple full-screen menu.

## 4. Preloader / Intro
1. **[Observed]** Loading screen with a percentage counter (0% → 100%) and the word "Loading".
2. **[Observed]** Greeting "Hello, I'm Jaspreet" appears as part of the intro.
3. **[Recommended]** Keep the preloader under ~2 seconds. Counter animates, then the greeting reveals the page.
4. **[Recommended]** Skip the preloader on repeat visits (sessionStorage) and respect `prefers-reduced-motion`.

## 5. Hero Section
1. **[Observed]** Big greeting headline: "Hello, I'm <Name>".
2. **[Observed]** One witty, humble sub-line about the profession.
3. **[Observed]** Hero is mostly typography, with very little clutter.
4. **[Recommended]** My hero: large name, one-line identity, subtle motion on the text (stagger or mask reveal), and one strong graphic element from my own work.

## 6. About Section
1. **[Observed]** Split into short blocks, each with a two-part heading: "X by profession" and "Y by ambition".
2. **[Observed]** Block 1 (profession): what I do, how I think about design, product journey from idea to launch.
3. **[Observed]** Block 2 (ambition): curiosity, interests, philosophy, personality.
4. **[Observed]** Lifestyle details (motorcycle rides, home village, city life) make it memorable.
5. **[Observed]** Two quote blocks in the original language plus English translation, with the author credited.
6. **[Recommended]** My version: write my own two blocks and pick my own quotes or a personal line. Do not reuse the reference's text or quotes.

## 7. Selected Works Section
1. **[Observed]** Intro paragraph: design judgement + engineering depth, ownership from UX to production.
2. **[Observed]** A numbered list of projects: 01, 02, 03.
3. **[Observed]** Each project item has: number, title, one-line description, one key metric (e.g. "4× daily traffic", "15/15 tasks completed unaided"), and a "View case study" link.
4. **[Observed]** Unfinished projects show "Case study soon" instead of a link.
5. **[Observed]** Only a few projects, so quality over quantity.
6. **[Recommended]** My version: 3 to 5 projects. Mix graphic work (branding, posters, social creatives) and web builds. Every project gets one measurable result or a clear one-line outcome.

## 8. Case Study Page Pattern
1. **[Observed]** Each case study lives at its own URL.
2. **[Observed]** Descriptions follow problem, solution, result.
3. **[Recommended]** Template: Cover image, Role/Year/Tools, Problem, Process (sketches, wireframes), Final visuals, Result/metric, Next project link.

## 9. Contact Section
1. **[Observed]** Heading "Say hello" with a playful, human paragraph.
2. **[Observed]** Links: Email, GitHub, X, LinkedIn, Resume.
3. **[Observed]** Email uses a `mailto:` link.
4. **[Recommended]** Add Behance or Dribbble for a graphic designer. Optional: a simple contact form.

## 10. Footer
1. **[Observed]** "Designed & developed by <Name>" and a copyright line with the year.
2. **[Observed]** Award/recognition link (Awwwards listing).
3. **[Recommended]** Keep footer tiny. Optionally add "Back to top".

## 11. Typography
1. **[Observed]** Heading hierarchy: H1 greeting, H2 section titles, H3 project titles.
2. **[Observed]** Supports Devanagari script in the quotes, so the font stack must handle Hindi.
3. **[Recommended]** One expressive display font for headings (large, tight tracking) and one clean sans for body, with a Devanagari fallback (e.g. Noto Sans Devanagari).
4. **[Recommended]** Fluid type with `clamp()`. Body 16–18px, line-height 1.6. Headings 48–140px on desktop.
5. **[Recommended]** Quotes in italic or a serif to set them apart.

## 12. Color System
1. **[Observed]** Browser theme color is `#000000`, which suggests a dark, black-based design.
2. **[Recommended]** Dark base `#000000` / `#0A0A0A`, main text `#F5F5F5`, muted text `#8A8A8A`, borders `rgba(255,255,255,0.12)`.
3. **[Recommended]** One accent color from my own brand (pick one, use sparingly for links, hover and metrics).
4. **[Recommended]** Optional light-mode toggle. Contrast ratio at least 4.5:1.

## 13. Layout & Spacing
1. **[Recommended]** 12-column grid, max width about 1200–1400px, generous side padding.
2. **[Recommended]** Large vertical gaps between sections (96–160px) so the page breathes.
3. **[Recommended]** Text blocks limited to ~60–70 characters per line.
4. **[Recommended]** Project list as full-width rows with big numbers.

## 14. Motion & Interaction
1. **[Recommended]** Scroll-triggered fade/slide reveals for text and project rows.
2. **[Recommended]** Hover on project rows: arrow moves, title shifts, image preview appears.
3. **[Recommended]** Smooth scrolling (Lenis) and subtle custom cursor (optional).
4. **[Recommended]** Easing: ease-out cubic, durations 400–800ms.
5. **[Recommended]** Disable heavy animation for `prefers-reduced-motion`.

## 15. Content Voice & Tone
1. **[Observed]** First person, conversational, self-aware humor.
2. **[Observed]** Short sentences. Modest, not boastful.
3. **[Observed]** Mixes professional claims with personal philosophy.
4. **[Recommended]** My voice: honest, a little funny, specific. Replace every placeholder with my real story.

## 16. Imagery
1. **[Observed]** Social preview image is a personal photo (outdoors, with a motorcycle), not a mockup.
2. **[Observed]** Image alt text is descriptive.
3. **[Recommended]** Use one authentic portrait plus real project visuals. Export as WebP/AVIF, lazy-load, always set width and height.
4. **[Recommended]** Social image: 1200×630.

## 17. SEO & Meta
1. **[Observed]** Canonical URL, meta description, Open Graph tags, Twitter card (`summary_large_image`), theme-color.
2. **[Recommended]** Add JSON-LD `Person` schema, sitemap.xml and robots.txt.
3. **[Recommended]** Unique title and description per case-study page.

## 18. Accessibility
1. **[Observed]** Skip-to-content link, semantic headings, alt text.
2. **[Recommended]** Visible focus states, keyboard-friendly nav, ARIA labels for icon links, language attributes for Hindi text (`lang="hi"`).

## 19. Responsive Behavior
1. **[Recommended]** Mobile-first. Breakpoints: 480, 768, 1024, 1440.
2. **[Recommended]** Project rows stack, hover effects become tap states, nav collapses.

## 20. Performance Targets
1. **[Recommended]** Lighthouse 90+ on all categories, LCP under 2.5s, CLS near 0.
2. **[Recommended]** Self-host fonts with `font-display: swap`, minimal JS, preload hero assets.

## 21. Suggested Tech Stack
1. **[Recommended]** Next.js or Astro + TypeScript + Tailwind CSS.
2. **[Recommended]** GSAP / Framer Motion for animation, Lenis for scroll.
3. **[Recommended]** Content in MDX/JSON so I can add projects easily.
4. **[Recommended]** Deploy on Vercel or Netlify, with my own domain.

## 22. Extras for a Graphic Designer
1. Visual gallery grid (logos, posters, packaging, social media) with filters.
2. Before/after sliders for brand work.
3. Short process breakdown per project.
4. Downloadable resume and a downloadable brand/media kit.

## 23. Originality Rule
1. Use this file as a **structure and quality reference only**.
2. Do not copy the reference's text, poems, quotes, photos, project names or exact visual identity.
3. Everything on my site must be my own content and my own visual identity.

---