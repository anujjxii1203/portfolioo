# Portfolio & Personal Website

Personal portfolio for **Anuj Rai** — Graphic Designer & Web Developer based in Noida, India.
Showcasing brand identities, editorial posters, and responsive web applications built with Next.js, React, TypeScript, and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Local WebP optimization)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Set your local admin password in `.env.local`:
```env
ADMIN_PASSWORD=your_secure_local_password
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 🔒 Local Admin Panel

The site includes a local-only dashboard at `/admin` to edit site copy, reorder web projects, upload posters, and replace resume files directly from the browser.

> **Security Note**: The `/admin` route and all `/api/admin/*` endpoints are locked strictly to local development (`NODE_ENV === "development"`). In production, they automatically return a `404 Not Found`.

---

## 🚢 Production Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set Framework Preset to **Next.js**.
4. Deploy — static assets and pages will be generated automatically.
