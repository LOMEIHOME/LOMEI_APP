import Link from "next/link";

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
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo y tagline */}
          <div>
            <p className="font-serif text-xl tracking-[0.15em] text-[var(--color-white)]">
              LOMEI HOME
            </p>
            <p className="mt-1 text-[10px] tracking-[0.25em] uppercase text-[var(--color-warm-gray)]">
              Arquitectura e Interiorismo
            </p>
            <p className="mt-4 text-sm text-[var(--color-warm-gray)] font-light italic font-serif">
              &ldquo;Espacios diseñados para vivirse&rdquo;
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-warm-gray)] mb-4">
              Navegación
            </p>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-sand)] hover:text-[var(--color-white)] transition-colors duration-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--color-warm-gray)] mb-4">
              Contacto
            </p>
            <ul className="flex flex-col gap-2 text-sm text-[var(--color-sand)]">
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
                  href="mailto:arqinteriorismolv@gmail.com"
                  className="hover:text-[var(--color-white)] transition-colors duration-400"
                >
                  arqinteriorismolv@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+527711009084"
                  className="hover:text-[var(--color-white)] transition-colors duration-400"
                >
                  771 100 90 84
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-[var(--color-warm-gray)]/20 text-center">
          <p className="text-xs text-[var(--color-warm-gray)] tracking-wider">
            &copy; {new Date().getFullYear()} LOMEI HOME. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
