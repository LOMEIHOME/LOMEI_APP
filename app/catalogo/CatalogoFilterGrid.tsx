"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/Badge";
import type { Producto } from "@/lib/data/productos";
import { formatPrice } from "@/lib/data/productos";

interface Props {
  productos: Producto[];
  categories: string[];
}

export default function CatalogoFilterGrid({ productos, categories }: Props) {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos"
      ? productos
      : productos.filter((p) => p.category === active);

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

      {/* Grid de productos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
        >
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <Link href={`/catalogo/${p.slug}`} className="group block">
                {/* Imagen */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--color-linen)]">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Badge */}
                  {p.badge && (
                    <div className="absolute top-3 left-3">
                      <Badge>{p.badge}</Badge>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[var(--color-dark)]/0 group-hover:bg-[var(--color-dark)]/20 transition-all duration-500 flex items-center justify-center">
                    <span className="px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase bg-[var(--color-white)] text-[var(--color-dark)] rounded-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Ver detalle
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
                    {p.category}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-dark)] group-hover:text-[var(--color-oak)] transition-colors duration-400">
                    {p.name}
                  </p>
                  <p className="mt-1 text-sm font-serif text-[var(--color-oak)]">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
