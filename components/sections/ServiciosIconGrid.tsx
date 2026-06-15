"use client";

import { SERVICIOS } from "@/lib/data/servicios";
import ServiceIcon from "@/components/ui/ServiceIcon";
import FadeIn from "./FadeIn";

/* ============================================================
   Retícula arquitectónica de servicios — Opción B
   Grid 4×2 (2×4 en móvil) con celdas separadas por hairlines
   sand; cada celda ancla con scroll suave a su sección de
   detalle. Icono + número + nombre + subtítulo, centrados.
   ============================================================ */
export default function ServiciosIconGrid() {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <div className="max-w-[73.75rem] mx-auto grid grid-cols-2 md:grid-cols-4 border-t border-l border-[var(--color-sand)]/55">
          {SERVICIOS.map((s, i) => (
            <FadeIn key={s.id} delay={0.06 * i} className="h-full">
              <button
                onClick={() => handleClick(s.id)}
                className="w-full h-full flex flex-col items-center gap-4 px-4 py-8 md:px-5 md:py-9 border-r border-b border-[var(--color-sand)]/55 text-center group cursor-pointer transition-colors duration-400 hover:bg-[var(--color-linen)]/40"
              >
                <ServiceIcon iconId={s.iconId} size="sm" className="md:!w-24 md:!h-24" />
                <span className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] tracking-[0.22em] text-[var(--color-warm-gray)]">
                    {s.num}
                  </span>
                  <span className="font-serif text-lg md:text-[1.3125rem] tracking-[0.05em] leading-snug text-[var(--color-dark)]">
                    {s.nombre}
                  </span>
                  {s.subtitulo && (
                    <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-oak)]">
                      {s.subtitulo}
                    </span>
                  )}
                </span>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
