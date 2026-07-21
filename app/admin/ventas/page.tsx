"use client";

import { useEffect, useState, useCallback } from "react";

interface VentaResumen {
  fecha: string;
  num_ordenes: number;
  total_ventas: number;
}

interface OrdenDetalle {
  id: string;
  numero: number;
  cliente_nombre: string;
  total: number;
  creado_en: string;
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

function getDateRange(periodo: Periodo, offset = 0): { desde: string; hasta: string } {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  switch (periodo) {
    case "hoy": {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      return { desde: fmt(d), hasta: fmt(d) };
    }
    case "semana": {
      const hasta = new Date(now);
      hasta.setDate(hasta.getDate() + offset * 7);
      const desde = new Date(hasta);
      desde.setDate(desde.getDate() - 6);
      return { desde: fmt(desde), hasta: fmt(hasta) };
    }
    case "mes": {
      const desde = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const hasta = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
      return { desde: fmt(desde), hasta: fmt(hasta) };
    }
    case "año": {
      const year = now.getFullYear() + offset;
      const desde = new Date(year, 0, 1);
      const hasta = new Date(year, 11, 31);
      return { desde: fmt(desde), hasta: fmt(hasta) };
    }
  }
}

function getPeriodLabel(periodo: Periodo, offset: number): string {
  const now = new Date();
  switch (periodo) {
    case "hoy": {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      return d.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
    }
    case "semana": {
      const hasta = new Date(now);
      hasta.setDate(hasta.getDate() + offset * 7);
      const desde = new Date(hasta);
      desde.setDate(desde.getDate() - 6);
      const fmtShort = (d: Date) => d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
      return `${fmtShort(desde)} – ${fmtShort(hasta)}`;
    }
    case "mes": {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const label = d.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
    case "año": {
      return String(now.getFullYear() + offset);
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
  const [ordenes, setOrdenes] = useState<OrdenDetalle[]>([]);
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { desde, hasta } = getDateRange(periodo, offset);
      const params = new URLSearchParams({ desde, hasta });
      const [resumenRes, ordenesRes] = await Promise.all([
        fetch(`/api/ventas/resumen?${params}`),
        fetch(`/api/ordenes?limit=50`),
      ]);
      const json = await resumenRes.json();
      const ordenesJson = await ordenesRes.json();
      setData(json.data || []);
      setOrdenes(ordenesJson.data || []);
    } catch {
      // silenciar errores de red
    }
    setLoading(false);
  }, [periodo, offset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Resetear offset al cambiar periodo
  const handlePeriodoChange = (p: Periodo) => {
    setPeriodo(p);
    setOffset(0);
  };

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
            onClick={() => handlePeriodoChange(p.key)}
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

      {/* ── Navegación de periodo ── */}
      <div className="flex items-center justify-center mb-6" style={{ gap: 12 }}>
        <button
          onClick={() => setOffset(offset - 1)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid #e6e3db",
            background: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#6b6760",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#faf9f6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          ←
        </button>
        <span style={{ fontSize: 14, fontWeight: 500, color: "#37352f", minWidth: 160, textAlign: "center" }}>
          {getPeriodLabel(periodo, offset)}
        </span>
        <button
          onClick={() => setOffset(offset + 1)}
          disabled={offset >= 0}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid #e6e3db",
            background: offset >= 0 ? "#f1efe9" : "#fff",
            cursor: offset >= 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: offset >= 0 ? "#c5c0b8" : "#6b6760",
          }}
          onMouseEnter={(e) => { if (offset < 0) e.currentTarget.style.background = "#faf9f6"; }}
          onMouseLeave={(e) => { if (offset < 0) e.currentTarget.style.background = "#fff"; }}
        >
          →
        </button>
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
      {/* ── Detalle de órdenes con ticket ── */}
      {ordenes.length > 0 && (
        <div
          className="mt-6"
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #eeece7" }}>
            <p className="font-bold" style={{ fontSize: 13.5, color: "#37352f" }}>
              🧾 Órdenes recientes
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f7f4" }}>
                  {["Folio", "Cliente", "Total", "Fecha", "Ticket"].map((h) => (
                    <th
                      key={h}
                      className={`font-medium ${h === "Total" || h === "Ticket" ? "text-right" : "text-left"}`}
                      style={{
                        padding: "10px 16px",
                        fontSize: 11,
                        color: "#9b968c",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => {
                  const folio = `NV-${String(orden.numero).padStart(4, "0")}`;
                  return (
                    <tr
                      key={orden.id}
                      className="transition-colors"
                      style={{ borderTop: "1px solid #f1efe9" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf9f6")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "10px 16px", fontSize: 13, color: "#37352f", fontFamily: "monospace" }}>
                        {folio}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 13, color: "#37352f" }}>
                        {orden.cliente_nombre}
                      </td>
                      <td className="text-right font-medium" style={{ padding: "10px 16px", fontSize: 13, color: "#37352f" }}>
                        {formatPrice(orden.total)}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 13, color: "#9b968c" }}>
                        {formatDate(orden.creado_en)}
                      </td>
                      <td className="text-right" style={{ padding: "10px 16px" }}>
                        <a
                          href={`/admin/ordenes/${orden.id}`}
                          className="transition-colors"
                          style={{ fontSize: 12, color: "#37352f", textDecoration: "underline", textUnderlineOffset: 2 }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#A0845C")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#37352f")}
                        >
                          Ver ticket
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
