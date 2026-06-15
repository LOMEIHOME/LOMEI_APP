import Link from "next/link";
import Image from "next/image";

/* ============================================================
   Footer — Opción B «Con CTA»
   Fila superior con invitación serif itálica + «Agenda una
   cita»; logo proporcional a 56px; links en linen para mejor
   contraste; barra inferior con copyright y ubicación.
   ============================================================ */
const FOOTER_LINKS = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-[var(--color-linen)] mt-auto">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 pt-20 pb-0">
        {/* CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[var(--color-warm-gray)]/25">
          <h2 className="font-serif font-light italic text-3xl md:text-[2.5rem] tracking-[0.04em] leading-tight text-[var(--color-white)]">
            ¿Tienes un proyecto
            <br />
            en mente?
          </h2>
          <Link
            href="/contacto"
            className="text-xs tracking-[0.2em] uppercase text-[var(--color-white)] border-b border-[var(--color-white)]/50 pb-1.5 hover:text-[var(--color-sand)] hover:border-[var(--color-sand)] transition-colors duration-400 whitespace-nowrap self-start md:self-auto"
          >
            Agenda una cita →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-12 mt-14">
          {/* Logo y tagline */}
          <div>
            <div className="relative h-14 aspect-[862/342]">
              <Image
                src="/images/logos/logo-white.png"
                alt="LOMEI HOME"
                fill
                className="object-contain object-left"
                sizes="142px"
              />
            </div>
            <p className="mt-5 font-serif italic text-[17px] text-[var(--color-sand)]">
              &ldquo;Espacios diseñados para vivirse&rdquo;
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-sand)]/80 mb-4">
              Navegación
            </p>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14.5px] font-light text-[var(--color-linen)] hover:text-[var(--color-white)] transition-colors duration-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-sand)]/80 mb-4">
              Contacto
            </p>
            <ul className="flex flex-col gap-2.5 text-[14.5px] font-light text-[var(--color-linen)]">
              <li>
                <a
                  href="https://instagram.com/lvinteriorismo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-white)] transition-colors duration-400"
                >
                  @lvinteriorismo
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@lomeihome.com"
                  className="hover:text-[var(--color-white)] transition-colors duration-400"
                >
                  contacto@lomeihome.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+524424874466"
                  className="hover:text-[var(--color-white)] transition-colors duration-400"
                >
                  442 487 4466
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 py-6 border-t border-[var(--color-warm-gray)]/25 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs font-light tracking-wider text-[var(--color-linen)]/60">
            &copy; {new Date().getFullYear()} LOMEI HOME. Todos los derechos
            reservados.
          </p>
          <p className="text-xs font-light tracking-wider text-[var(--color-linen)]/60">
            Querétaro, México
          </p>
        </div>
      </div>
    </footer>
  );
}
