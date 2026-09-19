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
  Accept: "application/json,text/html,application/xhtml+xml",
  "User-Agent": "personal-website/1.0 (personal-website@example.com)"
};
const SEARCH_BATCH_SIZE = 40;
const MAX_FETCH_ATTEMPTS = 3;

// These catalog records have verified English titles and covers, but Open Library omits their
// language field. Keeping the exceptions explicit prevents an arbitrary translated edition from
// replacing them during a later shelf refresh.
const ENGLISH_EDITION_OVERRIDES = new Map([
  ["/works/OL17362758W", { editionKey: "/books/OL25940955M", coverId: 13048107 }],
  ["/works/OL17381975W", { editionKey: "/books/OL25961562M", coverId: 7466856 }],
  ["/works/OL7982451W", { editionKey: "/books/OL7358557M", coverId: 107192 }],
  ["/works/OL16806525W", { editionKey: "/books/OL25430345M", coverId: 7261361 }]
]);

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

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const fetchOpenLibrary = async (url) => {
  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt += 1) {
    let response;
    try {
      response = await fetch(url, { headers: REQUEST_HEADERS });
    } catch (error) {
      if (attempt === MAX_FETCH_ATTEMPTS) throw error;
      await wait(500 * 2 ** (attempt - 1));
      continue;
    }

    if (response.ok) return response;

    const canRetry = response.status === 429 || response.status >= 500;
    if (!canRetry || attempt === MAX_FETCH_ATTEMPTS) {
      throw new Error(`Open Library returned ${response.status} for ${url}`);
    }

    await wait(500 * 2 ** (attempt - 1));
  }

  throw new Error(`Open Library did not return a response for ${url}`);
};

const fetchHtml = async (url) => (await fetchOpenLibrary(url)).text();

const fetchJson = async (url) => (await fetchOpenLibrary(url)).json();

const getShelfUrl = (slug, page) => {
  const url = new URL(`/people/${encodeURIComponent(USERNAME)}/books/${slug}`, OPEN_LIBRARY_ROOT);
  if (page > 1) url.searchParams.set("page", String(page));
  return url.toString();
};

const fetchShelfHtml = async (slug, page) => {
  const url = getShelfUrl(slug, page);
  return fetchHtml(url);
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
  const publishYearMatch = html.match(/First published in\s*(\d{3,4})/i);

  return {
    key: workKey,
    href,
    title: stripTags(titleMatch[2]),
    authors: parseAuthors(html),
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

const getEnglishEditionSearchUrl = (workKeys) => {
  const quotedWorkKeys = workKeys.map((key) => JSON.stringify(key)).join(" OR ");
  const url = new URL("/search.json", OPEN_LIBRARY_ROOT);
  url.searchParams.set("q", `key:(${quotedWorkKeys}) AND language:eng`);
  url.searchParams.set(
    "fields",
    "key,editions,editions.key,editions.cover_i,editions.language"
  );
  url.searchParams.set("lang", "en");
  url.searchParams.set("limit", String(workKeys.length));
  return url.toString();
};

const getEnglishEditionSelection = (document) => {
  const edition = document.editions?.docs?.find(
    (candidate) =>
      candidate.language?.includes("eng") &&
      Number.isInteger(candidate.cover_i) &&
      candidate.cover_i > 0
  );
  if (!edition) return null;

  return {
    coverUrl: `https://covers.openlibrary.org/b/id/${edition.cover_i}-M.jpg`,
    editionKey: edition.key
  };
};

const getWorkEditionsUrl = (workKey) => {
  const workId = workKey.match(/^\/works\/(OL\d+W)$/)?.[1];
  if (!workId) throw new Error(`Invalid Open Library work key: ${workKey}`);

  const url = new URL(`/works/${workId}/editions.json`, OPEN_LIBRARY_ROOT);
  url.searchParams.set("limit", "1000");
  return url.toString();
};

const getEnglishEditionRecordSelection = (edition) => {
  const isEnglish = edition.languages?.some(
    (language) => language.key === "/languages/eng"
  );
  const coverId = edition.covers?.find((candidate) => Number.isInteger(candidate) && candidate > 0);
  if (!isEnglish || !coverId || typeof edition.key !== "string") return null;

  return {
    coverUrl: `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`,
    editionKey: edition.key
  };
};

const fetchEnglishEditionSelections = async (workKeys) => {
  const selectionByWorkKey = new Map();

  for (let index = 0; index < workKeys.length; index += SEARCH_BATCH_SIZE) {
    const batch = workKeys.slice(index, index + SEARCH_BATCH_SIZE);
    const response = await fetchJson(getEnglishEditionSearchUrl(batch));

    for (const document of response.docs ?? []) {
      const selection = getEnglishEditionSelection(document);
      if (selection) selectionByWorkKey.set(document.key, selection);
    }
  }

  const searchMisses = workKeys.filter((key) => !selectionByWorkKey.has(key));
  for (const workKey of searchMisses) {
    const response = await fetchJson(getWorkEditionsUrl(workKey));
    const selection = response.entries
      ?.map(getEnglishEditionRecordSelection)
      .find(Boolean);
    if (selection) selectionByWorkKey.set(workKey, selection);
  }

  for (const [workKey, override] of ENGLISH_EDITION_OVERRIDES) {
    if (!workKeys.includes(workKey) || selectionByWorkKey.has(workKey)) continue;
    selectionByWorkKey.set(workKey, {
      coverUrl: `https://covers.openlibrary.org/b/id/${override.coverId}-M.jpg`,
      editionKey: override.editionKey
    });
  }

  return selectionByWorkKey;
};

const setEditionHref = (href, editionKey) => {
  const url = new URL(href, OPEN_LIBRARY_ROOT);
  url.searchParams.set("edition", `key:${editionKey}`);
  return `${url.pathname}${url.search}`;
};

const resolveEnglishEditions = async (shelfEntries) => {
  const books = shelfEntries.flatMap(([, shelf]) => shelf.books);
  const workKeys = [...new Set(books.map((book) => book.key))];
  const selectionByWorkKey = await fetchEnglishEditionSelections(workKeys);
  const missingWorkKeys = workKeys.filter((key) => !selectionByWorkKey.has(key));
  if (missingWorkKeys.length > 0) {
    throw new Error(
      `Could not find an English edition with a cover for: ${missingWorkKeys.join(", ")}`
    );
  }

  return shelfEntries.map(([key, shelf]) => [
    key,
    {
      ...shelf,
      books: shelf.books.map((book) => {
        const selection = selectionByWorkKey.get(book.key);
        return {
          ...book,
          href: setEditionHref(book.href, selection.editionKey),
          coverUrl: selection.coverUrl
        };
      })
    }
  ]);
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
    shelfEntries = await resolveEnglishEditions(shelfEntries);
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
