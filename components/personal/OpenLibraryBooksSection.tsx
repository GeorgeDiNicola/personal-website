"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { SectionCard } from "@/components/personal/SectionCard";

const OPEN_LIBRARY_API_ROOT = "https://openlibrary.org";
const OPEN_LIBRARY_CACHE_TTL_MS = 1000 * 60 * 30;
const OPEN_LIBRARY_PLACEHOLDER_COVER_SRC = "/images/open-library-cover-placeholder.svg";
const OPEN_LIBRARY_INITIAL_PAGE_SIZE = 24;
const OPEN_LIBRARY_MAX_TOTAL_COUNT_PAGES = 400;

const OPEN_LIBRARY_SHELVES = [
  {
    key: "currently-reading",
    apiShelf: "currently-reading",
    title: "Currently Reading",
    emptyMessage: "No books are in your current shelf."
  },
  {
    key: "read",
    apiShelf: "already-read",
    title: "Read",
    emptyMessage: "No finished books are available right now."
  }
] as const;

type OpenLibraryShelfKey = (typeof OPEN_LIBRARY_SHELVES)[number]["key"];
type OpenLibraryApiShelf = (typeof OPEN_LIBRARY_SHELVES)[number]["apiShelf"];

type OpenLibraryBook = {
  key: string;
  title: string;
  authors: string[];
  coverId: number | null;
  firstPublishYear: number | null;
  readAt: number | null;
  readOrder: number;
};

type OpenLibraryShelfState = {
  books: OpenLibraryBook[];
  nextPageUrl: string | null;
  nextPageNumber: number;
  hasMore: boolean;
  totalCount: number;
};

type OpenLibraryShelfStates = Record<OpenLibraryShelfKey, OpenLibraryShelfState>;
type OpenLibraryLoadMoreState = Record<OpenLibraryShelfKey, boolean>;
type OpenLibraryShelfErrors = Record<OpenLibraryShelfKey, string | null>;

type OpenLibraryBooksCachePayload = {
  expiresAt: number;
  shelfStates: OpenLibraryShelfStates;
};

type OpenLibraryBooksSectionProps = {
  isDark: boolean;
  username: string;
  limitPerShelf?: number;
};

type OpenLibraryReadingLogResponse = {
  reading_log_entries?: unknown;
  links?: unknown;
  page?: unknown;
  num_found?: unknown;
};

type OpenLibraryReadingLogEntry = {
  work?: unknown;
};

type OpenLibraryWork = {
  key?: unknown;
  title?: unknown;
  author_names?: unknown;
  authors?: unknown;
  cover_id?: unknown;
  first_publish_year?: unknown;
};

const openLibraryBooksMemoryCache = new Map<string, OpenLibraryBooksCachePayload>();

const createEmptyShelfStates = (): OpenLibraryShelfStates => ({
  "currently-reading": {
    books: [],
    nextPageUrl: null,
    nextPageNumber: 2,
    hasMore: false,
    totalCount: 0
  },
  read: {
    books: [],
    nextPageUrl: null,
    nextPageNumber: 2,
    hasMore: false,
    totalCount: 0
  }
});

const createInitialLoadMoreState = (): OpenLibraryLoadMoreState => ({
  "currently-reading": false,
  read: false
});

const createInitialShelfErrors = (): OpenLibraryShelfErrors => ({
  "currently-reading": null,
  read: null
});

const openLibraryCacheKey = (username: string, pageSize: number) =>
  `open-library-reading-log:v6:${username}:${pageSize}`;

const isOpenLibraryShelfState = (value: unknown): value is OpenLibraryShelfState => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as {
    books?: unknown;
    nextPageUrl?: unknown;
    nextPageNumber?: unknown;
    hasMore?: unknown;
    totalCount?: unknown;
  };

  const validNextPageUrl =
    candidate.nextPageUrl === null || typeof candidate.nextPageUrl === "string";

  return (
    Array.isArray(candidate.books) &&
    validNextPageUrl &&
    typeof candidate.nextPageNumber === "number" &&
    Number.isFinite(candidate.nextPageNumber) &&
    typeof candidate.hasMore === "boolean" &&
    typeof candidate.totalCount === "number" &&
    Number.isFinite(candidate.totalCount)
  );
};

