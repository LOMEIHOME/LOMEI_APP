"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import SearchInput from "@/components/admin/SearchInput";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

type EstadoFilter = "" | "pendiente" | "completada" | "cancelada";

interface Orden {
  id: string;
  numero: number;
  cliente_nombre: string;
  created_at: string;
  total: number;
  estado: "pendiente" | "completada" | "cancelada";
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
}

const ESTADOS: { key: EstadoFilter; label: string }[] = [
  { key: "", label: "Todas" },
  { key: "pendiente", label: "Pendiente" },
  { key: "completada", label: "Completada" },
  { key: "cancelada", label: "Cancelada" },
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<EstadoFilter>("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (estado) params.set("estado", estado);
      if (search) params.set("search", search);
      params.set("page", String(page));

      const res = await fetch(`/api/ordenes?${params}`);
      const json = await res.json();
      setOrdenes(json.data || []);
      if (json.pagination) setPagination(json.pagination);
    } catch {
      // silenciar errores de red
    }
    setLoading(false);
  }, [estado, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reiniciar página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [estado, search]);

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
          Órdenes
        </h1>
        <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
          {pagination.total} orden{pagination.total !== 1 ? "es" : ""} registrada{pagination.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por número o cliente..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map((e) => {
            const isActive = estado === e.key;
            return (
              <button
                key={e.key}
                onClick={() => setEstado(e.key)}
                className={`px-3 py-2 text-[10px] tracking-[0.15em] uppercase rounded-sm border transition-colors ${
                  isActive
                    ? "bg-[var(--color-dark)] text-white border-[var(--color-dark)]"
                    : "bg-white text-[var(--color-warm-gray)] border-[var(--color-sand)]/40 hover:border-[var(--color-oak)]"
                }`}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
            Cargando...
          </div>
        ) : ordenes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[var(--color-warm-gray)]">
              No hay órdenes que mostrar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sand)]/20">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Número
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Cliente
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden sm:table-cell">
                    Fecha
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Total
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Estado
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-[var(--color-sand)]/10 hover:bg-[var(--color-linen)]/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--color-dark)]">
                      #{String(o.numero).padStart(4, "0")}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-dark)]">
                      {o.cliente_nombre}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-warm-gray)] hidden sm:table-cell">
                      {formatDate(o.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--color-dark)]">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <OrderStatusBadge estado={o.estado} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/ordenes/${o.id}`}
                        className="text-xs text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs rounded-sm border transition-colors ${
                page === p
                  ? "bg-[var(--color-dark)] text-white border-[var(--color-dark)]"
                  : "bg-white text-[var(--color-warm-gray)] border-[var(--color-sand)]/40 hover:border-[var(--color-oak)]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
