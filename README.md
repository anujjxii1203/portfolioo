# Portfolio Website with Local CMS Admin

Modern personal portfolio for **Anuj [SURNAME]** (Graphic Designer & Web Developer).
Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Lenis smooth scrolling, and Framer Motion.

---

## 🔒 Temporary Local Admin Panel (`/admin`)

This project includes a local-only content management dashboard so you can edit site text, add web projects, upload graphic design works, and replace your resume PDF straight from your browser.

### 1. How to Run Locally
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000/admin
   ```
3. Enter the default password from `.env.local`:
   ```
   admin123
   ```
   *(To change this password, edit `ADMIN_PASSWORD` in `.env.local`)*

### 2. Available Admin Tabs
- **Site Settings**: Edit your First Name, Surname, Hero Highlight Word (the orange highlight in *"Hello, I'm [Anuj]."*), role tag, location, quote, bio narrative, email, and social links.
- **Web Projects**: Add, Edit, Reorder (Up/Down), or Delete projects shown on `/web-dev` with image upload and tech tags.
- **Graphic Work**: Manage portfolio artwork for the `/graphic-work` masonry grid and lightbox preview.
- **File Assets**: Upload and replace your `resume.pdf` or OG social card image (auto-converted to WebP via Sharp).

### 3. Automatic Backups & File Storage
- Every save automatically creates a timestamped backup in [`/content/.backups/`](file:///d:/websites/potfolio%20webstie/content/.backups/) (keeps the latest 20 backups).
- Uploaded media is optimized to max 2000px WebP and saved in [`/public/uploads/`](file:///d:/websites/potfolio%20webstie/public/uploads/).

---

## 🚀 How to Deploy on Vercel

The admin panel and admin API routes are **strictly locked to development** (`NODE_ENV === "development"`). When built or deployed to production, `/admin` and `/api/admin/*` automatically return a **404 Not Found**.

### Deployment Workflow:
1. Make your content edits and image uploads in the local `/admin` panel.
2. Commit your updated content files and images:
   ```bash
   git add content/ public/uploads/ public/resume.pdf
   git commit -m "chore: update portfolio content and works"
   git push origin main
   ```
3. Connect your GitHub repository to [Vercel](https://vercel.com).
4. Vercel will build the static public site directly from your `/content/*.json` files!
