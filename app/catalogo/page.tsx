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
      <Navbar />

      {/* Header */}
      <section className="bg-[var(--color-linen)] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <SectionTag>Catálogo</SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-wider text-[var(--color-dark)]">
              Colección
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-sm text-[var(--color-warm-gray)] max-w-lg">
              Piezas seleccionadas de mobiliario, textiles, iluminación y
              acabados para complementar cada espacio con carácter propio.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <CatalogoFilterGrid
          productos={productos}
          categories={categories}
        />
      </section>

      <Footer />
    </>
  );
}
