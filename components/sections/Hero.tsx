"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("lomei-splash-seen");
    if (seen) {
      setShowSplash(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem("lomei-splash-seen", "true");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Splash / Portada */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--color-cream)]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative h-16 md:h-20 lg:h-24 w-72 md:w-96 lg:w-[28rem]"
            >
              <Image
                src="/images/logos/logo-dark.png"
                alt="LOMEI HOME — Arquitectura e Interiorismo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 288px, (max-width: 1024px) 384px, 448px"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagen de fondo */}
      <Image
        src="/images/proyectos/paseo-de-claustros/01.jpg"
        alt="Paseo de Claustros — LOMEI Home"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--color-dark)]/65" />

      {/* Contenido */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative h-16 md:h-20 lg:h-24 w-72 md:w-96 lg:w-[28rem] mx-auto"
        >
          <Image
            src="/images/logos/logo-white.png"
            alt="LOMEI HOME — Arquitectura e Interiorismo"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 288px, (max-width: 1024px) 384px, 448px"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 10 : 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 font-serif text-lg md:text-2xl text-[var(--color-white)]/90 italic tracking-wide"
        >
          Un espacio no solo se construye, se diseña para vivirse
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 10 : 0 }}
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
        animate={{ opacity: showSplash ? 0 : 1 }}
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
