import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "@/components/sections/FadeIn";

/* ============================================================
   Nosotros — propuesta completa
   Contraste del cuerpo (15px dark/75), cita en camel con
   hairline (eco del About de la home), proceso como línea de
   tiempo y materiales como chips delineados.
   ============================================================ */
const PROCESO = [
  {
    num: "01",
    title: "Brief",
    desc: "Escuchamos tus necesidades, estilo de vida y aspiraciones para entender la esencia de tu proyecto.",
  },
  {
    num: "02",
    title: "Concepto",
    desc: "Moodboard, paleta de materiales y propuesta conceptual que traduce tus ideas en un lenguaje visual.",
  },
  {
    num: "03",
    title: "Desarrollo",
    desc: "Planos, renders 3D y especificaciones técnicas para visualizar cada detalle antes de construir.",
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
    title: "Mueble repisero",
    desc: "Exhibición de muestras de distintos acabados: telas, piedras naturales, placas y accesorios.",
  },
  {
    title: "Coffee station",
    desc: "Área de bebidas para ofrecer una experiencia cálida durante la visita al showroom.",
  },
  {
    title: "Set recibidor",
    desc: "Un espacio que muestra cómo creamos cotidianamente un ambiente acogedor de hogar.",
  },
];

const MATERIALES = [
  "Encino natural",
  "Silestone",
  "Nanocal",
  "Porcelánico tipo concreto",
  "Tapicería neutra",
  "Vinil camel",
  "LED indirecta",
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src="/images/showroom/fachada.png"
          alt="Fachada Showroom LOMEI Home"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)]/65 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 lg:px-16 py-8 md:py-12">
          <div className="max-w-[85rem] mx-auto">
            <FadeIn>
              <SectionTag className="!text-[11px] !text-[var(--color-sand)]">
                Nosotros
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-3 font-serif text-3xl md:text-4xl lg:text-6xl tracking-wider text-[var(--color-white)]">
                LOMEI Home
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-2 text-sm tracking-[0.08em] text-[var(--color-white)]/85">
                Arquitectura e Interiorismo · Querétaro, México
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Historia del estudio */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
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
              <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
                Historia
              </SectionTag>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.75rem] tracking-wider text-[var(--color-dark)] leading-tight">
                Arq. Ana Lorena Vargas Mejía
              </h2>
              <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                Fundadora · LV Arquitectura e Interiorismo
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-7 text-[15px] leading-relaxed text-[var(--color-dark)]/75">
                LV Arquitectura e Interiorismo nace en el 2023 con la intención
                de transformar espacios en hogares con identidad, dando vida al
                proyecto de LOMEI Home.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/75">
                Nuestra misión es diseñar y desarrollar proyectos residenciales y
                comerciales de manera integral, desde su arquitectura hasta el
                interior que se habita. Creamos propuestas donde la arquitectura y
                el interiorismo dialogan desde el origen del proyecto, generando
                espacios que reflejen fielmente la personalidad, estilo de vida y
                aspiraciones de cada cliente.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <blockquote className="mt-8 pl-6 border-l border-[var(--color-sand)]">
                <p className="font-serif text-base md:text-xl lg:text-2xl italic leading-snug text-[var(--color-camel)] tracking-wide">
                  &ldquo;Un espacio no solo se construye: se diseña para
                  vivirse.&rdquo;
                </p>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* El Showroom */}
      <section className="bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <FadeIn>
            <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
              El showroom
            </SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
              Nuestro espacio
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/72 max-w-2xl">
              Un espacio diseñado para que nuestros clientes experimenten los
              materiales, acabados y la estética del estudio en persona. Aquí,
              cada rincón cuenta una historia.
            </p>
          </FadeIn>

          {/* Renders del showroom */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {SHOWROOM_SPACES.map((s, i) => (
              <FadeIn key={s.title} delay={0.1 * i}>
                <div className="border-t border-[var(--color-sand)]/60 pt-5">
                  <h3 className="font-serif text-xl tracking-[0.05em] text-[var(--color-dark)]">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--color-dark)]/68">
                    {s.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Materiales */}
          <FadeIn delay={0.2}>
            <div className="mt-12 border-t border-[var(--color-sand)]/60 pt-7 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-6">
              <span className="text-[11px] tracking-[0.22em] uppercase text-[var(--color-oak)] whitespace-nowrap">
                Materiales
              </span>
              <div className="flex flex-wrap gap-2.5">
                {MATERIALES.map((m) => (
                  <span
                    key={m}
                    className="px-3.5 py-2 text-[11px] tracking-[0.14em] uppercase border border-[var(--color-sand)]/90 text-[var(--color-camel)] rounded-sm"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Proceso de trabajo — línea de tiempo */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <FadeIn>
          <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
            Cómo trabajamos
          </SectionTag>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
            Nuestro proceso
          </h2>
        </FadeIn>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-5 gap-x-10 gap-y-6 md:gap-y-10">
          {PROCESO.map((step, i) => (
            <FadeIn key={step.num} delay={0.1 * i}>
              <div className="relative border-t border-[var(--color-sand)]/60 pt-6">
                {/* Punto en la línea de tiempo */}
                <span
                  className={`absolute -top-1 left-0 w-[7px] h-[7px] rounded-full ${
                    i === 0
                      ? "bg-[var(--color-camel)]"
                      : "bg-[var(--color-sand)]"
                  }`}
                />
                <p className="font-serif font-light text-2xl md:text-4xl leading-none text-[var(--color-oak)]/55">
                  {step.num}
                </p>
                <h3 className="mt-3.5 font-serif text-[1.3125rem] tracking-[0.06em] text-[var(--color-dark)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--color-dark)]/68">
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
