import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesStrip from "@/components/sections/ServicesStrip";
import { getAllProductos, getAllProyectos } from "@/lib/sanity";

const SplashScreen = dynamic(
  () => import("@/components/sections/SplashScreen")
);
const ProjectsGrid = dynamic(
  () => import("@/components/sections/ProjectsGrid")
);
const CatalogPreview = dynamic(
  () => import("@/components/sections/CatalogPreview")
);

export const revalidate = 3600;

export default async function HomePage() {
  const [allProductos, allProyectos] = await Promise.all([
    getAllProductos(),
    getAllProyectos(),
  ]);

  // Priorizar productos con imagen real, tomar solo 4 para el preview
  const productos = [...allProductos]
    .sort((a, b) => {
      const aHasImg = a.images[0] && !a.images[0].includes("placeholder") ? 1 : 0;
      const bHasImg = b.images[0] && !b.images[0].includes("placeholder") ? 1 : 0;
      return bHasImg - aHasImg;
    })
    .slice(0, 4);

  // Proyectos destacados para el carrusel (featured primero, máx 5)
  const featuredProyectos = allProyectos
    .filter((p) => p.featured)
    .slice(0, 5)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      image: p.images[0] || "/images/placeholder-producto.svg",
    }));

  return (
    <>
      <SplashScreen />
      <Navbar />
      <Hero />
      <AboutPreview />
      <ServicesStrip />
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <hr className="border-t border-[var(--color-sand)]" />
      </div>
      <ProjectsGrid proyectos={featuredProyectos} />
      <CatalogPreview productos={productos} />
      <Footer />
    </>
  );
}
