"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src="/images/showroom/showroom-main.png"
        alt="Showroom LOMEI Home"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--color-dark)]/65" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] text-[var(--color-white)]"
        >
          LOMEI HOME
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-3 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[var(--color-sand)]"
        >
          Arquitectura e Interiorismo
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 font-serif text-lg md:text-2xl text-[var(--color-white)]/90 italic tracking-wide"
        >
          Espacios diseñados para vivirse
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-10"
        >
          <Link href="/proyectos">
            <Button
              variant="secondary"
              className="!border-[var(--color-white)]/50 !text-[var(--color-white)] hover:!bg-[var(--color-white)]/10"
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
        transition={{ duration: 0.6, delay: 1.6 }}
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
