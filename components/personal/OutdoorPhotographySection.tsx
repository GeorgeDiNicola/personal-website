"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { SectionCard } from "@/components/personal/SectionCard";

type OutdoorPhoto = {
  src: string;
  alt: string;
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
  const totalPhotos = outdoorPhotos.length;
  const normalizedPhotoIndex = totalPhotos > 0 ? activePhotoIndex % totalPhotos : 0;
  const activePhoto = outdoorPhotos[normalizedPhotoIndex];

  useEffect(() => {
    let isCancelled = false;

    const loadOutdoorPhotos = async () => {
      try {
        const response = await fetch(OUTDOOR_PHOTO_MANIFEST_PATH, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load outdoor photo manifest");

        const payload = (await response.json()) as unknown;
        const photos = Array.isArray(payload)
          ? payload.filter(
              (item): item is OutdoorPhoto =>
                Boolean(
                  item &&
                  typeof item === "object" &&
                  "src" in item &&
                  "alt" in item &&
                  typeof (item as { src: unknown }).src === "string" &&
                  typeof (item as { alt: unknown }).alt === "string"
                )
            )
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

  const goToPreviousPhoto = () => {
    if (!totalPhotos) return;
    setActivePhotoIndex((index) => (index - 1 + totalPhotos) % totalPhotos);
  };

  const goToNextPhoto = () => {
    if (!totalPhotos) return;
    setActivePhotoIndex((index) => (index + 1) % totalPhotos);
  };

  useEffect(() => {
    if (!isPhotoLightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPhotoLightboxOpen(false);
      if (event.key === "ArrowLeft" && totalPhotos > 0) {
        setActivePhotoIndex((index) => (index - 1 + totalPhotos) % totalPhotos);
      }
      if (event.key === "ArrowRight" && totalPhotos > 0) {
        setActivePhotoIndex((index) => (index + 1) % totalPhotos);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPhotoLightboxOpen, totalPhotos]);

  return (
    <SectionCard
      id="outdoor-photography"
      title="Hiking & Outdoor Photography"
      isDark={isDark}
    >
      {isPhotosLoading ? (
        <div
          className={`rounded-2xl border border-dashed p-5 text-sm ${
            isDark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-700"
          }`}
        >
          Loading photos...
        </div>
      ) : activePhoto ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
              Photo {normalizedPhotoIndex + 1} of {totalPhotos}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPhoto}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goToNextPhoto}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>

          <div
            className={`overflow-hidden rounded-2xl border ${
              isDark
                ? "border-slate-600 bg-slate-950/90"
                : "border-slate-300/60 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsPhotoLightboxOpen(true)}
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
                  className="object-cover"
                />
              </div>
            </button>
          </div>

          {isPhotoLightboxOpen ? (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 px-4 py-8"
              role="dialog"
              aria-modal="true"
              aria-label="Expanded photo viewer"
              onClick={() => setIsPhotoLightboxOpen(false)}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsPhotoLightboxOpen(false);
                }}
                aria-label="Close expanded photo"
                className="absolute top-4 right-4 rounded-full border border-slate-500 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-100 transition-colors hover:bg-slate-800"
              >
                Close
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPreviousPhoto();
                }}
                aria-label="Previous photo"
                className="absolute left-3 rounded-full border border-slate-500 bg-slate-900/80 px-3 py-2 text-xl text-slate-100 transition-colors hover:bg-slate-800 md:left-6"
              >
                ‹
              </button>

              <div
                className="relative h-full w-full max-w-6xl"
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  fill
                  sizes="100vw"
                  priority
                  className="object-contain"
                />
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNextPhoto();
                }}
                aria-label="Next photo"
                className="absolute right-3 rounded-full border border-slate-500 bg-slate-900/80 px-3 py-2 text-xl text-slate-100 transition-colors hover:bg-slate-800 md:right-6"
              >
                ›
              </button>
            </div>
          ) : null}

          <div className="overflow-x-auto pb-1">
            <div className="flex w-max gap-3">
              {outdoorPhotos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setActivePhotoIndex(index)}
                  aria-label={`View photo ${index + 1}`}
                  className={`relative h-16 w-24 overflow-hidden rounded-xl border transition-colors md:h-20 md:w-28 ${
                    index === normalizedPhotoIndex
                      ? isDark
                        ? "border-cyan-300"
                        : "border-cyan-700"
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
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-2xl border border-dashed p-5 text-sm ${
            isDark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-700"
          }`}
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
