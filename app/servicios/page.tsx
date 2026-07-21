import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "@/components/sections/FadeIn";
import Button from "@/components/ui/Button";
import ServiciosIconGrid from "@/components/sections/ServiciosIconGrid";
import { SERVICIOS } from "@/lib/data/servicios";

export default function ServiciosPage() {
  return (
    <>
      <Navbar forceScrolled />

      <main>
        {/* Hero / Header */}
        <section className="bg-[var(--color-linen)] pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 text-center">
            <FadeIn>
              <SectionTag>Nuestros servicios</SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl tracking-wider text-[var(--color-dark)]">
                Servicios
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-[var(--color-dark)]/70">
                Acompañamos cada etapa de tu proyecto, desde la primera idea
                hasta el último detalle. Conoce cómo podemos ayudarte a
                transformar tu espacio.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Grid de iconos interactivo */}
        <ServiciosIconGrid />

        {/* Secciones de detalle por servicio */}
        {SERVICIOS.map((servicio, i) => {
          const isEven = i % 2 === 1;

          return (
            <section
              key={servicio.id}
              id={servicio.id}
              className="scroll-mt-20 border-t border-[var(--color-sand)]/30 py-16 md:py-24 lg:py-32"
            >
              <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
                  {/* Imagen */}
                  <div
                    className={`md:col-span-5 ${isEven ? "md:order-last" : ""}`}
                  >
                    <FadeIn direction={isEven ? "right" : "left"}>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                        <Image
                          src={servicio.imagen}
                          alt={servicio.nombre}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 42vw"
                          loading={i < 2 ? "eager" : "lazy"}
                        />
                        {servicio.id === "paisajismo" && (
                          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/85 backdrop-blur-sm rounded-sm p-2.5">
                            <div className="relative h-12 w-36 md:h-14 md:w-44">
                              <Image
                                src="/images/servicios/naturhabitat-logo.png"
                                alt="Naturhabitat Landscape Studio"
                                fill
                                className="object-contain"
                                sizes="144px"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </FadeIn>
                  </div>

                  {/* Texto */}
                  <div className="md:col-span-7">
                    <FadeIn delay={0.1}>
                      <SectionTag>{servicio.num}</SectionTag>
                    </FadeIn>
                    <FadeIn delay={0.15}>
                      <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-4xl tracking-wider text-[var(--color-dark)]">
                        {servicio.nombre}
                      </h2>
                      {servicio.subtitulo && (
                        <p className="mt-1 text-sm tracking-[0.15em] uppercase text-[var(--color-oak)]">
                          {servicio.subtitulo}
                        </p>
                      )}
                    </FadeIn>
                    <FadeIn delay={0.2}>
                      <p className="mt-6 text-base leading-relaxed text-[var(--color-dark)]/70 text-justify">
                        {servicio.descripcion}
                      </p>
                    </FadeIn>
                    <FadeIn delay={0.25}>
                      <div className="mt-6">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-2">
                          Incluye
                        </p>
                        <p className="text-sm leading-relaxed text-[var(--color-dark)]/60">
                          {servicio.incluye}
                        </p>
                      </div>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                      {servicio.id === "paisajismo" ? (
                        <a
                          href="https://www.instagram.com/naturhabitat/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2.5 text-sm tracking-[0.12em] uppercase text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors duration-400"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                          </svg>
                          @naturhabitat
                        </a>
                      ) : (
                        <p className="mt-6 font-serif text-lg md:text-xl text-[var(--color-oak)] tracking-wide">
                          {servicio.precio}
                        </p>
                      )}
                    </FadeIn>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="bg-[var(--color-dark)] py-24 md:py-32">
          <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 text-center">
            <FadeIn>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wider text-[var(--color-white)]">
                ¿Listo para transformar tu espacio?
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-6 text-base text-[var(--color-warm-gray)] max-w-xl mx-auto">
                Platiquemos sobre tu proyecto. Cada espacio tiene una historia
                por contar.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div className="mt-10">
                <Link href="/contacto">
                  <Button
                    variant="secondary"
                    className="!border-[var(--color-white)]/50 !text-[var(--color-white)] hover:!bg-[var(--color-white)]/10"
                  >
                    Contáctanos
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
