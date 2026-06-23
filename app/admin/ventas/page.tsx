"use client";

import { useEffect, useState, useCallback } from "react";
import StatsCard from "@/components/admin/StatsCard";

interface VentaResumen {
  fecha: string;
  num_ordenes: number;
  total_ventas: number;
}

type Periodo = "hoy" | "semana" | "mes" | "año";

const PERIODOS: { key: Periodo; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "semana", label: "Semana" },
  { key: "mes", label: "Mes" },
  { key: "año", label: "Año" },
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

function getDateRange(periodo: Periodo): { desde: string; hasta: string } {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  switch (periodo) {
    case "hoy":
      return { desde: fmt(now), hasta: fmt(now) };
    case "semana": {
      const desde = new Date(now);
      desde.setDate(desde.getDate() - 6);
      return { desde: fmt(desde), hasta: fmt(now) };
    }
    case "mes": {
      const desde = new Date(now.getFullYear(), now.getMonth(), 1);
      const hasta = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { desde: fmt(desde), hasta: fmt(hasta) };
    }
    case "año": {
      const desde = new Date(now.getFullYear(), 0, 1);
      return { desde: fmt(desde), hasta: fmt(now) };
    }
  }
}

export default function VentasPage() {
  const [data, setData] = useState<VentaResumen[]>([]);
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { desde, hasta } = getDateRange(periodo);
      const params = new URLSearchParams({ desde, hasta });
      const res = await fetch(`/api/ventas/resumen?${params}`);
      const json = await res.json();
      setData(json.data || []);
    } catch {
      // silenciar errores de red
    }
    setLoading(false);
  }, [periodo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalVentas = data.reduce((sum, r) => sum + r.total_ventas, 0);
  const totalOrdenes = data.reduce((sum, r) => sum + r.num_ordenes, 0);
  const ticketPromedio = totalOrdenes > 0 ? totalVentas / totalOrdenes : 0;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
          Ventas
        </h1>
        <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
          Reporte de ventas por periodo
        </p>
      </div>

      {/* Filtros de periodo */}
      <div className="flex gap-2 flex-wrap mb-6">
        {PERIODOS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriodo(p.key)}
            className={`px-3 py-2 text-[10px] tracking-[0.15em] uppercase rounded-sm border transition-colors ${
              periodo === p.key
                ? "bg-[var(--color-dark)] text-white border-[var(--color-dark)]"
                : "bg-white text-[var(--color-warm-gray)] border-[var(--color-sand)]/40 hover:border-[var(--color-oak)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard label="Total ventas" value={formatPrice(totalVentas)} />
        <StatsCard label="Órdenes" value={totalOrdenes} />
        <StatsCard label="Ticket promedio" value={ticketPromedio > 0 ? formatPrice(ticketPromedio) : "$0"} />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
            Cargando...
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-[var(--color-warm-gray)]">
              No hay ventas registradas en este periodo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sand)]/20">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Fecha
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Órdenes
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--color-sand)]/10 hover:bg-[var(--color-linen)]/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-[var(--color-dark)]">
                      {formatDate(row.fecha)}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--color-dark)]">
                      {row.num_ordenes}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--color-dark)]">
                      {formatPrice(row.total_ventas)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
