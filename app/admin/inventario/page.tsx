"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import SearchInput from "@/components/admin/SearchInput";
import StatusBadge, { getStockStatus } from "@/components/admin/StatusBadge";

const CATEGORIAS = [
  "Todos",
  "Muebles",
  "Cojines & Textiles",
  "Adornos",
  "Iluminación",
  "Alfombras",
  "Acabados",
];

interface InventarioItem {
  id: string;
  producto_id: string;
  cantidad: number;
  ubicacion: string;
  stock_minimo: number;
  productos: {
    id: string;
    nombre: string;
    slug: string;
    categoria: string;
    sku: string | null;
    precio_venta: number;
    imagen_url: string | null;
    activo: boolean;
  };
}

export default function InventarioPage() {
  const [items, setItems] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoria) params.set("categoria", categoria);

    const res = await fetch(`/api/inventario?${params}`);
    const json = await res.json();
    setItems(json.data || []);
    setLoading(false);
  }, [search, categoria]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
            Inventario
          </h1>
          <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
            {items.length} producto{items.length !== 1 ? "s" : ""} registrado{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/inventario/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-dark)] text-white text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre o SKU..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS.map((cat) => {
            const isActive = cat === "Todos" ? !categoria : categoria === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoria(cat === "Todos" ? "" : cat)}
                className={`px-3 py-2 text-[10px] tracking-[0.15em] uppercase rounded-sm border transition-colors ${
                  isActive
                    ? "bg-[var(--color-dark)] text-white border-[var(--color-dark)]"
                    : "bg-white text-[var(--color-warm-gray)] border-[var(--color-sand)]/40 hover:border-[var(--color-oak)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
            Cargando inventario...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[var(--color-warm-gray)]">
              No hay productos en el inventario.
            </p>
            <Link
              href="/admin/inventario/nuevo"
              className="inline-block mt-4 text-xs text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors"
            >
              Agregar primer producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sand)]/20">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Producto
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden md:table-cell">
                    Categoría
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden sm:table-cell">
                    SKU
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Stock
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden sm:table-cell">
                    Precio
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const status = getStockStatus(item.cantidad, item.stock_minimo);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--color-sand)]/10 hover:bg-[var(--color-linen)]/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/inventario/${item.productos.id}`}
                          className="text-[var(--color-dark)] hover:text-[var(--color-oak)] transition-colors font-medium"
                        >
                          {item.productos.nombre}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-warm-gray)] hidden md:table-cell">
                        {item.productos.categoria}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-warm-gray)] hidden sm:table-cell font-mono text-xs">
                        {item.productos.sku || "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--color-dark)]">
                        {item.cantidad}
                        <span className="text-[var(--color-warm-gray)] text-xs ml-1">
                          / mín {item.stock_minimo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell text-[var(--color-dark)]">
                        {formatPrice(item.productos.precio_venta)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
