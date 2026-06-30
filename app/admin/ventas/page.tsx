"use client";

import { useEffect, useState, useCallback } from "react";

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
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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

/* Etiqueta corta para el eje del chart */
function shortLabel(fecha: string, periodo: Periodo): string {
  const d = new Date(fecha);
  switch (periodo) {
    case "hoy":
      return d.toLocaleTimeString("es-MX", { hour: "2-digit" });
    case "semana":
      return d.toLocaleDateString("es-MX", { weekday: "short" }).slice(0, 3);
    case "mes":
      return d.getDate().toString();
    case "año":
      return d.toLocaleDateString("es-MX", { month: "short" }).slice(0, 3);
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

  /* Valor máximo para escalar las barras del chart */
  const maxVenta = Math.max(...data.map((r) => r.total_ventas), 1);

  return (
    <div style={{ maxWidth: 1180 }} className="mx-auto">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1
          className="font-bold"
          style={{ fontSize: 28, color: "#37352f", lineHeight: 1.2 }}
        >
          💰 Ventas
        </h1>
        <p className="mt-1" style={{ fontSize: 14, color: "#8b867c" }}>
          Reporte de ventas por periodo
        </p>
      </div>

      {/* ── Filtros de periodo (chips) ── */}
      <div className="flex flex-wrap mb-6" style={{ gap: 7 }}>
        {PERIODOS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriodo(p.key)}
            className="transition-colors"
            style={{
              fontSize: 12,
              padding: "7px 13px",
              borderRadius: 8,
              border: "1px solid",
              borderColor: periodo === p.key ? "#37352f" : "#e6e3db",
              background: periodo === p.key ? "#37352f" : "#fff",
              color: periodo === p.key ? "#fff" : "#6b6760",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total ventas", value: formatPrice(totalVentas) },
          { label: "Órdenes", value: totalOrdenes.toString() },
          {
            label: "Ticket promedio",
            value: ticketPromedio > 0 ? formatPrice(ticketPromedio) : "$0",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: "#f8f7f4",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <p style={{ fontSize: 12.5, color: "#8b867c" }}>{kpi.label}</p>
            <p
              className="font-bold"
              style={{ fontSize: 27, color: "#37352f", marginTop: 6 }}
            >
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Chart: Tendencia del periodo ── */}
      {!loading && data.length > 0 && (
        <div
          className="mb-6"
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            padding: "20px 22px",
          }}
        >
          <p
            className="font-bold mb-4"
            style={{ fontSize: 13.5, color: "#37352f" }}
          >
            Tendencia del periodo
          </p>

          <div
            className="flex items-end"
            style={{ gap: 6, height: 140, overflow: "hidden" }}
          >
            {data.map((row, i) => {
              const pct = (row.total_ventas / maxVenta) * 100;
              const isLast = i === data.length - 1;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1"
                  style={{ maxWidth: 46 }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max(pct, 4)}%`,
                      background: isLast ? "#37352f" : "#e3ddd0",
                      borderRadius: "6px 6px 0 0",
                      minHeight: 4,
                      transition: "height 0.3s ease",
                    }}
                  />
                  <span
                    className="mt-1 text-center block truncate w-full"
                    style={{ fontSize: 10.5, color: "#9b968c" }}
                  >
                    {shortLabel(row.fecha, periodo)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tabla de ventas ── */}
      <div
        style={{
          border: "1px solid #eeece7",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            className="text-center"
            style={{ padding: 48, fontSize: 14, color: "#9b968c" }}
          >
            Cargando...
          </div>
        ) : data.length === 0 ? (
          <div
            className="text-center"
            style={{ padding: 48, fontSize: 14, color: "#9b968c" }}
          >
            No hay ventas registradas en este periodo.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f7f4" }}>
                  <th
                    className="text-left font-medium"
                    style={{
                      padding: "10px 16px",
                      fontSize: 11,
                      color: "#9b968c",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Periodo
                  </th>
                  <th
                    className="text-right font-medium"
                    style={{
                      padding: "10px 16px",
                      fontSize: 11,
                      color: "#9b968c",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Órdenes
                  </th>
                  <th
                    className="text-right font-medium"
                    style={{
                      padding: "10px 16px",
                      fontSize: 11,
                      color: "#9b968c",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className="transition-colors"
                    style={{ borderTop: "1px solid #f1efe9" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#faf9f6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "10px 16px",
                        fontSize: 13,
                        color: "#37352f",
                      }}
                    >
                      {formatDate(row.fecha)}
                    </td>
                    <td
                      className="text-right"
                      style={{
                        padding: "10px 16px",
                        fontSize: 13,
                        color: "#37352f",
                      }}
                    >
                      {row.num_ordenes}
                    </td>
                    <td
                      className="text-right font-medium"
                      style={{
                        padding: "10px 16px",
                        fontSize: 13,
                        color: "#37352f",
                      }}
                    >
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
