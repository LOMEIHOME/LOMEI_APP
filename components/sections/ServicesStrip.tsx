import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

const SERVICES = [
  {
    num: "01",
    title: "Diseño de Interiores",
    desc: "Espacios que reflejan tu personalidad y estilo de vida, cuidando cada detalle desde la paleta de materiales hasta la iluminación.",
  },
  {
    num: "02",
    title: "Arquitectura",
    desc: "Proyectos integrales desde el concepto hasta la construcción, donde la forma y la función se encuentran de manera natural.",
  },
  {
    num: "03",
    title: "Mobiliario & Objetos",
    desc: "Piezas seleccionadas y diseñadas a medida para complementar cada espacio con carácter propio.",
  },
];

export default function ServicesStrip() {
  return (
    <section className="bg-[var(--color-dark)] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <SectionTag className="!text-[var(--color-warm-gray)]">
            Nuestros servicios
          </SectionTag>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.num} delay={0.15 * i}>
              <div className="border-t border-[var(--color-warm-gray)]/20 pt-6 group">
                <p className="text-[10px] tracking-[0.2em] text-[var(--color-warm-gray)]">
                  {s.num}
                </p>
                <h3 className="mt-4 font-serif text-xl md:text-2xl tracking-wider text-[var(--color-white)] group-hover:text-[var(--color-sand)] transition-colors duration-500">
                  {s.title}
                </h3>
                <p className="mt-4 text-sm text-[var(--color-warm-gray)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
