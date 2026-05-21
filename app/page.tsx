import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import AboutPreview from "@/components/sections/AboutPreview";
import ServicesStrip from "@/components/sections/ServicesStrip";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import CatalogPreview from "@/components/sections/CatalogPreview";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutPreview />
      <ServicesStrip />
      <ProjectsGrid />
      <CatalogPreview />
      <Footer />
    </>
  );
}
