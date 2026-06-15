"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

/* ============================================================
   Hero — v4
   Solo la frase + "Ver proyectos" (sin logo).
   La splash de apertura ahora es un componente aparte
   (SplashScreen.tsx) que cubre toda la página.
   ============================================================ */
export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src="/images/proyectos/paseo-de-claustros/01.jpg"
        alt="Paseo de Claustros — LOMEI Home"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_48%,rgba(42,33,24,0.74),rgba(42,33,24,0.54))]" />

      {/* Scrim superior para el navbar */}
      <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[var(--color-dark)]/55 to-transparent" />

      {/* Contenido — solo frase + CTA */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-2xl md:text-[2rem] lg:text-[2.5rem] font-normal text-[var(--color-white)]/[0.97] italic tracking-wide [text-shadow:0_2px_28px_rgba(0,0,0,0.4)] max-w-3xl mx-auto"
        >
          &ldquo;Un espacio no solo se construye,
          <br />
          se diseña para vivirse&rdquo;
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Link href="/proyectos">
            <Button
              variant="secondary"
              className="!border-[var(--color-white)]/70 !text-[var(--color-white)] !text-[13px] !px-9 !py-4 !bg-[var(--color-dark)]/10 backdrop-blur-[2px] hover:!bg-[var(--color-white)]/10"
            >
              Ver proyectos
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.2em] uppercase text-[var(--color-white)]/60">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-[var(--color-white)]/40 origin-top"
        />
      </motion.div>
    </section>
  );
}
