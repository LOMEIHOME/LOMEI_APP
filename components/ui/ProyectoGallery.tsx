"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import FadeIn from "@/components/sections/FadeIn";

interface ProyectoGalleryProps {
  images: string[];
  title: string;
}

export default function ProyectoGallery({ images, title }: ProyectoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 10000);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length, resetTimer]);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      setActiveIndex((prev) => (prev + dir + images.length) % images.length);
      resetTimer();
    },
    [images.length, resetTimer]
  );

  const jumpTo = useCallback(
    (i: number) => {
      setActiveIndex(i);
      resetTimer();
    },
    [resetTimer]
  );

  return (
    <>
      <FadeIn>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[var(--color-linen)] group">
          {images.map((img, i) => (
            <Image
              key={img}
              src={img}
              alt={`${title} — imagen ${i + 1}`}
              fill
              className={`object-cover transition-opacity duration-500 ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          ))}

          {/* Flechas */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-white)]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-[var(--color-white)]"
                aria-label="Imagen anterior"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="var(--color-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => goTo(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-white)]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer hover:bg-[var(--color-white)]"
                aria-label="Imagen siguiente"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="var(--color-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Contador */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-[var(--color-dark)]/60 backdrop-blur-sm">
                <span className="text-[10px] tracking-[0.15em] text-[var(--color-white)]">
                  {activeIndex + 1} / {images.length}
                </span>
              </div>
            </>
          )}
        </div>
      </FadeIn>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 md:mt-4 flex gap-2 md:gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, i) => (
            <FadeIn key={i} delay={0.03 * i}>
              <button
                onClick={() => jumpTo(i)}
                className={`relative w-14 h-14 md:w-[4.5rem] md:h-[4.5rem] shrink-0 overflow-hidden rounded-sm bg-[var(--color-linen)] cursor-pointer transition-all duration-300 ${
                  i === activeIndex
                    ? "ring-1 ring-[var(--color-oak)] opacity-100"
                    : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} — miniatura ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
