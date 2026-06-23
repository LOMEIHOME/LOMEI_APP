"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

interface OrdenItem {
  id: string;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Orden {
  id: string;
  numero: number;
  estado: "pendiente" | "completada" | "cancelada";
  created_at: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string | null;
  subtotal: number;
  descuento: number;
  total: number;
  nota: string | null;
  items: OrdenItem[];
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

const ESTADOS: ("pendiente" | "completada" | "cancelada")[] = ["pendiente", "completada", "cancelada"];
const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
};

export default function OrdenDetallePage() {
  const params = useParams();
  const id = params.id as string;

  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrden = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/ordenes/${id}`);
      const json = await res.json();
      setOrden(json.data || null);
    } catch {
      // silenciar errores de red
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchOrden();
  }, [fetchOrden]);

  const handleChangeEstado = async (nuevoEstado: "pendiente" | "completada" | "cancelada") => {
    if (!orden || orden.estado === nuevoEstado) return;
    setUpdating(true);
    try {
      await fetch(`/api/ordenes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      await fetchOrden();
    } catch {
      // silenciar errores
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
        Cargando...
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="max-w-6xl">
        <Link
          href="/admin/ordenes"
          className="inline-flex items-center gap-1 text-sm text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors mb-4"
        >
          &larr; Órdenes
        </Link>
        <p className="text-sm text-[var(--color-warm-gray)]">Orden no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Breadcrumb */}
      <Link
        href="/admin/ordenes"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors mb-6"
      >
        &larr; Órdenes
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
          Orden #{String(orden.numero).padStart(4, "0")}
        </h1>
        <OrderStatusBadge estado={orden.estado} />
        <span className="text-sm text-[var(--color-warm-gray)]">
          {formatDate(orden.created_at)}
        </span>
      </div>

      {/* Tarjetas de info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Cliente */}
        <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5">
          <h3 className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-3">
            Cliente
          </h3>
          <div className="space-y-1.5 text-sm">
            <p className="text-[var(--color-dark)] font-medium">{orden.cliente_nombre}</p>
            <p className="text-[var(--color-warm-gray)]">{orden.cliente_email}</p>
            <p className="text-[var(--color-warm-gray)]">{orden.cliente_telefono || "—"}</p>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5">
          <h3 className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-3">
            Resumen
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-warm-gray)]">Subtotal</span>
              <span className="text-[var(--color-dark)]">{formatPrice(orden.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-warm-gray)]">Descuento</span>
              <span className="text-[var(--color-dark)]">{formatPrice(orden.descuento)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-sand)]/20 pt-1.5">
              <span className="text-[var(--color-dark)] font-medium">Total</span>
              <span className="text-[var(--color-dark)] font-medium">{formatPrice(orden.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de items */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-sand)]/20">
                <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                  Producto
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                  Cantidad
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden sm:table-cell">
                  Precio unitario
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {orden.items?.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--color-sand)]/10 hover:bg-[var(--color-linen)]/30 transition-colors"
                >
                  <td className="px-4 py-3 text-[var(--color-dark)]">
                    {item.producto_nombre}
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--color-dark)]">
                    {item.cantidad}
                  </td>
                  <td className="px-4 py-3 text-right text-[var(--color-warm-gray)] hidden sm:table-cell">
                    {formatPrice(item.precio_unitario)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--color-dark)]">
                    {formatPrice(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota */}
      {orden.nota && (
        <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5 mb-6">
          <h3 className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-2">
            Nota
          </h3>
          <p className="text-sm text-[var(--color-dark)]">{orden.nota}</p>
        </div>
      )}

      {/* Cambiar estado */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5">
        <h3 className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] mb-3">
          Cambiar estado
        </h3>
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => handleChangeEstado(e)}
              disabled={orden.estado === e || updating}
              className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm border transition-colors ${
                orden.estado === e
                  ? "bg-[var(--color-dark)] text-white border-[var(--color-dark)] cursor-default"
                  : "bg-white text-[var(--color-warm-gray)] border-[var(--color-sand)]/40 hover:border-[var(--color-oak)] hover:text-[var(--color-dark)]"
              } disabled:opacity-50`}
            >
              {ESTADO_LABELS[e]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
