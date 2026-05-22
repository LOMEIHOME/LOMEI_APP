"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-white)]/90 backdrop-blur-md border-b border-[var(--color-sand)]/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span
            className={`font-serif text-xl tracking-[0.15em] transition-colors duration-500 ${
              scrolled ? "text-[var(--color-dark)]" : "text-[var(--color-white)]"
            }`}
          >
            LOMEI HOME
          </span>
        </Link>

        {/* Links — desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-xs tracking-[0.2em] uppercase transition-colors duration-400 ${
                  scrolled
                    ? "text-[var(--color-warm-gray)] hover:text-[var(--color-dark)]"
                    : "text-[var(--color-white)]/70 hover:text-[var(--color-white)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
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
              className={`block w-6 h-[1px] transition-all duration-400 ${
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
                  className="text-sm tracking-[0.15em] uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] transition-colors duration-400"
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
