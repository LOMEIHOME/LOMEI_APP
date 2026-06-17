"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/Badge";
import FilterTabs from "@/components/ui/FilterTabs";
import type { Producto } from "@/lib/data/productos";
import { formatPrice } from "@/lib/data/productos";

interface Props {
  productos: Producto[];
  categories: string[];
}

/* ============================================================
   Catálogo — Opción B «Tarjetas tienda»
   Comprar es siempre visible (también en móvil):
   - Tarjetas sobre blanco cálido con precio en itálica
   - Botón «Agregar al carrito» permanente (44px de alto)
   - Toast de confirmación con «Ver carrito (n)» en desktop
   - Barra de carrito fija inferior en móvil
   ============================================================ */
export default function CatalogoFilterGrid({ productos, categories }: Props) {
  const [active, setActive] = useState("Todos");

  const filtered =
    active === "Todos"
      ? productos
      : productos.filter((p) => p.category === active);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: productos.length };
    for (const p of productos) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [productos]);

  return (
    <>
      {/* Filtros */}
      <div className="mb-6 md:mb-12">
        <FilterTabs
          categories={categories}
          active={active}
          onChange={setActive}
          counts={counts}
        />
      </div>

      {/* Grid de productos */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-6"
        >
          {filtered.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div className="group bg-[var(--color-white)] pb-2 md:pb-5 h-full flex flex-col overflow-hidden rounded-sm">
                <Link href={`/catalogo/${p.slug}`} className="block">
                  {/* Imagen */}
                  <div className="relative aspect-square md:aspect-[10/11] overflow-hidden">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    {p.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge>{p.badge}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-2 md:px-5 pt-1.5 md:pt-4 h-[4.5rem] md:h-[7rem] flex flex-col justify-between">
                    <div>
                      <p className="text-[8px] md:text-[10px] tracking-[0.2em] uppercase text-[var(--color-oak)]">
                        {p.category}
                      </p>
                      <p className="mt-0.5 font-serif text-[12px] md:text-lg lg:text-xl leading-snug tracking-[0.03em] text-[var(--color-dark)] line-clamp-2">
                        {p.name}
                      </p>
                    </div>
                    <p className="font-serif italic text-xs md:text-lg text-[var(--color-oak)]">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>

              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

    </>
  );
}
