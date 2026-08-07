"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "@/components/sections/FadeIn";

/* ============================================================
   Nosotros — propuesta completa
   Contraste del cuerpo (15px dark/75), cita en camel con
   hairline (eco del About de la home), proceso como línea de
   tiempo y materiales como chips delineados.
   ============================================================ */
const PROCESO = [
  {
    num: "01",
    title: "Brief",
    desc: "Escuchamos tus necesidades, estilo de vida y aspiraciones para entender la esencia de tu proyecto.",
  },
  {
    num: "02",
    title: "Concepto",
    desc: "Moodboard, paleta de materiales y propuesta conceptual que traduce tus ideas en un lenguaje visual.",
  },
  {
    num: "03",
    title: "Desarrollo",
    desc: "Planos, renders 3D y especificaciones técnicas para visualizar cada detalle antes de construir.",
  },
  {
    num: "04",
    title: "Ejecución",
    desc: "Coordinamos proveedores, supervisamos obra y cuidamos que cada acabado se instale conforme al diseño.",
  },
  {
    num: "05",
    title: "Entrega",
    desc: "Recorrido final, ajustes de detalle y la satisfacción de entregarte un espacio diseñado para vivirse.",
  },
];

const SHOWROOM_IMAGES = [
  { src: "/images/showroom/showroom-1.png", alt: "Nuestro espacio" },
];

function ShowroomCarousel() {
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
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const num = String(active + 1).padStart(2, "0");

  return (
    <section className="bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <FadeIn>
          <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
            El showroom
          </SectionTag>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
            Nuestro espacio
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/72 max-w-2xl">
            Un espacio diseñado para que nuestros clientes experimenten los
            materiales, acabados y la estética del estudio en persona.
          </p>
        </FadeIn>

        {/* Carrusel — mismo estilo que ProjectsGrid del home */}
        <FadeIn delay={0.2}>
          <div
            className="relative mt-12 group"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative aspect-[16/9] md:aspect-[16/7] overflow-hidden rounded-sm">
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
        </FadeIn>
      </div>
    </section>
  );
}

export default function NosotrosPage() {
  return (
    <>
      <Navbar forceScrolled />

      {/* Header */}
      <section className="bg-[var(--color-linen)] pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <FadeIn>
            <SectionTag>Nosotros</SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl tracking-wider text-[var(--color-dark)]">
              LOMEI HOME
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-[var(--color-dark)]/70">
              Arquitectura e Interiorismo · Querétaro, México
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Historia del estudio */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-linen)]">
                <div className="relative w-full h-full py-16">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src="/images/showroom/arq-ana-lorena.png"
                      alt="Arq. Ana Lorena Vargas Mejía"
                      fill
                      className="object-cover object-[35%_25%]"
                      sizes="(max-width: 768px) 100vw, 42vw"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn>
              <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
                Historia
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.75rem] tracking-wider text-[var(--color-dark)] leading-tight">
                Arq. Ana Lorena Vargas Mejía
              </h2>
              <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                Fundadora · LV Arquitectura e Interiorismo
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-7 text-[15px] leading-relaxed text-[var(--color-dark)]/75">
                LV Arquitectura e Interiorismo nace en el 2023 con la intención
                de transformar espacios en hogares con identidad, dando vida al
                proyecto de LOMEI Home.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/75">
                Nuestra misión es diseñar y desarrollar proyectos residenciales y
                comerciales de manera integral, desde su arquitectura hasta el
                interior que se habita. Creamos propuestas donde la arquitectura y
                el interiorismo dialogan desde el origen del proyecto, generando
                espacios que reflejen fielmente la personalidad, estilo de vida y
                aspiraciones de cada cliente.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <blockquote className="mt-8 pl-6 border-l border-[var(--color-sand)]">
                <p className="font-serif text-base md:text-xl lg:text-2xl italic leading-snug text-[var(--color-camel)] tracking-wide">
                  &ldquo;Un espacio no solo se construye: se diseña para
                  vivirse.&rdquo;
                </p>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* El Showroom — Carrusel */}
      <ShowroomCarousel />

      {/* Proceso de trabajo — línea de tiempo */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <FadeIn>
          <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
            Cómo trabajamos
          </SectionTag>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
            Nuestro proceso
          </h2>
        </FadeIn>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-5 gap-x-10 gap-y-6 md:gap-y-10">
          {PROCESO.map((step, i) => (
            <FadeIn key={step.num} delay={0.1 * i}>
              <div className="relative border-t border-[var(--color-sand)]/60 pt-6">
                {/* Punto en la línea de tiempo */}
                <span
                  className={`absolute -top-1 left-0 w-[7px] h-[7px] rounded-full ${
                    i === 0
                      ? "bg-[var(--color-camel)]"
                      : "bg-[var(--color-sand)]"
                  }`}
                />
                <p className="font-serif font-light text-2xl md:text-4xl leading-none text-[var(--color-oak)]/55">
                  {step.num}
                </p>
                <h3 className="mt-3.5 font-serif text-[1.3125rem] tracking-[0.06em] text-[var(--color-dark)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--color-dark)]/68">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Nuestro equipo */}
      <section className="border-t border-[var(--color-sand)]/30 bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <FadeIn>
            <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
              El equipo
            </SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
              Quienes hacemos LOMEI
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/72 max-w-2xl">
              Un equipo multidisciplinario que comparte la pasión por crear
              espacios con identidad y propósito.
            </p>
          </FadeIn>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {[
              {
                name: "Arq. Ana Lorena Vargas",
                role: "Directora Creativa",
                desc: "Fundadora de LOMEI HOME. Lidera cada proyecto desde el concepto hasta la entrega, cuidando que cada espacio refleje la esencia del cliente.",
              },
              {
                name: "Próximamente",
                role: "Consultor de Obra",
                desc: "Supervisa y asesora la ejecución en sitio, garantizando que cada detalle constructivo se alinee con el proyecto arquitectónico.",
              },
              {
                name: "Próximamente",
                role: "Redes Sociales",
                desc: "Gestiona la comunicación digital del estudio, creando contenido que refleja la identidad y el trabajo de LOMEI HOME.",
              },
              {
                name: "Próximamente",
                role: "Diseño Web",
                desc: "Desarrolla y mantiene la presencia digital del estudio, asegurando una experiencia coherente con la identidad de la marca.",
              },
            ].map((member, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-sand)]/20">
                    {member.name === "Arq. Ana Lorena Vargas" ? (
                      <Image
                        src="/images/showroom/arq-ana-lorena.png"
                        alt={member.name}
                        fill
                        className="object-cover object-[32%_25%]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                          Próximamente
                        </p>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 font-serif text-xl tracking-[0.05em] text-[var(--color-dark)]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                    {member.role}
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-dark)]/68">
                    {member.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