const isOpenLibraryShelfStates = (value: unknown): value is OpenLibraryShelfStates => {
  if (!value || typeof value !== "object") return false;

  return OPEN_LIBRARY_SHELVES.every(({ key }) =>
    isOpenLibraryShelfState((value as Record<string, unknown>)[key])
  );
};

const readCachedShelfStates = (cacheKey: string): OpenLibraryShelfStates | null => {
  const now = Date.now();

  const memoryEntry = openLibraryBooksMemoryCache.get(cacheKey);
  if (memoryEntry) {
    if (memoryEntry.expiresAt > now) return memoryEntry.shelfStates;
    openLibraryBooksMemoryCache.delete(cacheKey);
  }

  if (typeof window === "undefined") return null;

  try {
    const rawCached = window.localStorage.getItem(cacheKey);
    if (!rawCached) return null;

    const parsed = JSON.parse(rawCached) as Partial<OpenLibraryBooksCachePayload>;
    if (
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= now ||
      !isOpenLibraryShelfStates(parsed.shelfStates)
    ) {
      window.localStorage.removeItem(cacheKey);
      return null;
    }

    const validPayload: OpenLibraryBooksCachePayload = {
      expiresAt: parsed.expiresAt,
      shelfStates: parsed.shelfStates
    };

    openLibraryBooksMemoryCache.set(cacheKey, validPayload);
    return validPayload.shelfStates;
  } catch {
    return null;
  }
};

const writeCachedShelfStates = (cacheKey: string, shelfStates: OpenLibraryShelfStates) => {
  const payload: OpenLibraryBooksCachePayload = {
    expiresAt: Date.now() + OPEN_LIBRARY_CACHE_TTL_MS,
    shelfStates
  };

  openLibraryBooksMemoryCache.set(cacheKey, payload);

  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch {
    // Ignore write failures from browser privacy/storage restrictions.
  }
};

const getWorkAuthors = (work: OpenLibraryWork): string[] => {
  if (Array.isArray(work.author_names)) {
    const names = work.author_names.filter((name): name is string => typeof name === "string");
    if (names.length > 0) return names;
  }

  if (!Array.isArray(work.authors)) return [];

  return work.authors
    .map((author) => {
      if (!author || typeof author !== "object") return null;
      const name = (author as { name?: unknown }).name;
      return typeof name === "string" ? name : null;
    })
    .filter((name): name is string => Boolean(name));
};

const parseReadingLogEntry = (entry: unknown): OpenLibraryBook | null => {
  if (!entry || typeof entry !== "object") return null;

  const work = (entry as OpenLibraryReadingLogEntry).work;
  if (!work || typeof work !== "object") return null;

  const normalizedWork = work as OpenLibraryWork;
  if (typeof normalizedWork.key !== "string" || typeof normalizedWork.title !== "string") return null;

  const coverId =
    typeof normalizedWork.cover_id === "number" && Number.isFinite(normalizedWork.cover_id)
      ? normalizedWork.cover_id
      : null;
  const firstPublishYear =
    typeof normalizedWork.first_publish_year === "number" &&
    Number.isFinite(normalizedWork.first_publish_year)
      ? normalizedWork.first_publish_year
      : null;

  const normalizedEntry = entry as Record<string, unknown>;
  const readAt = parseOpenLibraryDate(normalizedEntry.logged_date);

  return {
    key: normalizedWork.key,
    title: normalizedWork.title,
    authors: getWorkAuthors(normalizedWork),
    coverId,
    firstPublishYear,
    readAt,
    readOrder: 0
  };
};

const sortReadBooksByDate = (books: OpenLibraryBook[]): OpenLibraryBook[] =>
  [...books].sort((a, b) => {
    if (a.readAt !== null && b.readAt !== null) {
      if (a.readAt !== b.readAt) return b.readAt - a.readAt;
      return b.readOrder - a.readOrder;
    }
    if (a.readAt === null && b.readAt === null) return b.readOrder - a.readOrder;
    if (a.readAt === null) return 1;
    return -1;
  });

