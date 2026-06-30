import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "@/components/sections/FadeIn";
import CatalogoFilterGrid from "./CatalogoFilterGrid";
import { getAllProductos } from "@/lib/sanity";

export const revalidate = 60;

export default async function CatalogoPage() {
  const productos = await getAllProductos();
  const categories = [
    "Todos",
    ...new Set(productos.map((p) => p.category)),
  ];

  return (
    <>
      <Navbar forceScrolled />

      {/* Header */}
      <section className="bg-[var(--color-linen)] pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <FadeIn>
            <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
              Catálogo
            </SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-6xl tracking-wider text-[var(--color-dark)]">
              Colección
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/70 max-w-lg">
              Piezas seleccionadas de mobiliario, textiles, iluminación y
              acabados para complementar cada espacio con carácter propio.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 overflow-hidden">
        <CatalogoFilterGrid
          productos={productos}
          categories={categories}
        />
      </section>

      <Footer />
    </>
  );
}
