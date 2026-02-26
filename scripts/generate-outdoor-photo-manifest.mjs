import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PHOTO_DIR = path.join(process.cwd(), "public", "images", "outdoor-photography");
const MANIFEST_PATH = path.join(PHOTO_DIR, "manifest.json");
const PUBLIC_PREFIX = "/images/outdoor-photography";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

const toAlt = (fileName) => {
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return baseName || "Outdoor photo";
};

const encodePathSegment = (name) => encodeURIComponent(name).replace(/%2F/g, "/");

const generateManifest = async () => {
  await mkdir(PHOTO_DIR, { recursive: true });

  const entries = await readdir(PHOTO_DIR, { withFileTypes: true });
  const photos = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => ({
      src: `${PUBLIC_PREFIX}/${encodePathSegment(fileName)}`,
      alt: toAlt(fileName)
    }));

  await writeFile(MANIFEST_PATH, `${JSON.stringify(photos, null, 2)}\n`, "utf8");
  console.log(`Generated ${photos.length} outdoor photo entries at ${MANIFEST_PATH}`);
};

generateManifest().catch((error) => {
  console.error("Failed to generate outdoor photo manifest", error);
  process.exitCode = 1;
});
