"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/proyectos", label: "Proyectos" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar({ forceScrolled = false }: { forceScrolled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(forceScrolled);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(forceScrolled || window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-white)]/90 backdrop-blur-md border-b border-[var(--color-sand)]/30"
          : "bg-gradient-to-b from-[var(--color-dark)]/55 to-transparent"
      }`}
    >
      <div className="px-4 md:px-10 lg:px-12 py-4 flex items-center justify-between">
        {/* Izquierda — nombre en texto */}
        <Link
          href="/"
          className={`text-[13px] md:text-[14px] tracking-[0.25em] uppercase font-normal transition-colors duration-500 ${
            scrolled
              ? "text-[var(--color-dark)]"
              : "text-[var(--color-white)]"
          }`}
        >
          Lomei Home
        </Link>

        {/* Centro — monograma "L" */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 h-8 md:h-10 aspect-[3/4] block"
        >
          <Image
            src={scrolled ? "/images/logos/icon-dark.png" : "/images/logos/icon-white.png"}
            alt="LOMEI HOME"
            fill
            className="object-contain transition-opacity duration-500"
            sizes="40px"
            priority
          />
        </Link>

        {/* Derecha — links desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[13px] font-normal tracking-[0.2em] uppercase pb-1 border-b transition-colors duration-400 ${
                    scrolled
                      ? active
                        ? "text-[var(--color-dark)] border-[var(--color-camel)]/60"
                        : "text-[var(--color-dark)]/70 border-transparent hover:text-[var(--color-dark)]"
                      : active
                        ? "text-[var(--color-white)] border-[var(--color-white)]/70"
                        : "text-[var(--color-white)]/90 border-transparent hover:text-[var(--color-white)]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger — mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1.5"
          aria-label="Menú"
        >
          {[0, 1, 2].map((line) => (
            <span
              key={line}
              className={`block w-6 h-[1.5px] transition-all duration-400 ${
                scrolled ? "bg-[var(--color-dark)]" : "bg-[var(--color-white)]"
              } ${
                isOpen && line === 0 ? "rotate-45 translate-y-[3.5px]" : ""
              } ${
                isOpen && line === 1 ? "opacity-0" : ""
              } ${
                isOpen && line === 2 ? "-rotate-45 -translate-y-[3.5px]" : ""
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-white)] border-t border-[var(--color-sand)]/30 px-6 py-6">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm tracking-[0.15em] uppercase text-[var(--color-dark)]/70 hover:text-[var(--color-dark)] transition-colors duration-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
