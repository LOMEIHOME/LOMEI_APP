import Image from "next/image";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

/* ============================================================
   Sobre el estudio — v2 con moodboard de materiales
   La imagen ya no es un proyecto más: el moodboard (encino,
   mármol, textil, latón) habla del proceso del estudio y vive
   en la paleta de la marca.
   ============================================================ */
const STATS = [
  ["5+", "Años de experiencia"],
  ["15+", "Proyectos diseñados"],
  ["QRO", "Querétaro, MX"],
];

export default function AboutPreview() {
  return (
    <section className="bg-[var(--color-linen)] py-24 md:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Texto — 5 columnas */}
          <div className="md:col-span-5">
            <FadeIn>
              <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
                Sobre el estudio
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-[3.25rem] tracking-wider text-[var(--color-dark)] leading-tight">
                Diseño con alma propia
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-6 text-base leading-relaxed text-[var(--color-dark)]/75">
                LV Arquitectura e Interiorismo nace en el 2023 por la Arq. Ana
                Lorena Vargas Mejía con la intención de transformar espacios en
                hogares con identidad, dando vida a Lomei Home. Buscamos diseñar
                y desarrollar proyectos residenciales y comerciales de manera
                integral, desde su arquitectura hasta el interior que lo habita.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="mt-7 pl-6 border-l border-[var(--color-sand)] font-serif italic text-xl md:text-2xl leading-snug text-[var(--color-camel)]">
                «Te acompañamos en cada proceso y te invitamos a conocer
                nuestro showroom.»
              </p>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="mt-11 flex">
                {STATS.map(([n, l], i) => (
                  <div
                    key={l}
                    className={`pr-8 lg:pr-12 ${
                      i > 0
                        ? "pl-8 lg:pl-12 border-l border-[var(--color-sand)]/60"
                        : ""
                    }`}
                  >
                    <p className="font-serif font-light text-[2.375rem] leading-none text-[var(--color-oak)]">
                      {n}
                    </p>
                    <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-camel)] mt-2">
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Imagen — 7 columnas · moodboard de materiales */}
          <div className="md:col-span-7">
            <FadeIn direction="right" delay={0.2}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src="/images/proyectos/ceja-de-bravo/01.jpg"
                  alt="Moodboard de materiales — encino, mármol y textiles, LOMEI Home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
