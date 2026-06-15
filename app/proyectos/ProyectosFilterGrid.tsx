"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FilterTabs from "@/components/ui/FilterTabs";
import type { Proyecto } from "@/lib/data/proyectos";

interface Props {
  proyectos: Proyecto[];
  categories: string[];
}

/* ============================================================
   Proyectos — Opción B «Degradado permanente»
   Una sola fuente de información: número · categoría · año +
   nombre en serif, siempre visibles sobre un degradado
   inferior (también en móvil). Sin texto duplicado debajo.
   ============================================================ */
export default function ProyectosFilterGrid({ proyectos, categories }: Props) {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos"
      ? proyectos
      : proyectos.filter((p) => p.category === active);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: proyectos.length };
    for (const p of proyectos) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [proyectos]);

  return (
    <>
      {/* Filtros */}
      <div className="mb-12">
        <FilterTabs
          categories={categories}
          active={active}
          onChange={setActive}
          counts={counts}
        />
      </div>

      {/* Grid asimétrico */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-5"
        >
          {filtered.map((p, i) => {
            // Patrón asimétrico: alternar entre cards grandes y pequeñas
            const isLarge = i % 3 === 0;
            const colSpan = isLarge ? "md:col-span-7" : "md:col-span-5";
            const aspectRatio = isLarge ? "aspect-[16/10]" : "aspect-[4/3]";
            const num = String(i + 1).padStart(2, "0");

            return (
              <Link
                key={p.slug}
                href={`/proyectos/${p.slug}`}
                className={`group block ${colSpan}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
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
                    {/* Degradado permanente — caption siempre visible */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,33,24,0.72)] via-[rgba(42,33,24,0.16)] via-45% to-transparent flex items-end p-5 md:p-6">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10.5px] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                          {num} · {p.category} · {p.year}
                        </p>
                        <p className="font-serif text-xl md:text-[1.5625rem] tracking-wider text-[var(--color-white)]">
                          {p.title}
                        </p>
                      </div>
                    </div>
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
