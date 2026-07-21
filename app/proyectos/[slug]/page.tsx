import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/sections/FadeIn";
import { getAllProyectos, getAllProyectoSlugs, getProyecto } from "@/lib/sanity";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProyectoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);

  if (!proyecto) notFound();

  const allProyectos = await getAllProyectos();
  const currentIndex = allProyectos.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? allProyectos[currentIndex - 1] : null;
  const next =
    currentIndex < allProyectos.length - 1 ? allProyectos[currentIndex + 1] : null;

  return (
    <>
      <Navbar />

      {/* Hero del proyecto */}
      <section className="relative h-[70vh] md:h-[80vh]">
        <Image
          src={proyecto.images[0]}
          alt={proyecto.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 lg:px-16 py-8 md:py-12">
          <div className="max-w-[85rem] mx-auto">
            <FadeIn>
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-sand)]">
                {proyecto.category} · {proyecto.year}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-3 font-serif text-3xl md:text-5xl lg:text-6xl tracking-wider text-[var(--color-white)]">
                {proyecto.title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-2 text-sm text-[var(--color-white)]/70">
                {proyecto.location}
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-7">
            <FadeIn>
              <SectionTag>Acerca del proyecto</SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-6 text-sm leading-relaxed text-[var(--color-warm-gray)]">
                {proyecto.description}
              </p>
            </FadeIn>
          </div>

          <div className="md:col-span-5">
            <FadeIn delay={0.2}>
              <div className="bg-[var(--color-linen)] rounded-sm p-8">
                <SectionTag>Ficha técnica</SectionTag>
                {proyecto.description && (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-dark)]/80">
                    {proyecto.description}
                  </p>
                )}
                <div className="mt-6 space-y-5">
                  <div className="border-b border-[var(--color-sand)]/40 pb-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      Área
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-dark)]">
                      {proyecto.area}
                    </p>
                  </div>
                  <div className="border-b border-[var(--color-sand)]/40 pb-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      Ubicación
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-dark)]">
                      {proyecto.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      Materiales principales
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {proyecto.materials.map((m) => (
                        <span
                          key={m}
                          className="px-3 py-1 text-[10px] tracking-[0.15em] uppercase bg-[var(--color-cream)] text-[var(--color-oak)] rounded-sm"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Galería — carousel cronológico */}
      {proyecto.images.length > 1 && (
        <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 pb-16 md:pb-24 lg:pb-32">
          <FadeIn>
            <SectionTag>Galería</SectionTag>
          </FadeIn>
          <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-thin scrollbar-thumb-[var(--color-sand)] scrollbar-track-transparent">
            {proyecto.images.slice(1).map((img, i) => (
              <div
                key={img}
                className="relative flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] aspect-[4/3] snap-center overflow-hidden rounded-sm"
              >
                <Image
                  src={img}
                  alt={`${proyecto.title} — imagen ${i + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 85vw, (max-width: 1024px) 60vw, 45vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navegación anterior / siguiente */}
      <section className="border-t border-[var(--color-sand)]/30">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-12 flex items-center justify-between">
          {prev ? (
            <Link
              href={`/proyectos/${prev.slug}`}
              className="group flex items-center gap-3"
            >
              <span className="text-lg text-[var(--color-sand)] group-hover:text-[var(--color-dark)] transition-colors duration-400">
                &larr;
              </span>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                  Anterior
                </p>
                <p className="text-sm text-[var(--color-dark)] group-hover:text-[var(--color-oak)] transition-colors duration-400">
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link href="/proyectos">
            <Button variant="ghost">Todos los proyectos</Button>
          </Link>

          {next ? (
            <Link
              href={`/proyectos/${next.slug}`}
              className="group flex items-center gap-3 text-right"
            >
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                  Siguiente
                </p>
                <p className="text-sm text-[var(--color-dark)] group-hover:text-[var(--color-oak)] transition-colors duration-400">
                  {next.title}
                </p>
              </div>
              <span className="text-lg text-[var(--color-sand)] group-hover:text-[var(--color-dark)] transition-colors duration-400">
                &rarr;
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
