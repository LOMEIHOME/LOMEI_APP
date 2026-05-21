import Image from "next/image";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "./FadeIn";

export default function AboutPreview() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
        {/* Texto — 5 columnas */}
        <div className="md:col-span-5">
          <FadeIn>
            <SectionTag>Sobre el estudio</SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl tracking-wider text-[var(--color-dark)] leading-tight">
              Diseño con alma propia
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-warm-gray)]">
              En LOMEI Home creemos que un espacio no solo se construye: se diseña
              para vivirse. Acompañamos a las personas en el descubrimiento de su
              esencia estética y funcional, traduciendo sus historias en entornos
              que transmiten bienestar, armonía y sentido de pertenencia.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-warm-gray)]">
              Creamos propuestas donde la arquitectura y el interiorismo dialogan
              desde el origen del proyecto, generando espacios que reflejen
              fielmente la personalidad, estilo de vida y aspiraciones de cada
              cliente.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mt-10 flex gap-12">
              <div>
                <p className="font-serif text-3xl text-[var(--color-oak)]">2+</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mt-1">
                  Años
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[var(--color-oak)]">10+</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mt-1">
                  Proyectos
                </p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[var(--color-oak)]">QRO</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mt-1">
                  Querétaro
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Imagen — 7 columnas */}
        <div className="md:col-span-7">
          <FadeIn direction="right" delay={0.2}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/images/showroom/sala-recibidor.png"
                alt="Sala de recibidor LOMEI Home"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
