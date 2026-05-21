"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

const FEATURED_PROJECTS = [
  {
    slug: "showroom-lomei",
    title: "Showroom LOMEI Home",
    category: "Comercial",
    image: "/images/showroom/showroom-main.png",
    span: "md:col-span-2 md:row-span-2",
    aspect: "aspect-[4/3]",
  },
  {
    slug: "sala-recibidor",
    title: "Sala Recibidor",
    category: "Interiorismo",
    image: "/images/showroom/sala-detalle.png",
    span: "",
    aspect: "aspect-square",
  },
  {
    slug: "fachada-showroom",
    title: "Fachada Showroom",
    category: "Arquitectura",
    image: "/images/showroom/fachada.png",
    span: "",
    aspect: "aspect-square",
  },
];

export default function ProjectsGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <FadeIn>
            <SectionTag>Portafolio</SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl tracking-wider text-[var(--color-dark)]">
              Proyectos destacados
            </h2>
          </FadeIn>
        </div>
        <FadeIn delay={0.2}>
          <Link href="/proyectos" className="mt-4 md:mt-0">
            <Button variant="ghost">Ver todos los proyectos</Button>
          </Link>
        </FadeIn>
      </div>

      {/* Grid asimétrico */}
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
                {/* Overlay al hover */}
                <div className="absolute inset-0 bg-[var(--color-dark)]/0 group-hover:bg-[var(--color-dark)]/40 transition-all duration-500 flex items-end p-6">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                      {p.category}
                    </p>
                    <p className="mt-1 font-serif text-lg md:text-xl tracking-wider text-[var(--color-white)]">
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
