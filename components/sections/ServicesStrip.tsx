import Link from "next/link";
import SectionTag from "@/components/ui/SectionTag";
import ServiceIcon from "@/components/ui/ServiceIcon";
import FadeIn from "./FadeIn";
import { SERVICIOS } from "@/lib/data/servicios";

/* ============================================================
   Servicios en la home — v2 «Retícula en claro»
   El café desaparece de esta sección (queda solo en el footer):
   retícula con hairlines sobre crema, los mismos iconos y
   celdas de /servicios. Cada celda ancla a su detalle.
   Requiere el ServiceIcon nuevo (línea o duotono).
   ============================================================ */
const FEATURED_IDS = ["interiorismo", "proyecto-ejecutivo", "paisajismo", "custom-design"];

// Nombre corto y subtítulo para las celdas de la home
const CELL_INFO: Record<string, { nombre: string; sub: string }> = {
  interiorismo: { nombre: "Interiorismo", sub: "Proyecto integral" },
  "proyecto-ejecutivo": { nombre: "Proyecto Ejecutivo", sub: "Planos y técnica" },
  paisajismo: { nombre: "Paisajismo", sub: "Exterior e interior" },
  "custom-design": { nombre: "Custom Design", sub: "Diseña tu mueble" },
};

const FEATURED = FEATURED_IDS
  .map((id) => SERVICIOS.find((s) => s.id === id))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

export default function ServicesStrip() {
  return (
    <section className="bg-[var(--color-cream)] py-16 md:py-24 lg:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <FadeIn>
              <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
                Nuestros servicios
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.75rem] tracking-wider text-[var(--color-dark)] leading-tight">
                Acompañamos cada etapa
              </h2>
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <Link
              href="/servicios"
              className="text-xs tracking-[0.2em] uppercase text-[var(--color-dark)] border-b border-[var(--color-dark)]/40 pb-1.5 hover:text-[var(--color-camel)] hover:border-[var(--color-camel)]/60 transition-colors duration-400 whitespace-nowrap"
            >
              Ver todos los servicios →
            </Link>
          </FadeIn>
        </div>

        {/* Retícula — eco de /servicios */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-[var(--color-sand)]/55">
          {FEATURED.map((s, i) => {
            const info = CELL_INFO[s.id] ?? { nombre: s.nombre, sub: s.subtitulo ?? "" };
            return (
              <FadeIn key={s.id} delay={0.08 * i} className="h-full">
                <Link
                  href={`/servicios#${s.id}`}
                  className="h-full flex flex-col items-center gap-3 md:gap-4 px-3 py-6 md:px-5 md:py-10 border-r border-b border-[var(--color-sand)]/55 text-center group transition-colors duration-400 hover:bg-[var(--color-linen)]/40"
                >
                  <ServiceIcon iconId={s.iconId} size="sm" className="md:!w-24 md:!h-24" />
                  <span className="flex flex-col items-center gap-1.5">
                    <span className="font-serif text-sm md:text-lg lg:text-[1.375rem] tracking-[0.05em] leading-snug text-[var(--color-dark)]">
                      {info.nombre}
                    </span>
                    {info.sub && (
                      <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-oak)]">
                        {info.sub}
                      </span>
                    )}
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
