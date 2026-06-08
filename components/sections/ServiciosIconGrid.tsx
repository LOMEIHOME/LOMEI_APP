"use client";

import { SERVICIOS } from "@/lib/data/servicios";
import ServiceIcon from "@/components/ui/ServiceIcon";
import FadeIn from "./FadeIn";

export default function ServiciosIconGrid() {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 max-w-5xl mx-auto">
          {SERVICIOS.map((s, i) => (
            <FadeIn key={s.id} delay={0.08 * i} className="h-full">
              <button
                onClick={() => handleClick(s.id)}
                className="flex flex-col items-center gap-3 group cursor-pointer w-32"
              >
                <ServiceIcon iconId={s.iconId} />
                <span className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] group-hover:text-[var(--color-camel)] transition-colors duration-400 text-center leading-snug h-8 flex items-start justify-center">
                  {s.subtitulo ? s.subtitulo : s.nombre}
                </span>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
