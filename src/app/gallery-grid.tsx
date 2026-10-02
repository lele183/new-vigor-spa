"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "./scroll-reveal";

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export function GalleryGrid({ photos }: { photos: readonly GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = activeIndex !== null;
  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const movePhoto = (direction: number) => {
    setActiveIndex((current) =>
      current === null ? null : (current + direction + photos.length) % photos.length,
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <ScrollReveal key={photo.src} delay={(index % 3) * 70}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Enlarge photo: ${photo.caption}`}
              aria-haspopup="dialog"
              className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl bg-brown-deep/10 shadow-sm outline-offset-4 transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1280px) 390px, (min-width: 1024px) 32vw, 48vw"
                className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pt-10 pb-3 text-left text-xs font-medium text-white sm:px-4 sm:pb-4 sm:text-sm">
                {photo.caption}
              </span>
              <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                  <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
                </svg>
              </span>
            </button>
          </ScrollReveal>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="gallery-photo-caption"
        className="gallery-dialog fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-[#211714] p-4 text-white shadow-2xl sm:p-6"
        onClose={() => setActiveIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            movePhoto(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {activePhoto && (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p id="gallery-photo-caption" className="font-serif text-lg sm:text-xl">
                {activePhoto.caption}
              </p>
              <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close photo" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="relative h-[60dvh] sm:h-[68dvh]">
              <Image src={activePhoto.src} alt={activePhoto.alt} fill sizes="(min-width: 1024px) 976px, 95vw" className="object-contain" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button type="button" onClick={() => movePhoto(-1)} aria-label="Previous photo" className="flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5" aria-hidden="true"><path d="m14 5-7 7 7 7" /></svg>
              </button>
              <p className="text-sm text-white/65" aria-live="polite">{(activeIndex ?? 0) + 1} / {photos.length}</p>
              <button type="button" onClick={() => movePhoto(1)} aria-label="Next photo" className="flex size-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5" aria-hidden="true"><path d="m10 5 7 7-7 7" /></svg>
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
