"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Movimiento {
  id: string;
  producto_id: string;
  tipo: string;
  cantidad: number;
  cantidad_antes: number;
  cantidad_despues: number;
  nota: string | null;
  creado_en: string;
  productos: { nombre: string; slug: string };
}

const TIPO_LABELS: Record<string, string> = {
  entrada: "Entrada",
  salida: "Salida",
  ajuste: "Ajuste",
  devolucion: "Devolución",
};

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`/api/inventario/movimientos?page=${page}&limit=30`);
      const json = await res.json();
      setMovimientos(json.data || []);
      setTotalPages(json.pagination?.pages || 1);
      setLoading(false);
    }
    fetchData();
  }, [page]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)] mb-4">
        <Link href="/admin/inventario" className="hover:text-[var(--color-oak)] transition-colors">
          Inventario
        </Link>
        <span>/</span>
        <span className="text-[var(--color-dark)]">Movimientos</span>
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
          Historial de movimientos
        </h1>
        <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
          Registro de todos los cambios de stock
        </p>
      </div>

      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
            Cargando movimientos...
          </div>
        ) : movimientos.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
            Sin movimientos registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sand)]/20">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Producto
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Tipo
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Cambio
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden md:table-cell">
                    Nota
                  </th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((mov) => (
                  <tr
                    key={mov.id}
                    className="border-b border-[var(--color-sand)]/10 hover:bg-[var(--color-linen)]/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[var(--color-warm-gray)]">
                      {formatDate(mov.creado_en)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/inventario/${mov.producto_id}`}
                        className="text-[var(--color-dark)] hover:text-[var(--color-oak)] transition-colors"
                      >
                        {mov.productos?.nombre || "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          mov.tipo === "entrada" || mov.tipo === "devolucion"
                            ? "text-green-600"
                            : mov.tipo === "salida"
                              ? "text-red-600"
                              : "text-amber-600"
                        }`}
                      >
                        {TIPO_LABELS[mov.tipo] || mov.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      <span className="text-[var(--color-warm-gray)]">
                        {mov.cantidad_antes}
                      </span>
                      <span className="mx-1 text-[var(--color-warm-gray)]">&rarr;</span>
                      <span className="font-medium text-[var(--color-dark)]">
                        {mov.cantidad_despues}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--color-warm-gray)] hidden md:table-cell">
                      {mov.nota || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-[var(--color-sand)]/20">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] disabled:opacity-30 transition-colors"
            >
              Anterior
            </button>
            <span className="text-xs text-[var(--color-warm-gray)]">
              {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] disabled:opacity-30 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
