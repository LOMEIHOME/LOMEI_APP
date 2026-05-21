"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Proyecto } from "@/lib/data/proyectos";

interface Props {
  proyectos: Proyecto[];
  categories: string[];
}

export default function ProyectosFilterGrid({ proyectos, categories }: Props) {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos"
      ? proyectos
      : proyectos.filter((p) => p.category === active);

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-400 rounded-sm border ${
              active === cat
                ? "bg-[var(--color-dark)] text-[var(--color-white)] border-[var(--color-dark)]"
                : "bg-transparent text-[var(--color-warm-gray)] border-[var(--color-sand)] hover:border-[var(--color-dark)] hover:text-[var(--color-dark)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid asimétrico */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {filtered.map((p, i) => {
            // Patrón asimétrico: alternar entre cards grandes y pequeñas
            const isLarge = i % 3 === 0;
            const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
            const aspectRatio = isLarge ? "aspect-[16/10]" : "aspect-[4/3]";

            return (
              <Link
                key={p.slug}
                href={`/proyectos/${p.slug}`}
                className={`group block ${colSpan}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className={`relative ${aspectRatio} overflow-hidden rounded-sm`}
                  >
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={isLarge ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                    />
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-[var(--color-dark)]/0 group-hover:bg-[var(--color-dark)]/40 transition-all duration-500 flex items-end p-6">
                      <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                          {p.category} · {p.year}
                        </p>
                        <p className="mt-1 font-serif text-xl tracking-wider text-[var(--color-white)]">
                          {p.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info debajo de la imagen */}
                  <div className="mt-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                      {p.category} · {p.year}
                    </p>
                    <p className="mt-1 text-base font-serif tracking-wider text-[var(--color-dark)] group-hover:text-[var(--color-oak)] transition-colors duration-400">
                      {p.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-warm-gray)]">
                      {p.location}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
