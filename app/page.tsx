import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/sections/SplashScreen";
import Hero from "@/components/sections/Hero";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesStrip from "@/components/sections/ServicesStrip";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import CatalogPreview from "@/components/sections/CatalogPreview";
import { getAllProductos } from "@/lib/sanity";

export const revalidate = 60;

export default async function HomePage() {
  const allProductos = await getAllProductos();
  // Priorizar productos con imagen real (no placeholder)
  const productos = [...allProductos].sort((a, b) => {
    const aHasImg = a.images[0] && !a.images[0].includes("placeholder") ? 1 : 0;
    const bHasImg = b.images[0] && !b.images[0].includes("placeholder") ? 1 : 0;
    return bHasImg - aHasImg;
  });

  return (
    <>
      <SplashScreen />
      <Navbar />
      <Hero />
      <AboutPreview />
      <ServicesStrip />
      <ProjectsGrid />
      <CatalogPreview productos={productos} />
      <Footer />
    </>
  );
}
