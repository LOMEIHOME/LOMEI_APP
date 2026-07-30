import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/sections/FadeIn";
import ProyectoGallery from "@/components/ui/ProyectoGallery";
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
    <div className="overflow-x-hidden">
      <Navbar forceScrolled />

      {/* Layout principal — galería + info */}
      <section className="pt-20 md:pt-28 pb-12 md:pb-24">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            {/* Galería con carousel — 7 cols */}
            <div className="md:col-span-7">
              <ProyectoGallery
                images={proyecto.images}
                title={proyecto.title}
              />
            </div>

            {/* Info del proyecto — 5 cols */}
            <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
              <FadeIn>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-warm-gray)]">
                  {proyecto.category} · {proyecto.year}
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl tracking-wider text-[var(--color-dark)]">
                  {proyecto.title}
                </h1>
              </FadeIn>

              <FadeIn delay={0.15}>
                <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
                  {proyecto.location}
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="mt-6 h-[0.5px] bg-[var(--color-sand)]/50" />
              </FadeIn>

              {proyecto.description && (
                <FadeIn delay={0.25}>
                  <p className="mt-6 text-sm leading-relaxed text-[var(--color-warm-gray)]">
                    {proyecto.description}
                  </p>
                </FadeIn>
              )}

              <FadeIn delay={0.3}>
                <div className="mt-8 space-y-4">
                  {proyecto.area && (
                    <div className="border-b border-[var(--color-sand)]/30 pb-4">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                        Área
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-dark)]">
                        {proyecto.area}
                      </p>
                    </div>
                  )}
                  {proyecto.duration && (
                    <div className="border-b border-[var(--color-sand)]/30 pb-4">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                        Duración
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-dark)]">
                        {proyecto.duration}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      Ubicación
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-dark)]">
                      {proyecto.location}
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.35}>
                <div className="mt-8 md:mt-10 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/527711009084?text=${encodeURIComponent(
                      `Hola, me interesa saber más sobre el proyecto: ${proyecto.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" className="w-full">
                      Solicitar información
                    </Button>
                  </a>
                  <Link href="/proyectos">
                    <Button variant="ghost" className="w-full">
                      Ver todos los proyectos
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}
