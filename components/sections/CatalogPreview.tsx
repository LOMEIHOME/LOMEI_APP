import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

/* ============================================================
   Catálogo (preview) — Opción B «Tarjetas»
   Tarjetas sobre blanco cálido con categoría oak, nombre en
   serif, precio en itálica y «Ver detalle».
   ============================================================ */
const PREVIEW_PRODUCTS = [
  {
    slug: "mesa-centro-encino",
    name: "Mesa de Centro Encino",
    category: "Muebles",
    precio: "$4,800", // TODO: precio real (Sanity)
    image: "/images/proyectos/ceja-de-bravo/02.jpg",
  },
  {
    slug: "cojin-lino-natural",
    name: "Cojín Lino Natural",
    category: "Cojines & Textiles",
    precio: "$650", // TODO: precio real (Sanity)
    image: "/images/proyectos/recamara-bebe-villas/01.jpg",
  },
  {
    slug: "lampara-arco",
    name: "Lámpara Arco",
    category: "Iluminación",
    precio: "$3,200", // TODO: precio real (Sanity)
    image: "/images/proyectos/roof-mirador-campanario/01.jpg",
  },
  {
    slug: "tapete-artesanal",
    name: "Tapete Artesanal",
    category: "Alfombras",
    precio: "$2,400", // TODO: precio real (Sanity)
    image: "/images/proyectos/valle-de-las-flores/01.jpg",
  },
];

export default function CatalogPreview() {
  return (
    <section className="bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {PREVIEW_PRODUCTS.map((p, i) => (
            <FadeIn key={p.slug} delay={0.1 * i}>
              <Link
                href={`/catalogo/${p.slug}`}
                className="group block bg-[var(--color-white)] pb-5"
              >
                <div className="relative aspect-[10/11] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="px-3 md:px-5 pt-3 md:pt-4 flex flex-col gap-1">
                  <p className="text-[10px] md:text-[10px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                    {p.category}
                  </p>
                  <p className="font-serif text-base md:text-lg lg:text-[1.1875rem] tracking-[0.03em] text-[var(--color-dark)]">
                    {p.name}
                  </p>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="font-serif italic text-base text-[var(--color-oak)]">
                      {p.precio}
                    </span>
                    <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-camel)] border-b border-[var(--color-camel)]/40 pb-0.5 group-hover:border-[var(--color-camel)] transition-colors duration-400">
                      Ver detalle
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
