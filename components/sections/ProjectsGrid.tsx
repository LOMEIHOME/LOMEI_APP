"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

const FEATURED_PROJECTS = [
  {
    slug: "paseo-de-claustros",
    num: "01",
    title: "Paseo de Claustros",
    category: "Residencial",
    image: "/images/proyectos/paseo-de-claustros/01.jpg",
  },
  {
    slug: "sophia-distrito",
    num: "02",
    title: "Sophia Distrito",
    category: "Residencial",
    image: "/images/proyectos/sophia-distrito/01.jpg",
  },
  {
    slug: "atria-distrito",
    num: "03",
    title: "Atria Distrito",
    category: "Comercial",
    image: "/images/proyectos/atria-distrito/01.jpg",
  },
  {
    slug: "oficina-ave-fenix",
    num: "04",
    title: "Oficina Ave Fénix",
    category: "Comercial",
    image: "/images/proyectos/oficina-ave-fenix/01.jpg",
  },
  {
    slug: "cocina-alturia-zibata",
    num: "05",
    title: "Cocina Alturia Zibatá",
    category: "Residencial",
    image: "/images/proyectos/cocina-alturia-zibata/01.jpg",
  },
];

export default function ProjectsGrid() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % FEATURED_PROJECTS.length);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length);
  }, []);

  // Auto-advance every 3s
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const project = FEATURED_PROJECTS[active];

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <FadeIn>
              <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
                Portafolio
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-5xl tracking-wider text-[var(--color-dark)]">
                Proyectos destacados
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/proyectos"
              className="text-xs tracking-[0.2em] uppercase text-[var(--color-dark)] border-b border-[var(--color-dark)]/40 pb-1.5 hover:text-[var(--color-camel)] hover:border-[var(--color-camel)]/60 transition-colors duration-400 whitespace-nowrap"
            >
              Ver todos los proyectos →
            </Link>
          </FadeIn>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Main image */}
          <Link href={`/proyectos/${project.slug}`} className="group block">
            <div className="relative aspect-[16/9] md:aspect-[16/7] overflow-hidden rounded-sm">
              {FEATURED_PROJECTS.map((p, i) => (
                <Image
                  key={p.slug}
                  src={p.image}
                  alt={p.title}
                  fill
                  className={`object-cover transition-opacity duration-700 ease-in-out ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, 85rem"
                  priority={i === 0}
                />
              ))}

              {/* Overlay con info */}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,33,24,0.72)] via-[rgba(42,33,24,0.12)] via-50% to-transparent flex items-end justify-between p-6 md:p-8 lg:p-10">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--color-sand)] transition-opacity duration-500">
                    {project.num} · {project.category}
                  </p>
                  <p className="font-serif text-xl md:text-3xl lg:text-4xl tracking-wider text-[var(--color-white)] transition-opacity duration-500">
                    {project.title}
                  </p>
                </div>
              </div>

              {/* Flechas */}
              <button
                onClick={(e) => { e.preventDefault(); prev(); }}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Anterior"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.preventDefault(); next(); }}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Siguiente"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Link>

          {/* Indicadores / thumbnails */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {FEATURED_PROJECTS.map((p, i) => (
              <button
                key={p.slug}
                onClick={() => setActive(i)}
                className="group/dot flex items-center gap-0 transition-all duration-300"
                aria-label={p.title}
              >
                <div
                  className={`rounded-full transition-all duration-500 ${
                    i === active
                      ? "w-8 h-1.5 bg-[var(--color-camel)]"
                      : "w-1.5 h-1.5 bg-[var(--color-sand)] group-hover/dot:bg-[var(--color-warm-gray)]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
