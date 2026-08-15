"use client";

import { useMemo, useState, useRef, useEffect } from "react";
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

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function CatalogoFilterGrid({ productos, categories }: Props) {
  const [active, setActive] = useState("Todos");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K para enfocar buscador
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    let results = active === "Todos"
      ? productos
      : productos.filter((p) => p.category === active);

    if (query.trim()) {
      const q = normalize(query.trim());
      results = results.filter((p) =>
        normalize(p.name).includes(q) ||
        normalize(p.category).includes(q) ||
        p.materials?.some((m) => normalize(m).includes(q)) ||
        normalize(p.description || "").includes(q)
      );
    }

    return results;
  }, [productos, active, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: productos.length };
    for (const p of productos) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [productos]);

  return (
    <div className="w-full">
      {/* Buscador + Filtros */}
      <div className="mb-5 md:mb-12 space-y-3 md:space-y-5">
        {/* Buscador */}
        <div className="relative">
          <div
            className={`flex items-center gap-2.5 border rounded-sm px-3 md:px-4 py-2.5 md:py-3 transition-colors duration-300 ${
              focused
                ? "border-[var(--color-camel)] bg-white"
                : "border-[var(--color-sand)]/60 bg-[var(--color-white)]"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[var(--color-warm-gray)] shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Buscar producto..."
              className="flex-1 bg-transparent text-[13px] md:text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)] outline-none tracking-wide"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            <span className="hidden md:inline text-[10px] tracking-wider text-[var(--color-warm-gray)] border border-[var(--color-sand)]/50 rounded px-1.5 py-0.5">
              ⌘K
            </span>
          </div>
        </div>

        {/* Filtros */}
        <FilterTabs
          categories={categories}
          active={active}
          onChange={setActive}
          counts={counts}
        />
      </div>

      {/* Resultado de búsqueda */}
      {query.trim() && (
        <p className="text-xs tracking-wider text-[var(--color-warm-gray)] mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Grid de productos — 1 col móvil, 2 tablet, 3 desktop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active + query}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {filtered.map((p, i) => (
            <Link
              key={p.slug}
              href={`/catalogo/${p.slug}`}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover md:scale-[0.97] transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {p.badge && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3">
                      <Badge>{p.badge}</Badge>
                    </div>
                  )}
                  {/* Overlay — gradiente solo en la parte inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,33,24,0.92)] from-0% via-[rgba(42,33,24,0.45)] via-35% to-transparent to-55% flex items-end p-3 md:p-6">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[9px] md:text-[10.5px] tracking-[0.2em] uppercase text-[var(--color-sand)]">
                        {p.category}
                      </p>
                      <p className="font-serif text-[13px] md:text-xl tracking-normal md:tracking-wide text-[var(--color-white)] text-left leading-snug">
                        {p.name}
                      </p>
                      <p className="font-serif italic text-sm md:text-base text-[var(--color-sand)]">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Sin resultados */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-serif text-xl text-[var(--color-dark)]/60">
            No se encontraron productos
          </p>
          <p className="text-sm text-[var(--color-warm-gray)] mt-2">
            Intenta con otro término o categoría
          </p>
          <button
            onClick={() => { setQuery(""); setActive("Todos"); }}
            className="mt-4 text-xs tracking-[0.15em] uppercase text-[var(--color-camel)] border-b border-[var(--color-camel)]/40 pb-1 hover:text-[var(--color-dark)] transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
}
