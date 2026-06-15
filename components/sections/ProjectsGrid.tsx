"use client";

import Image from "next/image";
import Link from "next/link";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

/* ============================================================
   Proyectos destacados — Opción B «Degradado permanente»
   La información (número · categoría · nombre) es siempre
   visible sobre un degradado inferior — también en móvil.
   El zoom suave al hover se conserva.
   ============================================================ */
const FEATURED_PROJECTS = [
  {
    slug: "paseo-de-claustros",
    num: "01",
    title: "Paseo de Claustros",
    category: "Residencial",
    image: "/images/proyectos/paseo-de-claustros/01.jpg",
    span: "md:col-span-2 md:row-span-2",
    aspect: "aspect-[4/3]",
  },
  {
    slug: "sophia-distrito",
    num: "02",
    title: "Sophia Distrito",
    category: "Residencial",
    image: "/images/proyectos/sophia-distrito/01.jpg",
    span: "",
    aspect: "aspect-square",
  },
  {
    slug: "atria-distrito",
    num: "03",
    title: "Atria Distrito",
    category: "Comercial",
    image: "/images/proyectos/atria-distrito/01.jpg",
    span: "",
    aspect: "aspect-square",
  },
];

export default function ProjectsGrid() {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <FadeIn>
            <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
              Portafolio
            </SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl tracking-wider text-[var(--color-dark)]">
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

      {/* Grid asimétrico — alineado con el header (Opción A) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURED_PROJECTS.map((p, i) => (
          <FadeIn key={p.slug} delay={0.1 * i} className={p.span}>
            <Link href={`/proyectos/${p.slug}`} className="group block h-full">
              <div className={`relative ${p.aspect} h-full overflow-hidden rounded-sm`}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={p.span ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                />
                {/* Degradado permanente — caption siempre visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,33,24,0.72)] via-[rgba(42,33,24,0.18)] via-45% to-transparent flex items-end p-6 md:p-7">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10.5px] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                      {p.num} · {p.category}
                    </p>
                    <p className="font-serif text-xl md:text-[1.625rem] tracking-wider text-[var(--color-white)]">
                      {p.title}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
