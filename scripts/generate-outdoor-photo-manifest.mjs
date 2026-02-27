import { execFile } from "node:child_process";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const PHOTO_DIR = path.join(process.cwd(), "public", "images", "outdoor-photography");
const MANIFEST_PATH = path.join(PHOTO_DIR, "manifest.json");
const SKIPPED_MANIFEST_PATH = path.join(PHOTO_DIR, "manifest.skipped.json");
const PUBLIC_PREFIX = "/images/outdoor-photography";

const runCommand = promisify(execFile);

const WEB_IMAGE_EXTENSIONS = new Set([
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif"
]);
const HEIF_CANDIDATE_EXTENSIONS = new Set([".heic", ".heif", ".jpg", ".jpeg"]);

const toAlt = (fileName) => {
  const baseName = fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return baseName || "Outdoor photo";
};

const encodePathSegment = (name) => encodeURIComponent(name).replace(/%2F/g, "/");
const isHeifDescription = (description) => /heif|heic/i.test(description);

const getFileDescription = async (filePath) => {
  const { stdout } = await runCommand("file", ["-b", filePath]);
  return stdout.trim();
};

const getImageSize = async (filePath) => {
  try {
    const { stdout } = await runCommand("sips", ["-g", "pixelWidth", "-g", "pixelHeight", filePath]);
    const widthMatch = stdout.match(/pixelWidth:\s*(\d+)/i);
    const heightMatch = stdout.match(/pixelHeight:\s*(\d+)/i);
    if (!widthMatch || !heightMatch) return null;

    return {
      width: Number(widthMatch[1]),
      height: Number(heightMatch[1])
    };
  } catch {
    return null;
  }
};

const convertToJpeg = async (inputPath, outputPath) => {
  await runCommand("sips", [
    "-s",
    "format",
    "jpeg",
    "-s",
    "formatOptions",
    "best",
    inputPath,
    "--out",
    outputPath
  ]);
};

const normalizeHeifFiles = async (fileNames) => {
  let convertedToSiblingJpeg = 0;
  let convertedToJpeg = 0;

  for (const fileName of fileNames) {
    const extension = path.extname(fileName).toLowerCase();
    if (!HEIF_CANDIDATE_EXTENSIONS.has(extension)) continue;

    const filePath = path.join(PHOTO_DIR, fileName);
    let description;
    try {
      description = await getFileDescription(filePath);
    } catch {
      continue;
    }

    if (!isHeifDescription(description)) continue;

    const baseName = path.basename(fileName, path.extname(fileName));

    if (extension === ".jpg" || extension === ".jpeg") {
      const outputPath = path.join(PHOTO_DIR, `${baseName}.converted.jpeg`);
      await convertToJpeg(filePath, outputPath);
      convertedToSiblingJpeg += 1;
      continue;
    }

    const outputPath = path.join(PHOTO_DIR, `${baseName}.jpeg`);
    await convertToJpeg(filePath, outputPath);
    convertedToJpeg += 1;
  }

  return { convertedToSiblingJpeg, convertedToJpeg };
};

const normalizeJpgFiles = async (fileNames) => {
  let convertedJpgToJpeg = 0;

  for (const fileName of fileNames) {
    const extension = path.extname(fileName).toLowerCase();
    if (extension !== ".jpg") continue;

    const baseName = path.basename(fileName, path.extname(fileName));
    const inputPath = path.join(PHOTO_DIR, fileName);
    const outputPath = path.join(PHOTO_DIR, `${baseName}.jpeg`);

    await convertToJpeg(inputPath, outputPath);
    convertedJpgToJpeg += 1;
  }

  return { convertedJpgToJpeg };
};

const generateManifest = async () => {
  await mkdir(PHOTO_DIR, { recursive: true });

  const initialEntries = await readdir(PHOTO_DIR, { withFileTypes: true });
  const initialFileNames = initialEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith("."))
    .filter((name) => !name.startsWith("manifest."));

  const { convertedToSiblingJpeg, convertedToJpeg } = await normalizeHeifFiles(initialFileNames);
  const { convertedJpgToJpeg } = await normalizeJpgFiles(initialFileNames);

  const entries = await readdir(PHOTO_DIR, { withFileTypes: true });
  const candidateNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => WEB_IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()));

  const photos = [];
  const skipped = [];
  for (const fileName of candidateNames) {
    const filePath = path.join(PHOTO_DIR, fileName);
    const description = await getFileDescription(filePath);
    if (isHeifDescription(description)) {
      skipped.push({ fileName, reason: "heif_content" });
      continue;
    }

    const size = await getImageSize(filePath);
    if (!size) {
      skipped.push({ fileName, reason: "unreadable_image" });
      continue;
    }

    photos.push({
      src: `${PUBLIC_PREFIX}/${encodePathSegment(fileName)}`,
      alt: toAlt(fileName),
      width: size.width,
      height: size.height
    });
  }

  photos.sort((a, b) =>
    a.src.localeCompare(b.src, undefined, { numeric: true, sensitivity: "base" })
  );

  await writeFile(MANIFEST_PATH, `${JSON.stringify(photos, null, 2)}\n`, "utf8");
  await writeFile(SKIPPED_MANIFEST_PATH, `${JSON.stringify(skipped, null, 2)}\n`, "utf8");
  console.log(
    `Generated ${photos.length} outdoor photo entries at ${MANIFEST_PATH}`
      + ` (converted sibling jpeg: ${convertedToSiblingJpeg}, converted from heic/heif: ${convertedToJpeg}, converted .jpg to .jpeg: ${convertedJpgToJpeg}, skipped: ${skipped.length})`
  );
};

generateManifest().catch((error) => {
  console.error("Failed to generate outdoor photo manifest", error);
  process.exitCode = 1;
});
