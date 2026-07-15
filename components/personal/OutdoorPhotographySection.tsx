"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, TouchEvent as ReactTouchEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { SectionCard } from "@/components/personal/SectionCard";

type OutdoorPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const OUTDOOR_PHOTO_MANIFEST_PATH = "/images/outdoor-photography/manifest.json";

type OutdoorPhotographySectionProps = {
  isDark: boolean;
};

export function OutdoorPhotographySection({ isDark }: OutdoorPhotographySectionProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);
  const [outdoorPhotos, setOutdoorPhotos] = useState<OutdoorPhoto[]>([]);
  const lightboxCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const lightboxOpenButtonRef = useRef<HTMLButtonElement | null>(null);
  const lightboxThumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const lightboxThumbnailButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lightboxTouchStartXRef = useRef<number | null>(null);
  const lightboxTouchStartYRef = useRef<number | null>(null);
  const totalPhotos = outdoorPhotos.length;
  const normalizedPhotoIndex = totalPhotos > 0 ? activePhotoIndex % totalPhotos : 0;
  const activePhoto = outdoorPhotos[normalizedPhotoIndex];
  const canUseDocument = typeof document !== "undefined";

  useEffect(() => {
    let isCancelled = false;

    const loadOutdoorPhotos = async () => {
      try {
        const response = await fetch(OUTDOOR_PHOTO_MANIFEST_PATH, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load outdoor photo manifest");

        const payload = (await response.json()) as unknown;
        const photos = Array.isArray(payload)
          ? payload.filter((item): item is OutdoorPhoto => {
              if (!item || typeof item !== "object") return false;

              const candidate = item as {
                src?: unknown;
                alt?: unknown;
                width?: unknown;
                height?: unknown;
              };

              return (
                typeof candidate.src === "string" &&
                typeof candidate.alt === "string" &&
                typeof candidate.width === "number" &&
                Number.isFinite(candidate.width) &&
                candidate.width > 0 &&
                typeof candidate.height === "number" &&
                Number.isFinite(candidate.height) &&
                candidate.height > 0
              );
            })
          : [];

        if (!isCancelled) setOutdoorPhotos(photos);
      } catch {
        if (!isCancelled) setOutdoorPhotos([]);
      } finally {
        if (!isCancelled) setIsPhotosLoading(false);
      }
    };

    void loadOutdoorPhotos();

    return () => {
      isCancelled = true;
    };
  }, []);

  const closeLightbox = useCallback(() => {
    setIsPhotoLightboxOpen(false);
  }, []);

  const openLightbox = () => {
    setIsPhotoLightboxOpen(true);
  };

  const goToPreviousPhoto = () => {
    if (!totalPhotos) return;
    setActivePhotoIndex((index) => (index - 1 + totalPhotos) % totalPhotos);
  };

  const goToNextPhoto = () => {
    if (!totalPhotos) return;
    setActivePhotoIndex((index) => (index + 1) % totalPhotos);
  };

  const onCarouselKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPreviousPhoto();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNextPhoto();
    }
  };

  const onLightboxTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    lightboxTouchStartXRef.current = touch.clientX;
    lightboxTouchStartYRef.current = touch.clientY;
  };

  const onLightboxTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const startX = lightboxTouchStartXRef.current;
    const startY = lightboxTouchStartYRef.current;
    const touch = event.changedTouches[0];

    lightboxTouchStartXRef.current = null;
    lightboxTouchStartYRef.current = null;

    if (startX === null || startY === null || !touch) return;

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const minimumSwipeDistance = 48;

    if (Math.abs(deltaX) < minimumSwipeDistance || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX < 0) {
      goToNextPhoto();
      return;
    }

    goToPreviousPhoto();
  };

  useEffect(() => {
    if (!isPhotoLightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft" && totalPhotos > 0) {
        event.preventDefault();
        setActivePhotoIndex((index) => (index - 1 + totalPhotos) % totalPhotos);
      }
      if (event.key === "ArrowRight" && totalPhotos > 0) {
        event.preventDefault();
        setActivePhotoIndex((index) => (index + 1) % totalPhotos);
      }
    };

    const previousOverflow = document.body.style.overflow;
    const lightboxOpenButton = lightboxOpenButtonRef.current;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => lightboxCloseButtonRef.current?.focus());
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      lightboxOpenButton?.focus();
    };
  }, [closeLightbox, isPhotoLightboxOpen, totalPhotos]);

  useEffect(() => {
    if (!totalPhotos) return;

    const centerActiveThumbnail = (
      strip: HTMLDivElement | null,
      button: HTMLButtonElement | null
    ) => {
      if (!button || !strip) return;

      const targetLeft = button.offsetLeft
        - strip.clientWidth / 2
        + button.clientWidth / 2;

      strip.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth"
      });
    };

    centerActiveThumbnail(
      thumbnailStripRef.current,
      thumbnailButtonRefs.current[normalizedPhotoIndex] ?? null
    );
    centerActiveThumbnail(
      lightboxThumbnailStripRef.current,
      lightboxThumbnailButtonRefs.current[normalizedPhotoIndex] ?? null
    );
  }, [normalizedPhotoIndex, totalPhotos]);

  return (
    <SectionCard
      id="outdoor-photography"
      title="Outdoor Photography"
      isDark={isDark}
    >
      {isPhotosLoading ? (
        <div
          className="portfolio-inset border-dashed p-5 text-sm text-[var(--text-soft)]"
        >
          Loading photos...
        </div>
      ) : activePhoto ? (
        <div
          className="space-y-4"
          tabIndex={0}
          onKeyDown={onCarouselKeyDown}
          aria-label="Outdoor photo carousel"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="portfolio-panel-label site-text-static">
              Photo {normalizedPhotoIndex + 1} of {totalPhotos}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPhoto}
                aria-label="Previous photo"
                title="Previous photo"
                className="portfolio-control inline-flex h-9 w-9 items-center justify-center rounded-full"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={goToNextPhoto}
                aria-label="Next photo"
                title="Next photo"
                className="portfolio-control inline-flex h-9 w-9 items-center justify-center rounded-full"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <div className="portfolio-inset outdoor-photo-stage overflow-hidden">
            <button
              ref={lightboxOpenButtonRef}
              type="button"
              onClick={openLightbox}
              aria-label="Open larger photo"
              className="block w-full cursor-zoom-in"
            >
              <div className="relative aspect-[4/3] w-full md:aspect-[16/10]">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 70vw"
                  loading="lazy"
                  quality={100}
                  className="object-contain"
                />
              </div>
            </button>
          </div>

          {canUseDocument && isPhotoLightboxOpen ? createPortal(
            <div
              className="photo-lightbox fixed inset-0 z-[100]"
              role="dialog"
              aria-modal="true"
              aria-label="Expanded photo viewer"
              onClick={closeLightbox}
            >
              <button
                ref={lightboxCloseButtonRef}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  closeLightbox();
                }}
                aria-label="Close expanded photo"
                title="Close expanded photo"
                className="photo-lightbox-control photo-lightbox-close"
              >
                <CloseIcon />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPreviousPhoto();
                }}
                aria-label="Previous photo"
                title="Previous photo"
                className="photo-lightbox-control photo-lightbox-nav photo-lightbox-nav-previous"
              >
                <ChevronLeftIcon />
              </button>

              <div className="photo-lightbox-stage">
                <div
                  className="photo-lightbox-image-area"
                  onClick={(event) => event.stopPropagation()}
                  onTouchStart={onLightboxTouchStart}
                  onTouchEnd={onLightboxTouchEnd}
                >
                  <Image
                    src={activePhoto.src}
                    alt={activePhoto.alt}
                    fill
                    sizes="(max-width: 768px) 95vw, 90vw"
                    unoptimized
                    quality={100}
                    priority
                    className="object-contain"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNextPhoto();
                }}
                aria-label="Next photo"
                title="Next photo"
                className="photo-lightbox-control photo-lightbox-nav photo-lightbox-nav-next"
              >
                <ChevronRightIcon />
              </button>

              <div
                ref={lightboxThumbnailStripRef}
                className="photo-lightbox-thumbnails"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex w-max gap-2">
                  {outdoorPhotos.map((photo, index) => (
                    <button
                      key={`lightbox-${photo.src}`}
                      type="button"
                      ref={(element) => {
                        lightboxThumbnailButtonRefs.current[index] = element;
                      }}
                      onClick={() => setActivePhotoIndex(index)}
                      aria-label={`View photo ${index + 1}`}
                      className={`photo-lightbox-thumbnail ${
                        index === normalizedPhotoIndex ? "photo-lightbox-thumbnail-active" : ""
                      }`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="88px"
                        loading="lazy"
                        quality={100}
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>,
            document.body
          ) : null}

          <div ref={thumbnailStripRef} className="outdoor-thumbnail-strip overflow-x-auto pb-1">
            <div className="flex w-max gap-2.5 md:gap-3">
              {outdoorPhotos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  ref={(element) => {
                    thumbnailButtonRefs.current[index] = element;
                  }}
                  onClick={() => setActivePhotoIndex(index)}
                  aria-label={`View photo ${index + 1}`}
                  className={`outdoor-thumbnail-button relative h-16 w-24 overflow-hidden rounded-xl border bg-[var(--surface-inset)] transition-all duration-200 md:h-20 md:w-28 ${
                    index === normalizedPhotoIndex
                      ? isDark
                        ? "border-cyan-300 shadow-[0_0_0_3px_rgba(103,232,249,0.14)]"
                        : "border-cyan-700 shadow-[0_0_0_3px_rgba(14,116,144,0.12)]"
                      : isDark
                        ? "border-slate-700 hover:border-slate-500"
                        : "border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="112px"
                    loading="lazy"
                    quality={100}
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="portfolio-inset border-dashed p-5 text-sm text-[var(--text-soft)]"
        >
          <p className="font-semibold">Outdoor photo gallery placeholder</p>
          <p className="mt-2">
            Drop images into <code>public/images/outdoor-photography/</code>.
          </p>
          <p className="mt-2">
            The gallery auto-loads them from
            <code> /images/outdoor-photography/manifest.json</code>.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="m10 3.5-4.5 4.5 4.5 4.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="m6 3.5 4.5 4.5-4.5 4.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <path d="m4 4 8 8" />
      <path d="m12 4-8 8" />
    </svg>
  );
}
