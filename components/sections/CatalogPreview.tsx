import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";
import type { Producto } from "@/lib/data/productos";
import { formatPrice } from "@/lib/data/productos";

/* ============================================================
   Catálogo (preview) — Muestra 4 productos reales de Sanity
   en la página de inicio.
   ============================================================ */
interface Props {
  productos: Producto[];
}

export default function CatalogPreview({ productos }: Props) {
  const items = productos.slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <FadeIn>
              <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
                Colección
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-5xl tracking-wider text-[var(--color-dark)]">
                Explora el catálogo
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link href="/catalogo" className="mt-4 md:mt-0">
              <Button variant="secondary">Explorar catálogo</Button>
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {items.map((p, i) => (
            <FadeIn key={p.slug} delay={0.1 * i}>
              <Link
                href={`/catalogo/${p.slug}`}
                className="group block bg-[var(--color-white)] pb-3 md:pb-5 overflow-hidden"
              >
                <div className="relative aspect-[10/11] overflow-hidden">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="px-2 md:px-5 pt-2 md:pt-4 h-[5.5rem] md:h-[7rem] flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                      {p.category}
                    </p>
                    <p className="mt-1 font-serif text-[13px] md:text-lg lg:text-[1.1875rem] tracking-[0.03em] text-[var(--color-dark)] line-clamp-2">
                      {p.name}
                    </p>
                  </div>
                  <span className="font-serif italic text-sm md:text-base text-[var(--color-oak)]">
                    {formatPrice(p.price)}
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
