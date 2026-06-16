"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ============================================================
   Hero — v5 · Composición asimétrica (Opción 3)
   Escala de frase: COMPACTA (Opción A) → 25 / 34 / 40px.
   Sin logo central. Eyebrow + frase abajo a la izquierda,
   CTA como link subrayado con flecha.
   Misma identidad: paleta, fuentes e imagen sin cambios.
   ============================================================ */
export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src="/images/proyectos/hero-home.png"
        alt="Diseño de interiores — LOMEI Home"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay en degradado de esquina — más denso en la esquina inferior izquierda */}
      <div className="absolute inset-0 bg-[linear-gradient(70deg,rgba(42,33,24,0.78)_0%,rgba(42,33,24,0.43)_55%,rgba(42,33,24,0.27)_100%)]" />

      {/* Scrim superior para el navbar */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[var(--color-dark)]/55 to-transparent" />

      {/* Contenido — anclado abajo a la izquierda */}
      <div className="absolute left-0 right-0 bottom-0 z-10 flex flex-col items-start px-7 pb-20 md:px-16 md:pb-24">
        {/* Eyebrow con filete */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex items-center gap-3.5 text-[10px] md:text-xs font-normal tracking-[0.28em] uppercase text-[var(--color-white)]/75"
        >
          <span className="inline-block w-9 h-px bg-[var(--color-sand)]" />
          Arquitectura e Interiorismo · Querétaro
        </motion.span>

        {/* Frase — COMPACTA: 25px móvil · 34px md · 40px lg */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-5 max-w-full md:max-w-[58%] text-left font-serif text-[1.5625rem] md:text-[2.125rem] lg:text-[2.5rem] font-normal italic leading-[1.3] tracking-[0.015em] text-[var(--color-white)]/[0.97] [text-shadow:0_2px_28px_rgba(0,0,0,0.38)]"
        >
          &ldquo;Un espacio no solo se construye, se diseña para vivirse&rdquo;
        </motion.p>

        {/* CTA — link subrayado con flecha */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10"
        >
          <Link
            href="/proyectos"
            className="group inline-flex items-center gap-3 pb-2 text-[13px] font-normal tracking-[0.22em] uppercase text-[var(--color-white)] border-b border-[var(--color-white)]/55 transition-colors duration-300 hover:border-[var(--color-white)]"
          >
            Ver proyectos
            <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator — abajo a la derecha */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.2em] uppercase text-[var(--color-white)]/60">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-[var(--color-white)]/40 origin-top"
        />
      </motion.div>
    </section>
  );
}
