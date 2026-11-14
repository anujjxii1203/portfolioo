import fs from "fs";
import path from "path";
import { SiteContent, WebProjectContent, GraphicWorkContent } from "./content";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BACKUPS_DIR = path.join(CONTENT_DIR, ".backups");

export function readServerSiteContent(): SiteContent {
  const filePath = path.join(CONTENT_DIR, "site.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function readServerWebProjects(): WebProjectContent[] {
  const filePath = path.join(CONTENT_DIR, "web-projects.json");
  const list = JSON.parse(fs.readFileSync(filePath, "utf-8")) as WebProjectContent[];
  return list.sort((a, b) => a.order - b.order);
}

export function readServerGraphicWorks(): GraphicWorkContent[] {
  const filePath = path.join(CONTENT_DIR, "graphic-works.json");
  const list = JSON.parse(fs.readFileSync(filePath, "utf-8")) as GraphicWorkContent[];
  return list.sort((a, b) => a.order - b.order);
}

export function backupContentFile(filename: string) {
  try {
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }
    const sourcePath = path.join(CONTENT_DIR, filename);
    if (!fs.existsSync(sourcePath)) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `${filename.replace(".json", "")}-${timestamp}.json`;
    const destPath = path.join(BACKUPS_DIR, backupName);
    fs.copyFileSync(sourcePath, destPath);

    // Keep last 20 backups
    const files = fs
      .readdirSync(BACKUPS_DIR)
      .filter((f) => f.startsWith(filename.replace(".json", "")))
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(BACKUPS_DIR, f)).mtimeMs,
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 20) {
      for (const old of files.slice(20)) {
        try {
          fs.unlinkSync(path.join(BACKUPS_DIR, old.name));
        } catch {}
      }
    }
  } catch (err) {
    console.error("Backup failed:", err);
  }
}

export function writeServerContentFile(filename: string, data: unknown) {
  backupContentFile(filename);
  const targetPath = path.join(CONTENT_DIR, filename);
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), "utf-8");
}
