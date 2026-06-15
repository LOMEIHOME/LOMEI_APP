"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ============================================================
   Splash Screen — Portada de apertura
   Cubre TODA la página (fixed z-50) hasta que el usuario
   haga clic en "Inicio". Se recuerda por sesión.
   ============================================================ */
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("lomei-splash-seen");
    if (seen) {
      setVisible(false);
    }
    setMounted(true);
  }, []);

  const handleEnter = () => {
    setVisible(false);
    sessionStorage.setItem("lomei-splash-seen", "true");
    document.body.style.overflow = "";
  };

  /* Bloquear scroll mientras la splash está visible */
  useEffect(() => {
    if (visible && mounted) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible, mounted]);

  /* No renderizar en el servidor ni si ya se vio */
  if (!mounted || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        >
          {/* Foto de fondo — showroom */}
          <Image
            src="/images/showroom/showroom-main.png"
            alt="Showroom LOMEI Home"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[var(--color-dark)]/55" />

          {/* Logo + botón */}
          <div className="relative z-10 flex flex-col items-center gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-80 md:w-[28rem] lg:w-[34rem] aspect-[862/342]"
            >
              <Image
                src="/images/logos/logo-white.png"
                alt="LOMEI HOME — Arquitectura e Interiorismo"
                fill
                className="object-contain [filter:drop-shadow(0_2px_24px_rgba(0,0,0,0.35))]"
                sizes="(max-width: 768px) 320px, (max-width: 1024px) 448px, 544px"
                priority
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              onClick={handleEnter}
              className="px-10 py-3.5 border border-[var(--color-white)]/60 text-[var(--color-white)] text-[12px] tracking-[0.25em] uppercase bg-[var(--color-dark)]/10 backdrop-blur-[2px] hover:bg-[var(--color-white)]/10 transition-colors duration-400 cursor-pointer rounded-sm"
            >
              Inicio
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
