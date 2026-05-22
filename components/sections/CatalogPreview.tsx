import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

const PREVIEW_PRODUCTS = [
  {
    slug: "mesa-centro-encino",
    name: "Mesa de Centro Encino",
    category: "Muebles",
    image: "/images/showroom/render-sketch-1.png",
  },
  {
    slug: "cojin-lino-natural",
    name: "Cojín Lino Natural",
    category: "Cojines & Textiles",
    image: "/images/showroom/sala-detalle.png",
  },
  {
    slug: "lampara-arco",
    name: "Lámpara Arco",
    category: "Iluminación",
    image: "/images/showroom/showroom-led.png",
  },
  {
    slug: "tapete-artesanal",
    name: "Tapete Artesanal",
    category: "Alfombras",
    image: "/images/showroom/sala-recibidor.png",
  },
];

export default function CatalogPreview() {
  return (
    <section className="bg-[var(--color-linen)] py-24 md:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <FadeIn>
              <SectionTag>Colección</SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl tracking-wider text-[var(--color-dark)]">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PREVIEW_PRODUCTS.map((p, i) => (
            <FadeIn key={p.slug} delay={0.1 * i}>
              <Link href={`/catalogo/${p.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-sm bg-[var(--color-cream)]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                  {p.category}
                </p>
                <p className="mt-1 text-sm text-[var(--color-dark)] group-hover:text-[var(--color-oak)] transition-colors duration-400">
                  {p.name}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
