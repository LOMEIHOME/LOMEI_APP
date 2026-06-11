import Link from "next/link";
import SectionTag from "@/components/ui/SectionTag";
import Button from "@/components/ui/Button";
import FadeIn from "./FadeIn";
import { SERVICIOS } from "@/lib/data/servicios";

const FEATURED_IDS = ["interiorismo", "proyecto-ejecutivo", "paisajismo", "custom-design"];
const FEATURED = SERVICIOS.filter((s) => FEATURED_IDS.includes(s.id));

export default function ServicesStrip() {
  return (
    <section className="bg-[var(--color-dark)] py-24 md:py-32">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
        <FadeIn>
          <SectionTag className="!text-[var(--color-warm-gray)]">
            Nuestros servicios
          </SectionTag>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {FEATURED.map((s, i) => (
            <FadeIn key={s.id} delay={0.15 * i}>
              <div className="border-t border-[var(--color-warm-gray)]/20 pt-6 group">
                <p className="text-[10px] tracking-[0.2em] text-[var(--color-warm-gray)]">
                  {s.num}
                </p>
                <h3 className="mt-4 font-serif text-xl md:text-2xl tracking-wider text-[var(--color-white)] group-hover:text-[var(--color-sand)] transition-colors duration-500">
                  {s.nombre}
                </h3>
                <p className="mt-4 text-sm text-[var(--color-warm-gray)] leading-relaxed">
                  {s.descripcion.slice(0, 120)}...
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.7}>
          <div className="mt-14 text-center">
            <Link href="/servicios">
              <Button
                variant="secondary"
                className="!border-[var(--color-white)]/50 !text-[var(--color-white)] hover:!bg-[var(--color-white)]/10"
              >
                Ver todos los servicios
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
