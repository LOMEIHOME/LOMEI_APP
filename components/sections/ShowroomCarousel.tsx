"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import SectionTag from "@/components/ui/SectionTag";

const SHOWROOM_IMAGES = [
  { src: "/images/showroom/showroom-1.png", alt: "Nuestro espacio" },
  { src: "/images/showroom/showroom-materiales.jpg", alt: "Materiales y textiles del showroom" },
  { src: "/images/showroom/showroom-sala-lateral.jpg", alt: "Sala del showroom — vista lateral" },
  { src: "/images/showroom/showroom-sala-frontal.jpg", alt: "Sala del showroom — vista frontal" },
  { src: "/images/showroom/showroom-repisero.jpg", alt: "Mueble repisero con adornos" },
  { src: "/images/showroom/showroom-adornos.jpg", alt: "Adornos y detalles decorativos" },
  { src: "/images/showroom/showroom-detalles.jpg", alt: "Floreros, velas y accesorios" },
];

export default function ShowroomCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % SHOWROOM_IMAGES.length);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + SHOWROOM_IMAGES.length) % SHOWROOM_IMAGES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const num = String(active + 1).padStart(2, "0");

  return (
    <section className="bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
          El showroom
        </SectionTag>
        <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
          Nuestro espacio
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/72 max-w-2xl">
          Un espacio diseñado para que nuestros clientes experimenten los
          materiales, acabados y la estética del estudio en persona.
        </p>

        {/* Carrusel */}
        <div
          className="relative mt-12 group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-sm">
            {SHOWROOM_IMAGES.map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt={img.alt}
                fill
                className={`object-cover transition-opacity duration-700 ease-in-out ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                sizes="(max-width: 768px) 100vw, 85rem"
                priority={i === 0}
              />
            ))}

            {/* Overlay con número */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,33,24,0.72)] via-[rgba(42,33,24,0.12)] via-50% to-transparent flex items-end p-6 md:p-8 lg:p-10">
              <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                {num}
              </p>
            </div>

            {/* Flechas */}
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Indicadores pill */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {SHOWROOM_IMAGES.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setActive(i)}
                className="group/dot flex items-center gap-0 transition-all duration-300"
                aria-label={img.alt}
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
