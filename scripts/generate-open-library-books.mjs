import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OPEN_LIBRARY_ROOT = "https://openlibrary.org";
const USERNAME =
  process.env.NEXT_PUBLIC_OPEN_LIBRARY_USERNAME?.trim() ||
  process.env.OPEN_LIBRARY_USERNAME?.trim() ||
  "george3d";
const OUTPUT_PATH = path.join(
  process.cwd(),
  "components",
  "personal",
  "open-library-books.generated.json"
);
const REQUEST_HEADERS = {
  Accept: "text/html,application/xhtml+xml",
  "User-Agent": "personal-website/1.0 (personal-website@example.com)"
};

const SHELVES = [
  {
    key: "currently-reading",
    slug: "currently-reading"
  },
  {
    key: "read",
    slug: "already-read"
  }
];

const HTML_ENTITIES = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["lt", "<"],
  ["nbsp", " "],
  ["quot", "\""],
  ["#39", "'"]
]);

const decodeHtml = (value) =>
  value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, rawName) => {
    const name = rawName.toLowerCase();
    if (name.startsWith("#x")) {
      return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
    }
    if (name.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(name.slice(1), 10));
    }
    return HTML_ENTITIES.get(name) ?? entity;
  });

const stripTags = (value) => decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());

const normalizeOpenLibraryUrl = (value) => {
  const decoded = decodeHtml(value.trim());
  if (decoded.startsWith("//")) return `https:${decoded}`;
  if (decoded.startsWith("/")) return `${OPEN_LIBRARY_ROOT}${decoded}`;
  return decoded;
};

const getShelfUrl = (slug, page) => {
  const url = new URL(`/people/${encodeURIComponent(USERNAME)}/books/${slug}`, OPEN_LIBRARY_ROOT);
  if (page > 1) url.searchParams.set("page", String(page));
  return url.toString();
};

const fetchShelfHtml = async (slug, page) => {
  const url = getShelfUrl(slug, page);
  const response = await fetch(url, { headers: REQUEST_HEADERS });
  if (!response.ok) {
    throw new Error(`Open Library returned ${response.status} for ${url}`);
  }
  return response.text();
};

const parseTotalPages = (html) => {
  const match = html.match(/<ol-pagination\b[^>]*\btotal-pages="(\d+)"/i);
  return match ? Number(match[1]) : 1;
};

const parseTotalCount = (html, fallback) => {
  const titleMatch = html.match(/<title>[^<(]*\(([\d,]+)\)\s*\|\s*Open Library<\/title>/i);
  if (titleMatch) return Number(titleMatch[1].replaceAll(",", ""));

  const headingMatch = html.match(/<h2[^>]*class="breadcrumb-title"[^>]*>[^<(]*\(([\d,]+)\)<\/h2>/i);
  if (headingMatch) return Number(headingMatch[1].replaceAll(",", ""));

  return fallback;
};

const parseAuthors = (html) => {
  const authorContainer = html.match(/<span[^>]*class="[^"]*\bbookauthor\b[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
  if (!authorContainer) return [];

  const authors = [...authorContainer[1].matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);

  if (authors.length > 0) return authors;

  const fallback = stripTags(authorContainer[1]).replace(/^by\s+/i, "").trim();
  return fallback ? [fallback] : [];
};

const parseBookItem = (html, readOrder) => {
  const titleMatch = html.match(
    /<h3[^>]*class="[^"]*\bbooktitle\b[^"]*"[^>]*>[\s\S]*?<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i
  );
  if (!titleMatch) return null;

  const href = decodeHtml(titleMatch[1]);
  const workKey = href.match(/^(\/works\/[^/?#]+)/)?.[1] ?? href;
  const coverMatch = html.match(/<img\b[^>]*\bitemprop="image"[^>]*\bsrc="([^"]+)"/i);
  const publishYearMatch = html.match(/First published in\s*(\d{3,4})/i);

  return {
    key: workKey,
    href,
    title: stripTags(titleMatch[2]),
    authors: parseAuthors(html),
    coverUrl: coverMatch ? normalizeOpenLibraryUrl(coverMatch[1]) : null,
    firstPublishYear: publishYearMatch ? Number(publishYearMatch[1]) : null,
    readAt: null,
    readOrder
  };
};

const parseBooks = (html, startingReadOrder) => {
  const items = html.match(/<li class="searchResultItem[\s\S]*?<\/li>/g) ?? [];

  return items
    .map((item, index) => parseBookItem(item, startingReadOrder + index))
    .filter(Boolean);
};

const fetchShelf = async ({ key, slug }) => {
  const firstPageHtml = await fetchShelfHtml(slug, 1);
  const totalPages = parseTotalPages(firstPageHtml);
  const books = parseBooks(firstPageHtml, 0);

  for (let page = 2; page <= totalPages; page += 1) {
    const pageHtml = await fetchShelfHtml(slug, page);
    books.push(...parseBooks(pageHtml, books.length));
  }

  return [
    key,
    {
      books,
      totalCount: parseTotalCount(firstPageHtml, books.length)
    }
  ];
};

const readExistingManifest = async () => {
  try {
    const rawManifest = await readFile(OUTPUT_PATH, "utf8");
    return JSON.parse(rawManifest);
  } catch {
    return null;
  }
};

const hasReusableExistingManifest = (manifest) => {
  if (!manifest || typeof manifest !== "object") return false;
  if (typeof manifest.generatedAt !== "string") return false;
  if (!manifest.shelves || typeof manifest.shelves !== "object") return false;

  return SHELVES.some(({ key }) => {
    const shelf = manifest.shelves[key];
    return shelf && Array.isArray(shelf.books) && shelf.books.length > 0;
  });
};

const generateOpenLibraryBooks = async () => {
  if (!USERNAME) {
    throw new Error("Set NEXT_PUBLIC_OPEN_LIBRARY_USERNAME or OPEN_LIBRARY_USERNAME.");
  }

  let shelfEntries;
  try {
    shelfEntries = await Promise.all(SHELVES.map((shelf) => fetchShelf(shelf)));
  } catch (error) {
    const existingManifest = await readExistingManifest();
    if (!hasReusableExistingManifest(existingManifest)) throw error;

    console.warn("Failed to refresh Open Library books; keeping the existing generated manifest.");
    console.warn(error);
    return;
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    username: USERNAME,
    shelves: Object.fromEntries(shelfEntries)
  };

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const countSummary = shelfEntries
    .map(([key, shelf]) => `${key}: ${shelf.books.length}/${shelf.totalCount}`)
    .join(", ");
  console.log(`Generated Open Library books at ${OUTPUT_PATH} (${countSummary})`);
};

generateOpenLibraryBooks().catch((error) => {
  console.error("Failed to generate Open Library books", error);
  process.exitCode = 1;
});
