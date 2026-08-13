import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import ShowroomCarousel from "@/components/sections/ShowroomCarousel";

/* ============================================================
   Nosotros — Server Component
   Usa CSS animations para fade-in (sin framer-motion JS).
   Solo el ShowroomCarousel es client component.
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

const EQUIPO = [
  {
    name: "Arq. Ana Lorena Vargas",
    role: "Directora Creativa",
    desc: "Fundadora de LOMEI HOME. Lidera cada proyecto desde el concepto hasta la entrega, cuidando que cada espacio refleje la esencia del cliente.",
    hasPhoto: true,
  },
  {
    name: "Próximamente",
    role: "Consultor de Obra",
    desc: "Supervisa y asesora la ejecución en sitio, garantizando que cada detalle constructivo se alinee con el proyecto arquitectónico.",
    hasPhoto: false,
  },
  {
    name: "Próximamente",
    role: "Redes Sociales",
    desc: "Gestiona la comunicación digital del estudio, creando contenido que refleja la identidad y el trabajo de LOMEI HOME.",
    hasPhoto: false,
  },
  {
    name: "Próximamente",
    role: "Diseño Web",
    desc: "Desarrolla y mantiene la presencia digital del estudio, asegurando una experiencia coherente con la identidad de la marca.",
    hasPhoto: false,
  },
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar forceScrolled />

      {/* Header */}
      <section className="bg-[var(--color-linen)] pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 text-center">
          <div className="animate-fade-in">
            <SectionTag>Nosotros</SectionTag>
          </div>
          <div className="animate-fade-in [animation-delay:100ms]">
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl tracking-wider text-[var(--color-dark)]">
              LOMEI HOME
            </h1>
          </div>
          <div className="animate-fade-in [animation-delay:200ms]">
            <p className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-[var(--color-dark)]/70">
              Arquitectura e Interiorismo · Querétaro, México
            </p>
          </div>
        </div>
      </section>

      {/* Historia del estudio */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="md:col-span-5 animate-fade-in">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-linen)]">
              <div className="relative w-full h-full py-16">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/images/showroom/arq-ana-lorena.webp"
                    alt="Arq. Ana Lorena Vargas Mejía"
                    fill
                    priority
                    className="object-cover object-[35%_25%]"
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="animate-fade-in">
              <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
                Historia
              </SectionTag>
            </div>
            <div className="animate-fade-in [animation-delay:100ms]">
              <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.75rem] tracking-wider text-[var(--color-dark)] leading-tight">
                Arq. Ana Lorena Vargas Mejía
              </h2>
              <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                Fundadora · LV Arquitectura e Interiorismo
              </p>
            </div>
            <div className="animate-fade-in [animation-delay:200ms]">
              <p className="mt-7 text-[15px] leading-relaxed text-[var(--color-dark)]/75">
                LV Arquitectura e Interiorismo nace en el 2023 con la intención
                de transformar espacios en hogares con identidad, dando vida al
                proyecto de LOMEI Home.
              </p>
            </div>
            <div className="animate-fade-in [animation-delay:250ms]">
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/75">
                Nuestra misión es diseñar y desarrollar proyectos residenciales y
                comerciales de manera integral, desde su arquitectura hasta el
                interior que se habita. Creamos propuestas donde la arquitectura y
                el interiorismo dialogan desde el origen del proyecto, generando
                espacios que reflejen fielmente la personalidad, estilo de vida y
                aspiraciones de cada cliente.
              </p>
            </div>
            <div className="animate-fade-in [animation-delay:350ms]">
              <blockquote className="mt-8 pl-6 border-l border-[var(--color-sand)]">
                <p className="font-serif text-base md:text-xl lg:text-2xl italic leading-snug text-[var(--color-camel)] tracking-wide">
                  &ldquo;Un espacio no solo se construye: se diseña para
                  vivirse.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* El Showroom — Carrusel (client component) */}
      <ShowroomCarousel />

      {/* Proceso de trabajo — línea de tiempo */}
      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="animate-fade-in">
          <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
            Cómo trabajamos
          </SectionTag>
        </div>
        <div className="animate-fade-in [animation-delay:100ms]">
          <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
            Nuestro proceso
          </h2>
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-5 gap-x-10 gap-y-6 md:gap-y-10">
          {PROCESO.map((step, i) => (
            <div
              key={step.num}
              className="animate-fade-in relative border-t border-[var(--color-sand)]/60 pt-6"
              style={{ animationDelay: `${100 * i}ms` }}
            >
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
          ))}
        </div>
      </section>

      {/* Nuestro equipo */}
      <section className="border-t border-[var(--color-sand)]/30 bg-[var(--color-linen)] py-16 md:py-24 lg:py-32">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <div className="animate-fade-in">
            <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
              El equipo
            </SectionTag>
          </div>
          <div className="animate-fade-in [animation-delay:100ms]">
            <h2 className="mt-4 font-serif text-2xl md:text-3xl lg:text-[2.625rem] tracking-wider text-[var(--color-dark)]">
              Quienes hacemos LOMEI
            </h2>
          </div>
          <div className="animate-fade-in [animation-delay:150ms]">
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/72 max-w-2xl">
              Un equipo multidisciplinario que comparte la pasión por crear
              espacios con identidad y propósito.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {EQUIPO.map((member, i) => (
              <div
                key={i}
                className="animate-fade-in"
                style={{ animationDelay: `${100 * i}ms` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--color-sand)]/20">
                  {member.hasPhoto ? (
                    <Image
                      src="/images/showroom/arq-ana-lorena.webp"
                      alt={member.name}
                      fill
                      className="object-cover object-[32%_25%]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                        Próximamente
                      </p>
                    </div>
                  )}
                </div>
                <h3 className="mt-5 font-serif text-xl tracking-[0.05em] text-[var(--color-dark)]">
                  {member.name}
                </h3>
                <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                  {member.role}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-dark)]/68">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
