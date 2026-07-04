import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FadeIn from "@/components/sections/FadeIn";
import ProductGallery from "@/components/ui/ProductGallery";
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
    <div className="overflow-x-hidden">
      <Navbar forceScrolled />

      <section className="pt-20 md:pt-28 pb-12 md:pb-24">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            {/* Galería — 7 cols */}
            <div className="md:col-span-7">
              <ProductGallery
                images={producto.images}
                name={producto.name}
                badge={producto.badge}
              />
            </div>

            {/* Info — 5 cols */}
            <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
              <FadeIn>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-warm-gray)]">
                  {producto.category}
                </p>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="mt-3 font-serif text-2xl md:text-3xl lg:text-4xl tracking-wider text-[var(--color-dark)]">
                  {producto.name}
                </h1>
              </FadeIn>

              <FadeIn delay={0.15}>
                <p className="mt-3 font-serif text-xl md:text-2xl text-[var(--color-oak)]">
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
                </div>
              </FadeIn>

              <FadeIn delay={0.35}>
                <div className="mt-8 md:mt-10 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/524424874466?text=${encodeURIComponent(
                      `Hola, me interesa el producto: ${producto.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" className="w-full">
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
        <section className="bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
          <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
            <FadeIn>
              <SectionTag>También te puede interesar</SectionTag>
            </FadeIn>
            <div className="mt-8 flex gap-2.5 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/catalogo/${p.slug}`} className="group block shrink-0 w-[calc(50%-5px)] md:w-[calc(33.333%-16px)] snap-start">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-cream)]">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,33,24,0.72)] via-[rgba(42,33,24,0.12)] via-50% to-transparent flex items-end p-3 md:p-6">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[9px] md:text-[10.5px] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                          {p.category}
                        </p>
                        <p className="font-serif text-sm md:text-xl tracking-wider text-[var(--color-white)]">
                          {p.name}
                        </p>
                        <p className="font-serif italic text-xs md:text-base text-[var(--color-sand)]">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
