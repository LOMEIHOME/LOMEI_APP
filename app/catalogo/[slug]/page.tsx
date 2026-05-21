import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/sections/FadeIn";
import {
  getAllProductos,
  getAllProductoSlugs,
  getProducto,
} from "@/lib/sanity";
import { formatPrice } from "@/lib/data/productos";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductoSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const producto = await getProducto(slug);

  if (!producto) notFound();

  const allProductos = await getAllProductos();
  const related = allProductos
    .filter((p) => p.category === producto.category && p.slug !== producto.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />

      <section className="pt-28 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            {/* Galería — 7 cols */}
            <div className="md:col-span-7">
              <FadeIn>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--color-linen)]">
                  <Image
                    src={producto.images[0]}
                    alt={producto.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 58vw"
                  />
                  {producto.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge>{producto.badge}</Badge>
                    </div>
                  )}
                </div>
              </FadeIn>

              {producto.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {producto.images.map((img, i) => (
                    <FadeIn key={img} delay={0.05 * i}>
                      <div className="relative aspect-square overflow-hidden rounded-sm bg-[var(--color-linen)]">
                        <Image
                          src={img}
                          alt={`${producto.name} — vista ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="15vw"
                        />
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>

            {/* Info — 5 cols */}
            <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
              <FadeIn>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-warm-gray)]">
                  {producto.category}
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="mt-3 font-serif text-3xl md:text-4xl tracking-wider text-[var(--color-dark)]">
                  {producto.name}
                </h1>
              </FadeIn>

              <FadeIn delay={0.15}>
                <p className="mt-3 font-serif text-2xl text-[var(--color-oak)]">
                  {formatPrice(producto.price)}
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="mt-6 h-[0.5px] bg-[var(--color-sand)]/50" />
              </FadeIn>

              <FadeIn delay={0.25}>
                <p className="mt-6 text-sm leading-relaxed text-[var(--color-warm-gray)]">
                  {producto.description}
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-8 space-y-4">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      Dimensiones
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-dark)]">
                      {producto.dimensions}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      Materiales
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-dark)]">
                      {producto.materials.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      Acabados disponibles
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {producto.finishes.map((f) => (
                        <span
                          key={f}
                          className="px-3 py-1 text-[10px] tracking-[0.15em] uppercase bg-[var(--color-linen)] text-[var(--color-oak)] rounded-sm"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.35}>
                <div className="mt-10 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/527711009084?text=${encodeURIComponent(
                      `Hola, me interesa el producto: ${producto.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" className="w-full">
                      Solicitar información
                    </Button>
                  </a>
                  <Link href="/catalogo">
                    <Button variant="ghost" className="w-full">
                      Volver al catálogo
                    </Button>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <section className="bg-[var(--color-linen)] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn>
              <SectionTag>También te puede interesar</SectionTag>
            </FadeIn>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <FadeIn key={p.slug} delay={0.1 * i}>
                  <Link href={`/catalogo/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--color-cream)]">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      {p.category}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-dark)] group-hover:text-[var(--color-oak)] transition-colors duration-400">
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm font-serif text-[var(--color-oak)]">
                      {formatPrice(p.price)}
                    </p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
