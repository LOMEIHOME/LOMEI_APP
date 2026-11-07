"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/* ============================================================
   FilterTabs — filtros tipo tab con subrayado camel y conteo
   Scrollable horizontal en móvil y desktop con flechas.
   ============================================================ */
interface FilterTabsProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
  counts?: Record<string, number>;
}

export default function FilterTabs({
  categories,
  active,
  onChange,
  counts,
}: FilterTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, categories]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Fade izquierdo */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--color-cream)] to-transparent pointer-events-none z-10" />
      )}

      {/* Fade derecho */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-cream)] to-transparent pointer-events-none z-10" />
      )}

      {/* Flecha izquierda — solo desktop */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] transition-colors cursor-pointer"
          aria-label="Scroll izquierda"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Flecha derecha — solo desktop */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-7 h-7 items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] transition-colors cursor-pointer"
          aria-label="Scroll derecha"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Contenedor scrollable */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-6 border-b border-[var(--color-sand)]/55 overflow-x-auto max-w-full scrollbar-hide px-8 md:px-9"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`flex items-baseline gap-1.5 pb-3.5 -mb-px whitespace-nowrap text-[11px] md:text-xs tracking-[0.18em] uppercase border-b transition-colors duration-400 cursor-pointer ${
              active === cat
                ? "text-[var(--color-dark)] border-[var(--color-camel)]"
                : "text-[var(--color-dark)]/55 border-transparent hover:text-[var(--color-dark)]"
            }`}
          >
            {cat}
            {counts && counts[cat] !== undefined && (
              <span className="font-serif italic text-[11px] md:text-xs normal-case tracking-normal text-[var(--color-warm-gray)]">
                {counts[cat]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