const mergeBooksByKey = (
  shelfKey: OpenLibraryShelfKey,
  existingBooks: OpenLibraryBook[],
  newBooks: OpenLibraryBook[]
): OpenLibraryBook[] => {
  const byKey = new Map(existingBooks.map((book) => [book.key, book]));

  for (const book of newBooks) {
    byKey.set(book.key, book);
  }

  const merged = Array.from(byKey.values());
  return shelfKey === "read" ? sortReadBooksByDate(merged) : merged;
};

const toAbsoluteOpenLibraryUrl = (url: string): string =>
  url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${OPEN_LIBRARY_API_ROOT}${url}`;

const parseOpenLibraryDate = (value: unknown): number | null => {
  if (value && typeof value === "object") {
    const candidate = value as {
      value?: unknown;
      $date?: unknown;
      iso?: unknown;
      timestamp?: unknown;
      logged_date?: unknown;
      date?: unknown;
    };

    const nestedCandidates = [
      candidate.value,
      candidate.$date,
      candidate.iso,
      candidate.timestamp,
      candidate.logged_date,
      candidate.date
    ];

    for (const nested of nestedCandidates) {
      const parsedNested = parseOpenLibraryDate(nested);
      if (parsedNested !== null) return parsedNested;
    }

    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 1_000_000_000_000 ? value : value * 1000;
  }

  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  if (/^\d+$/.test(raw)) {
    const parsedInt = Number(raw);
    if (Number.isFinite(parsedInt)) {
      return parsedInt > 1_000_000_000_000 ? parsedInt : parsedInt * 1000;
    }
  }

  const nativeTimestamp = Date.parse(raw);
  if (!Number.isNaN(nativeTimestamp)) return nativeTimestamp;

  // Open Library often emits "YYYY/MM/DD, HH:mm:ss" for logged_date.
  const normalized = raw.replace(",", "");
  const match = normalized.match(
    /^(\d{4})(?:[-/](\d{1,2})(?:[-/](\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2] ?? "1");
  const day = Number(match[3] ?? "1");
  const hour = Number(match[4] ?? "0");
  const minute = Number(match[5] ?? "0");
  const second = Number(match[6] ?? "0");

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute) ||
    !Number.isFinite(second)
  ) {
    return null;
  }

  return Date.UTC(year, month - 1, day, hour, minute, second);
};

const buildPageUrl = (url: string, nextPageNumber: number, pageSize: number): string => {
  const nextUrl = new URL(url);
  nextUrl.searchParams.set("page", String(nextPageNumber));
  if (!nextUrl.searchParams.has("limit")) {
    nextUrl.searchParams.set("limit", String(pageSize));
  }
  return nextUrl.toString();
};

const getNextPageUrl = (payload: OpenLibraryReadingLogResponse): string | null => {
  if (!payload.links || typeof payload.links !== "object") return null;

  const next = (payload.links as { next?: unknown }).next;
  if (typeof next === "string" && next.trim()) return toAbsoluteOpenLibraryUrl(next);

  if (next && typeof next === "object") {
    const nextHref = (next as { href?: unknown; url?: unknown }).href ?? (next as { url?: unknown }).url;
    if (typeof nextHref === "string" && nextHref.trim()) return toAbsoluteOpenLibraryUrl(nextHref);
  }

  return null;
};

const parseNumFound = (payload: OpenLibraryReadingLogResponse): number | null =>
  typeof payload.num_found === "number" && Number.isFinite(payload.num_found)
    ? payload.num_found
    : null;

const countTotalByWalkingPages = async (
  initialNextPageUrl: string | null,
  initialCount: number,
  limitPerShelf: number,
  startPageNumber: number
): Promise<number> => {
  let runningTotal = initialCount;
  let nextPageUrl = initialNextPageUrl;
  let expectedPage = startPageNumber;
  let requests = 0;

  while (nextPageUrl && requests < OPEN_LIBRARY_MAX_TOTAL_COUNT_PAGES) {
    requests += 1;

    const response = await fetch(nextPageUrl, { headers: { Accept: "application/json" } });
    if (!response.ok) break;

    const payload = (await response.json()) as OpenLibraryReadingLogResponse;
    const totalFromPayload = parseNumFound(payload);
    if (totalFromPayload !== null) return totalFromPayload;

    const entries = Array.isArray(payload.reading_log_entries)
      ? payload.reading_log_entries
      : [];
    runningTotal += entries.length;

    const payloadPage =
      typeof payload.page === "number" && Number.isFinite(payload.page)
        ? payload.page
        : expectedPage;
    const nextFromLinks = getNextPageUrl(payload);

    if (nextFromLinks) {
      expectedPage = payloadPage + 1;
      nextPageUrl = nextFromLinks;
      continue;
    }

    if (entries.length < limitPerShelf) {
      nextPageUrl = null;
      continue;
    }

    expectedPage = payloadPage + 1;
    nextPageUrl = buildPageUrl(nextPageUrl, expectedPage, limitPerShelf);
  }

  return runningTotal;
};

const fetchShelfPage = async (
  pageUrl: string,
  shelfKey: OpenLibraryShelfKey,
  limitPerShelf: number,
  currentPage: number,
  knownTotalCount = 0
): Promise<OpenLibraryShelfState> => {
  const response = await fetch(pageUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Failed to load shelf ${shelfKey}: ${response.status}`);

  const payload = (await response.json()) as OpenLibraryReadingLogResponse;
  if (!Array.isArray(payload.reading_log_entries)) {
    return {
      books: [],
      nextPageUrl: null,
      nextPageNumber: currentPage + 1,
      hasMore: false,
      totalCount: knownTotalCount
    };
  }

  let books = payload.reading_log_entries
    .map((entry, index) => {
      const parsed = parseReadingLogEntry(entry);
      if (!parsed) return null;

      // Preserve API order as deterministic tie-breaker for missing/equal read dates.
      return {
        ...parsed,
        readOrder: (currentPage - 1) * limitPerShelf + index
      };
    })
    .filter((book): book is OpenLibraryBook => Boolean(book));

  if (shelfKey === "read") {
    books = sortReadBooksByDate(books);
  }

  const rawCount = payload.reading_log_entries.length;
  const parsedPage =
    typeof payload.page === "number" && Number.isFinite(payload.page) ? payload.page : currentPage;
  const parsedNumFound = parseNumFound(payload);

  const nextPageNumber = parsedPage + 1;
  const nextPageUrl =
    getNextPageUrl(payload) ??
    buildPageUrl(pageUrl, nextPageNumber, limitPerShelf);
  const hasMore =
    (parsedNumFound !== null ? parsedPage * limitPerShelf < parsedNumFound : false) ||
    rawCount === limitPerShelf;

  let totalCount = knownTotalCount;
  if (parsedNumFound !== null) {
    totalCount = parsedNumFound;
  } else if (totalCount <= 0) {
    const loadedSoFar = (parsedPage - 1) * limitPerShelf + rawCount;
    totalCount = hasMore
      ? await countTotalByWalkingPages(nextPageUrl, loadedSoFar, limitPerShelf, nextPageNumber)
      : loadedSoFar;
  }

  return {
    books,
    nextPageUrl,
    nextPageNumber,
    hasMore,
    totalCount
  };
};

