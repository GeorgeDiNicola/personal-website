"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import openLibraryBooksManifest from "@/components/personal/open-library-books.generated.json";
import { SectionCard } from "@/components/personal/SectionCard";

const OPEN_LIBRARY_API_ROOT = "https://openlibrary.org";
const OPEN_LIBRARY_PLACEHOLDER_COVER_SRC = "/images/open-library-cover-placeholder.svg";
const OPEN_LIBRARY_INITIAL_PAGE_SIZE = 24;

const OPEN_LIBRARY_SHELVES = [
  {
    key: "currently-reading",
    title: "Currently Reading",
    emptyMessage: "No books are in your current shelf."
  },
  {
    key: "read",
    title: "Read",
    emptyMessage: "No finished books are available right now."
  }
] as const;

type OpenLibraryShelfKey = (typeof OPEN_LIBRARY_SHELVES)[number]["key"];

type OpenLibraryBook = {
  key: string;
  href: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishYear: number | null;
  readAt: number | null;
  readOrder: number;
};

type OpenLibraryShelfManifest = {
  books: OpenLibraryBook[];
  totalCount: number;
};

type OpenLibraryBooksManifest = {
  generatedAt: string | null;
  username: string;
  shelves: Record<OpenLibraryShelfKey, OpenLibraryShelfManifest>;
};

type OpenLibraryVisibleCounts = Record<OpenLibraryShelfKey, number>;

type OpenLibraryBooksSectionProps = {
  isDark: boolean;
  username: string;
  limitPerShelf?: number;
};

const manifest = openLibraryBooksManifest as OpenLibraryBooksManifest;

const createInitialVisibleCounts = (limitPerShelf: number): OpenLibraryVisibleCounts => ({
  "currently-reading": Math.min(
    limitPerShelf,
    manifest.shelves["currently-reading"].books.length
  ),
  read: Math.min(limitPerShelf, manifest.shelves.read.books.length)
});

const toAbsoluteOpenLibraryUrl = (url: string): string =>
  url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${OPEN_LIBRARY_API_ROOT}${url}`;

const getDisplayBookCount = (shelf: OpenLibraryShelfManifest): number =>
  shelf.totalCount > 0 ? shelf.totalCount : shelf.books.length;

export function OpenLibraryBooksSection({
  isDark,
  username,
  limitPerShelf = OPEN_LIBRARY_INITIAL_PAGE_SIZE
}: OpenLibraryBooksSectionProps) {
  const [visibleCounts, setVisibleCounts] = useState<OpenLibraryVisibleCounts>(() =>
    createInitialVisibleCounts(limitPerShelf)
  );
  const [fallbackCoverKeys, setFallbackCoverKeys] = useState<Record<string, true>>({});

  const normalizedUsername = username.trim();
  const manifestUsername = manifest.username.trim();
  const usernameMismatch =
    normalizedUsername.length > 0 && manifestUsername.length > 0 && normalizedUsername !== manifestUsername;

  const totalBooks = useMemo(
    () =>
      OPEN_LIBRARY_SHELVES.reduce(
        (count, shelf) => count + manifest.shelves[shelf.key].books.length,
        0
      ),
    []
  );

  const handleLoadMore = (shelfKey: OpenLibraryShelfKey) => {
    setVisibleCounts((current) => ({
      ...current,
      [shelfKey]: Math.min(
        current[shelfKey] + limitPerShelf,
        manifest.shelves[shelfKey].books.length
      )
    }));
  };

  return (
    <SectionCard
      id="open-library-books"
      title="Reading Log"
      subtitle=""
      isDark={isDark}
    >
      <div className="space-y-6">
        {usernameMismatch && process.env.NODE_ENV === 'development' ? (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              isDark
                ? "border-amber-700/70 bg-amber-900/20 text-amber-200"
                : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            The generated Open Library data is for {manifestUsername}, but this page is configured
            for {normalizedUsername}. Run the prebuild step again to refresh the book manifest.
          </div>
        ) : null}

        {totalBooks === 0 ? (
          <div
            className={`rounded-2xl border border-dashed p-5 text-sm ${
              isDark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-700"
            }`}
          >
            No generated Open Library books are available yet.
          </div>
        ) : null}

        {OPEN_LIBRARY_SHELVES.map(({ key, title, emptyMessage }) => {
          const shelf = manifest.shelves[key];
          const visibleCount = visibleCounts[key];
          const books = shelf.books.slice(0, visibleCount);
          const displayBookCount = getDisplayBookCount(shelf);
          const hasMore = visibleCount < shelf.books.length;

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
                    const cardKey = `${key}:${book.key}:${book.readOrder}`;
                    const coverSrc =
                      book.coverUrl && !fallbackCoverKeys[cardKey]
                        ? book.coverUrl
                        : OPEN_LIBRARY_PLACEHOLDER_COVER_SRC;

                    return (
                      <li key={cardKey}>
                        <a
                          href={toAbsoluteOpenLibraryUrl(book.href)}
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

              {hasMore ? (
                <div className="flex justify-center pt-6 md:pt-8">
                  <button
                    type="button"
                    onClick={() => handleLoadMore(key)}
                    className={`min-w-40 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors ${
                      isDark
                        ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Load More
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
