import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import ProyectosFilterGrid from "./ProyectosFilterGrid";
import FadeIn from "@/components/sections/FadeIn";
import { getAllProyectos } from "@/lib/sanity";

export const revalidate = 60; // ISR: revalida cada 60 segundos

export default async function ProyectosPage() {
  const proyectos = await getAllProyectos();
  const categories = [
    "Todos",
    ...new Set(proyectos.map((p) => p.category)),
  ];

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="bg-[var(--color-linen)] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <SectionTag>Portafolio</SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl tracking-wider text-[var(--color-dark)]">
              Proyectos
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-sm text-[var(--color-warm-gray)] max-w-lg">
              Cada proyecto es una historia de transformación. Explorá nuestro
              portafolio de espacios diseñados para vivirse.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid con filtros */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <ProyectosFilterGrid
          proyectos={proyectos}
          categories={categories}
        />
      </section>

      <Footer />
    </>
  );
}
