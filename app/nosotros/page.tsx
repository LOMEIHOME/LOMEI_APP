import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "@/components/sections/FadeIn";

const PROCESO = [
  {
    num: "01",
    title: "Brief",
    desc: "Escuchamos tus necesidades, estilo de vida y aspiraciones para entender la esencia de tu proyecto.",
  },
  {
    num: "02",
    title: "Concepto",
    desc: "Desarrollamos un moodboard, paleta de materiales y propuesta conceptual que traduce tus ideas en un lenguaje visual.",
  },
  {
    num: "03",
    title: "Desarrollo",
    desc: "Creamos planos, renders 3D y especificaciones técnicas para visualizar cada detalle antes de construir.",
  },
  {
    num: "04",
    title: "Ejecución",
    desc: "Coordinamos proveedores, supervisamos obra y cuidamos que cada acabado se instale conforme al diseño.",
  },
  {
    num: "05",
    title: "Entrega",
    desc: "Recorrido final, ajustes de detalle y la satisfacción de entregarte un espacio diseñado para vivirse.",
  },
];

const SHOWROOM_SPACES = [
  {
    title: "Mesa de trabajo",
    desc: "Espacio para asesorías con clientes y presentación de proyectos en renders y planos.",
  },
  {
    title: "Mueble Repisero",
    desc: "Exhibición de muestras de distintos acabados: telas, piedras naturales, placas y accesorios.",
  },
  {
    title: "Coffee Station",
    desc: "Área de bebidas para ofrecer una experiencia cálida durante la visita al showroom.",
  },
  {
    title: "Set Recibidor",
    desc: "Un espacio que muestra cómo creamos cotidianamente un ambiente acogedor de hogar.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/showroom/fachada.png"
          alt="Fachada Showroom LOMEI Home"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <SectionTag className="!text-[var(--color-sand)]">
                Nosotros
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-3 font-serif text-4xl md:text-6xl tracking-wider text-[var(--color-white)]">
                LOMEI Home
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-2 text-sm text-[var(--color-white)]/70">
                Arquitectura e Interiorismo · Querétaro, México
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Historia del estudio */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="md:col-span-5">
            <FadeIn>
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                <Image
                  src="/images/showroom/sala-recibidor.png"
                  alt="Arq. Ana Lorena Vargas Mejía"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-7">
            <FadeIn>
              <SectionTag>Historia</SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl tracking-wider text-[var(--color-dark)] leading-tight">
                Arq. Ana Lorena Vargas Mejía
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-6 text-sm leading-relaxed text-[var(--color-warm-gray)]">
                LV Arquitectura e Interiorismo nace en el 2023 con la intención
                de transformar espacios en hogares con identidad, dando vida al
                proyecto de LOMEI Home.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-warm-gray)]">
                Nuestra misión es diseñar y desarrollar proyectos residenciales y
                comerciales de manera integral, desde su arquitectura hasta el
                interior que se habita. Creamos propuestas donde la arquitectura y
                el interiorismo dialogan desde el origen del proyecto, generando
                espacios que reflejen fielmente la personalidad, estilo de vida y
                aspiraciones de cada cliente.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-warm-gray)]">
                Acompañamos a las personas en el descubrimiento de su esencia
                estética y funcional, traduciendo sus historias en entornos que
                transmiten bienestar, armonía y sentido de pertenencia.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <blockquote className="mt-8 pl-6 border-l-2 border-[var(--color-oak)]">
                <p className="font-serif text-lg italic text-[var(--color-oak)] tracking-wide">
                  &ldquo;Un espacio no solo se construye: se diseña para
                  vivirse.&rdquo;
                </p>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* El Showroom */}
      <section className="bg-[var(--color-linen)] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <SectionTag>El showroom</SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl tracking-wider text-[var(--color-dark)]">
              Nuestro espacio
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-sm text-[var(--color-warm-gray)] max-w-2xl">
              El showroom de LOMEI Home es un espacio diseñado para que nuestros
              clientes experimenten los materiales, acabados y la estética del
              estudio en persona. Aquí, cada rincón cuenta una historia.
            </p>
          </FadeIn>

          {/* Renders del showroom */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeIn>
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                <Image
                  src="/images/showroom/showroom-main.png"
                  alt="Vista principal del showroom"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                <Image
                  src="/images/showroom/showroom-led.png"
                  alt="Iluminación LED del showroom"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>

          {/* Espacios */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SHOWROOM_SPACES.map((s, i) => (
              <FadeIn key={s.title} delay={0.1 * i}>
                <div className="border-t border-[var(--color-sand)]/50 pt-5">
                  <h3 className="font-serif text-lg tracking-wider text-[var(--color-dark)]">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-warm-gray)]">
                    {s.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Materiales */}
          <FadeIn delay={0.2}>
            <div className="mt-12 bg-[var(--color-cream)] rounded-sm p-8">
              <SectionTag>Materiales del showroom</SectionTag>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  "Encino natural",
                  "Silestone",
                  "Nanocal",
                  "Porcelánico tipo concreto",
                  "Tapicería neutra",
                  "Vinil camel",
                  "LED indirecta",
                ].map((m) => (
                  <span
                    key={m}
                    className="px-4 py-2 text-[10px] tracking-[0.15em] uppercase bg-[var(--color-linen)] text-[var(--color-oak)] rounded-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Proceso de trabajo */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <FadeIn>
          <SectionTag>Cómo trabajamos</SectionTag>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl tracking-wider text-[var(--color-dark)]">
            Nuestro proceso
          </h2>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-8">
          {PROCESO.map((step, i) => (
            <FadeIn key={step.num} delay={0.1 * i}>
              <div className="relative">
                {/* Línea conectora (desktop) */}
                {i < PROCESO.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-[0.5px] bg-[var(--color-sand)]/50" />
                )}
                <p className="font-serif text-3xl text-[var(--color-sand)]">
                  {step.num}
                </p>
                <h3 className="mt-3 font-serif text-lg tracking-wider text-[var(--color-dark)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-warm-gray)]">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