const buildInitialShelfUrl = (
  username: string,
  shelf: OpenLibraryApiShelf,
  limitPerShelf: number
): string =>
  `${OPEN_LIBRARY_API_ROOT}/people/${encodeURIComponent(username)}/books/${shelf}.json?limit=${limitPerShelf}`;

const getCoverUrl = (coverId: number) => `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

export function OpenLibraryBooksSection({
  isDark,
  username,
  limitPerShelf = OPEN_LIBRARY_INITIAL_PAGE_SIZE
}: OpenLibraryBooksSectionProps) {
  const [shelfStates, setShelfStates] = useState<OpenLibraryShelfStates>(createEmptyShelfStates);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fallbackCoverKeys, setFallbackCoverKeys] = useState<Record<string, true>>({});
  const [loadingMoreByShelf, setLoadingMoreByShelf] = useState<OpenLibraryLoadMoreState>(
    createInitialLoadMoreState
  );
  const [shelfErrors, setShelfErrors] = useState<OpenLibraryShelfErrors>(createInitialShelfErrors);

  const normalizedUsername = username.trim();
  const cacheKey = useMemo(
    () =>
      normalizedUsername
        ? openLibraryCacheKey(normalizedUsername, limitPerShelf)
        : null,
    [limitPerShelf, normalizedUsername]
  );

  useEffect(() => {
    let isCancelled = false;

    const loadBooks = async () => {
      if (!normalizedUsername) {
        if (isCancelled) return;
        setShelfStates(createEmptyShelfStates());
        setErrorMessage("Set an Open Library username to load reading shelves.");
        setIsLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        for (const key of Object.keys(window.localStorage)) {
          if (key.startsWith("open-library-reading-log:") && key !== cacheKey) {
            window.localStorage.removeItem(key);
          }
        }
      }

      const cached = cacheKey ? readCachedShelfStates(cacheKey) : null;
      if (cached) {
        if (isCancelled) return;
        setShelfStates(cached);
        setIsLoading(false);
        setErrorMessage(null);
        setShelfErrors(createInitialShelfErrors());
        return;
      }

      if (!isCancelled) {
        setIsLoading(true);
      }

      try {
        setErrorMessage(null);
        setShelfErrors(createInitialShelfErrors());

        const shelfPairs = await Promise.all(
          OPEN_LIBRARY_SHELVES.map(async ({ key, apiShelf }) => {
            const firstPageUrl = buildInitialShelfUrl(normalizedUsername, apiShelf, limitPerShelf);
            const shelfState = await fetchShelfPage(firstPageUrl, key, limitPerShelf, 1);
            return [key, shelfState] as const;
          })
        );

        if (isCancelled) return;

        const nextShelfStates = createEmptyShelfStates();
        for (const [shelfKey, shelfState] of shelfPairs) {
          nextShelfStates[shelfKey] = shelfState;
        }

        setShelfStates(nextShelfStates);
        setIsLoading(false);
      } catch {
        if (isCancelled) return;

        setIsLoading(false);
        setErrorMessage("Could not load books from Open Library right now. Please try again.");
      }
    };

    void loadBooks();

    return () => {
      isCancelled = true;
    };
  }, [cacheKey, limitPerShelf, normalizedUsername]);

  useEffect(() => {
    if (!cacheKey || isLoading) return;
    writeCachedShelfStates(cacheKey, shelfStates);
  }, [cacheKey, isLoading, shelfStates]);

  const handleLoadMore = useCallback(
    async (shelfKey: OpenLibraryShelfKey) => {
      if (!normalizedUsername) return;

      const currentShelfState = shelfStates[shelfKey];
      if (!currentShelfState.hasMore || loadingMoreByShelf[shelfKey]) return;

      setLoadingMoreByShelf((current) => ({
        ...current,
        [shelfKey]: true
      }));
      setShelfErrors((current) => ({
        ...current,
        [shelfKey]: null
      }));

      try {
        const shelfConfig = OPEN_LIBRARY_SHELVES.find((shelf) => shelf.key === shelfKey);
        if (!shelfConfig) return;

        const fallbackPageUrl = buildInitialShelfUrl(
          normalizedUsername,
          shelfConfig.apiShelf,
          limitPerShelf
        );
        const nextPageUrl =
          currentShelfState.nextPageUrl ??
          buildPageUrl(fallbackPageUrl, currentShelfState.nextPageNumber, limitPerShelf);
        const nextPage = await fetchShelfPage(
          nextPageUrl,
          shelfKey,
          limitPerShelf,
          currentShelfState.nextPageNumber,
          currentShelfState.totalCount
        );

        setShelfStates((current) => {
          const currentShelf = current[shelfKey];
          const mergedBooks = mergeBooksByKey(shelfKey, currentShelf.books, nextPage.books);

          return {
            ...current,
            [shelfKey]: {
              books: mergedBooks,
              nextPageUrl: nextPage.nextPageUrl,
              nextPageNumber: nextPage.nextPageNumber,
              hasMore: nextPage.hasMore,
              totalCount: nextPage.totalCount
            }
          };
        });
      } catch {
        setShelfErrors((current) => ({
          ...current,
          [shelfKey]: "Could not load more books right now."
        }));
      } finally {
        setLoadingMoreByShelf((current) => ({
          ...current,
          [shelfKey]: false
        }));
      }
    },
    [limitPerShelf, loadingMoreByShelf, normalizedUsername, shelfStates]
  );

  const totalBooks = useMemo(
    () =>
      OPEN_LIBRARY_SHELVES.reduce(
        (count, shelf) => count + shelfStates[shelf.key].books.length,
        0
      ),
    [shelfStates]
  );

  return (
    <SectionCard
      id="open-library-books"
      title="Reading Log"
      subtitle=""
      isDark={isDark}
    >
      <div className="space-y-6">

        {isLoading && totalBooks === 0 ? (
          <div
            className={`rounded-2xl border border-dashed p-5 text-sm ${
              isDark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-700"
            }`}
          >
            Loading shelves...
          </div>
        ) : null}

        {errorMessage ? (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              isDark
                ? "border-amber-700/70 bg-amber-900/20 text-amber-200"
                : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            {errorMessage}
          </div>
        ) : null}

        {OPEN_LIBRARY_SHELVES.map(({ key, title, emptyMessage }) => {
          const shelfState = shelfStates[key];
          const books = shelfState.books;
          const displayBookCount = shelfState.totalCount > 0 ? shelfState.totalCount : books.length;

          return (
            <section key={key} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold md:text-xl">{title}</h3>
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {displayBookCount} book{displayBookCount === 1 ? "" : "s"}
                </p>
              </div>

              {books.length > 0 ? (
                <ul className="open-library-3d-wrap grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {books.map((book) => {
                    const cardKey = `${key}:${book.key}`;
                    const coverId = book.coverId;
                    const coverSrc =
                      typeof coverId === "number" && !fallbackCoverKeys[cardKey]
                        ? getCoverUrl(coverId)
                        : OPEN_LIBRARY_PLACEHOLDER_COVER_SRC;

                    return (
                      <li key={cardKey}>
                        <a
                          href={`${OPEN_LIBRARY_API_ROOT}${book.key}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`open-library-book-card group block h-full rounded-2xl border p-2 ${
                            isDark
                              ? "border-slate-700 bg-slate-900/75 hover:border-cyan-300/60"
                              : "border-slate-300 bg-white/90 hover:border-cyan-600/60"
                          }`}
                        >
                          <div
                            className={`overflow-hidden rounded-xl border ${
                              isDark ? "border-slate-700" : "border-slate-200"
                            }`}
                          >
                            <div className="relative aspect-[2/3] w-full">
                              <Image
                                src={coverSrc}
                                alt={`${book.title} cover`}
                                fill
                                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                                loading="lazy"
                                unoptimized
                                className="open-library-book-cover object-cover"
                                onError={() =>
                                  setFallbackCoverKeys((current) => ({
                                    ...current,
                                    [cardKey]: true
                                  }))
                                }
                              />
                            </div>
                          </div>

                          <div className="open-library-book-meta mt-3 space-y-1">
                            <p className="overflow-hidden text-sm font-semibold leading-tight [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                              {book.title}
                            </p>
                            <p className={`truncate text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                              {book.authors.length > 0 ? book.authors.join(", ") : "Unknown author"}
                            </p>
                            {book.firstPublishYear ? (
                              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                First published {book.firstPublishYear}
                              </p>
                            ) : null}
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div
                  className={`rounded-xl border border-dashed p-4 text-sm ${
                    isDark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-700"
                  }`}
                >
                  {emptyMessage}
                </div>
              )}

              {shelfErrors[key] ? (
                <p className={`text-sm ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                  {shelfErrors[key]}
                </p>
              ) : null}

              {shelfState.hasMore ? (
                <div className="flex justify-center pt-6 md:pt-8">
                  <button
                    type="button"
                    onClick={() => {
                      void handleLoadMore(key);
                    }}
                    disabled={loadingMoreByShelf[key]}
                    className={`min-w-40 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                      isDark
                        ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {loadingMoreByShelf[key] ? "Loading..." : "Load More"}
                  </button>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </SectionCard>
  );
}
