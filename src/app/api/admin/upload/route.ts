import { NextResponse } from "next/server";
import { isLocalDev, isAuthenticated } from "@/lib/adminAuth";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

export async function POST(req: Request) {
  if (!isLocalDev()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const previousPath = formData.get("previousPath") as string | null;
    const fileType = formData.get("fileType") as string | null; // e.g. 'resume' | 'og' | 'media'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 50MB to support large raw posters for processing)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: jpg, png, webp, svg, pdf" },
        { status: 400 }
      );
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let finalPublicPath = "";
    let width: number | undefined;
    let height: number | undefined;
    let blurDataURL: string | undefined;

    // If uploading specifically the resume PDF to replace /public/resume.pdf
    if (fileType === "resume" && file.type === "application/pdf") {
      const dest = path.join(PUBLIC_DIR, "resume.pdf");
      fs.writeFileSync(dest, buffer);
      finalPublicPath = "/resume.pdf";
    } else if (fileType === "og") {
      // OG image conversion to 1200x630 webp
      const filename = `og-${Date.now()}.webp`;
      const dest = path.join(UPLOADS_DIR, filename);
      const res = await sharp(buffer)
        .resize({ width: 1200, height: 630, fit: "cover" })
        .webp({ quality: 90 })
        .toFile(dest);
      width = res.width;
      height = res.height;
      finalPublicPath = `/uploads/${filename}`;
    } else if (fileType === "portrait" || fileType === "contact") {
      // Portrait / Contact photo conversion: max width 1600px, WebP quality 85
      const safeName = file.name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const filename = `contact-${Date.now()}-${safeName || "portrait"}.webp`;
      const dest = path.join(UPLOADS_DIR, filename);

      const processed = await sharp(buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(dest);

      width = processed.width;
      height = processed.height;

      const blurBuffer = await sharp(buffer)
        .resize({ width: 24, withoutEnlargement: true })
        .webp({ quality: 20 })
        .toBuffer();
      blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

      finalPublicPath = `/uploads/${filename}`;
    } else if (file.type === "image/svg+xml" || file.type === "application/pdf") {
      // Keep SVGs and standard PDFs as-is without re-encoding
      const ext = file.name.split(".").pop() || (file.type === "image/svg+xml" ? "svg" : "pdf");
      const safeName = file.name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const cleanName = `${Date.now()}-${safeName || "file"}.${ext}`;
      const dest = path.join(UPLOADS_DIR, cleanName);
      fs.writeFileSync(dest, buffer);
      finalPublicPath = `/uploads/${cleanName}`;
    } else {
      // Image: Auto-optimize using sharp -> max width 2000px, converted to webp quality 85
      const safeName = file.name
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const filename = `${Date.now()}-${safeName || "image"}.webp`;
      const dest = path.join(UPLOADS_DIR, filename);

      const sharpInstance = sharp(buffer);
      const meta = await sharpInstance.metadata();

      const processed = await sharp(buffer)
        .resize({ width: 2000, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(dest);

      width = processed.width;
      height = processed.height;

      // Generate tiny blurred base64 placeholder (blurDataURL)
      const blurBuffer = await sharp(buffer)
        .resize({ width: 24, withoutEnlargement: true })
        .webp({ quality: 20 })
        .toBuffer();
      blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

      finalPublicPath = `/uploads/${filename}`;
    }

    // Delete previous file if it was inside /uploads
    if (previousPath && previousPath.startsWith("/uploads/")) {
      const oldFilename = path.basename(previousPath);
      const oldFilePath = path.join(UPLOADS_DIR, oldFilename);
      if (fs.existsSync(oldFilePath) && oldFilename !== path.basename(finalPublicPath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (delErr) {
          console.warn("Could not delete previous file:", delErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      url: finalPublicPath,
      name: file.name,
      size: file.size,
      width,
      height,
      blurDataURL,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
