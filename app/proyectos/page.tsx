import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import ProyectosFilterGrid from "./ProyectosFilterGrid";
import FadeIn from "@/components/sections/FadeIn";
import { getAllProyectos } from "@/lib/sanity";

export const revalidate = 60;

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
      <section className="bg-[var(--color-linen)] pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <FadeIn>
            <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
              Portafolio
            </SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-6xl tracking-wider text-[var(--color-dark)]">
              Proyectos
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/70 max-w-lg">
              Cada proyecto es una historia de transformación. Explora nuestro
              portafolio de espacios diseñados para vivirse.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Grid con filtros */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <ProyectosFilterGrid
            proyectos={proyectos}
            categories={categories}
          />
        </div>
      </section>

      <Footer />
    </>
  );
}
