"use client";

import { useEffect, useState, useCallback } from "react";

interface ReporteItem {
  sku: string;
  folio: string;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
  fecha: string;
}

type PeriodoKey = "este_mes" | "mes_pasado" | "3_meses" | "este_año" | "personalizado";

const PERIODOS: { key: PeriodoKey; label: string }[] = [
  { key: "este_mes", label: "Este mes" },
  { key: "mes_pasado", label: "Mes pasado" },
  { key: "3_meses", label: "Últimos 3 meses" },
  { key: "este_año", label: "Este año" },
  { key: "personalizado", label: "Personalizado" },
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

const fmtDate = (d: Date) => d.toISOString().split("T")[0];

function getDateRange(periodo: PeriodoKey): { desde: string; hasta: string } {
  const now = new Date();
  switch (periodo) {
    case "este_mes":
      return { desde: fmtDate(new Date(now.getFullYear(), now.getMonth(), 1)), hasta: fmtDate(now) };
    case "mes_pasado": {
      const desde = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const hasta = new Date(now.getFullYear(), now.getMonth(), 0);
      return { desde: fmtDate(desde), hasta: fmtDate(hasta) };
    }
    case "3_meses": {
      const desde = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      return { desde: fmtDate(desde), hasta: fmtDate(now) };
    }
    case "este_año":
      return { desde: `${now.getFullYear()}-01-01`, hasta: fmtDate(now) };
    default:
      return { desde: fmtDate(new Date(now.getFullYear(), now.getMonth(), 1)), hasta: fmtDate(now) };
  }
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 16px",
  fontSize: 11,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#9b968c",
  borderBottom: "1px solid #eeece7",
};

export default function ReportesPage() {
  const [items, setItems] = useState<ReporteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [periodo, setPeriodo] = useState<PeriodoKey>("este_mes");
  const [desde, setDesde] = useState(() => getDateRange("este_mes").desde);
  const [hasta, setHasta] = useState(() => getDateRange("este_mes").hasta);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/reportes/ventas?desde=${desde}&hasta=${hasta}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error al cargar reporte");
      setItems(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
    setLoading(false);
  }, [desde, hasta]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Actualizar fechas cuando cambia el período (excepto personalizado)
  const handlePeriodo = (key: PeriodoKey) => {
    setPeriodo(key);
    if (key !== "personalizado") {
      const range = getDateRange(key);
      setDesde(range.desde);
      setHasta(range.hasta);
    }
  };

  // Totales
  const totalArticulos = items.reduce((s, i) => s + i.cantidad, 0);
  const totalIngresos = items.reduce((s, i) => s + i.subtotal, 0);

  // Exportar a Excel
  const exportToExcel = async () => {
    const XLSX = await import("xlsx");
    const wsData = [
      ["SKU", "Folio", "Producto", "Cantidad", "Precio Unitario", "Descuento %", "Subtotal", "Fecha"],
      ...items.map((i) => [
        i.sku,
        i.folio,
        i.producto,
        i.cantidad,
        i.precio_unitario,
        i.descuento,
        i.subtotal,
        formatDate(i.fecha),
      ]),
      [],
      ["", "", "TOTAL", totalArticulos, "", "", totalIngresos, ""],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Ancho de columnas
    ws["!cols"] = [
      { wch: 14 }, // SKU
      { wch: 10 }, // Folio
      { wch: 45 }, // Producto
      { wch: 10 }, // Cantidad
      { wch: 14 }, // Precio
      { wch: 12 }, // Descuento
      { wch: 14 }, // Subtotal
      { wch: 16 }, // Fecha
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte de Ventas");
    XLSX.writeFile(wb, `Reporte_Ventas_${desde}_a_${hasta}.xlsx`);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#37352f", margin: 0 }}>
            {"📋 Reporte de Ventas"}
          </h1>
          <p style={{ fontSize: 14, color: "#8b867c", marginTop: 4 }}>
            Detalle de artículos vendidos por período
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={exportToExcel}
            style={{
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 500,
              color: "#fff",
              background: "#37352f",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            📥 Exportar Excel
          </button>
        )}
      </div>

      {/* Filtros de período */}
      <div
        style={{
          border: "1px solid #eeece7",
          borderRadius: 12,
          padding: 20,
          background: "#fff",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: periodo === "personalizado" ? 14 : 0 }}>
          {PERIODOS.map((p) => {
            const isActive = periodo === p.key;
            return (
              <button
                key={p.key}
                onClick={() => handlePeriodo(p.key)}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 6,
                  border: isActive ? "1px solid #37352f" : "1px solid #e6e3db",
                  backgroundColor: isActive ? "#37352f" : "#fff",
                  color: isActive ? "#fff" : "#6b6760",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "inherit",
                }}
              >
                {p.label}
              </button>
            );
          })}

          {periodo !== "personalizado" && (
            <span style={{ fontSize: 12, color: "#9b968c", marginLeft: 8 }}>
              {desde} → {hasta}
            </span>
          )}
        </div>

        {periodo === "personalizado" && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <label style={{ fontSize: 12, color: "#6b6760" }}>Desde:</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              style={{
                fontFamily: "inherit",
                fontSize: 13,
                color: "#37352f",
                border: "1px solid #e6e3db",
                borderRadius: 6,
                padding: "6px 10px",
                background: "#f8f7f4",
                outline: "none",
              }}
            />
            <label style={{ fontSize: 12, color: "#6b6760" }}>Hasta:</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              style={{
                fontFamily: "inherit",
                fontSize: 13,
                color: "#37352f",
                border: "1px solid #e6e3db",
                borderRadius: 6,
                padding: "6px 10px",
                background: "#f8f7f4",
                outline: "none",
              }}
            />
          </div>
        )}
      </div>

      {/* KPIs rápidos */}
      {!loading && items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div
            style={{
              border: "1px solid #eeece7",
              borderRadius: 12,
              padding: "16px 20px",
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9b968c", marginBottom: 4 }}>
              Artículos vendidos
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#37352f" }}>
              {totalArticulos}
            </div>
          </div>
          <div
            style={{
              border: "1px solid #eeece7",
              borderRadius: 12,
              padding: "16px 20px",
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9b968c", marginBottom: 4 }}>
              Total ingresos
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#37352f" }}>
              {formatPrice(totalIngresos)}
            </div>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div
        style={{
          border: "1px solid #eeece7",
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
            Cargando...
          </div>
        ) : error ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "#c2410c", marginBottom: 12 }}>{error}</p>
            <button onClick={fetchData} style={{ fontSize: 13, color: "#37352f", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
              Reintentar
            </button>
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
            No hay ventas en este período.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f7f4" }}>
                  <th style={thStyle}>SKU</th>
                  <th style={thStyle}>Folio</th>
                  <th style={thStyle}>Producto</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Cant.</th>
                  <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "right" }}>P. Unitario</th>
                  <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "center" }}>Dto.</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Subtotal</th>
                  <th className="hidden md:table-cell" style={thStyle}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={`${item.folio}-${item.sku}-${i}`}
                    style={{
                      borderBottom: i < items.length - 1 ? "1px solid #f3f1ec" : "none",
                      transition: "background 0.1s ease",
                    }}
                    className="hover:bg-[#f8f7f4]"
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
                        fontSize: 12,
                        color: "#6b6760",
                      }}
                    >
                      {item.sku}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#37352f",
                      }}
                    >
                      {item.folio}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#37352f", fontSize: 13 }}>
                      {item.producto}
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#37352f", fontWeight: 500 }}>
                      {item.cantidad}
                    </td>
                    <td
                      className="hidden sm:table-cell"
                      style={{ padding: "12px 16px", textAlign: "right", color: "#9b968c", fontSize: 13 }}
                    >
                      {formatPrice(item.precio_unitario)}
                    </td>
                    <td
                      className="hidden sm:table-cell"
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        color: item.descuento > 0 ? "#16794a" : "#9b968c",
                        fontSize: 13,
                      }}
                    >
                      {item.descuento > 0 ? `${item.descuento}%` : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#37352f",
                        fontSize: 14,
                      }}
                    >
                      {formatPrice(item.subtotal)}
                    </td>
                    <td
                      className="hidden md:table-cell"
                      style={{ padding: "12px 16px", color: "#9b968c", fontSize: 13 }}
                    >
                      {formatDate(item.fecha)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Totals row */}
              <tfoot>
                <tr style={{ backgroundColor: "#f8f7f4", borderTop: "2px solid #eeece7" }}>
                  <td colSpan={3} style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#37352f" }}>
                    TOTAL
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#37352f", fontSize: 14 }}>
                    {totalArticulos}
                  </td>
                  <td className="hidden sm:table-cell" style={{ padding: "12px 16px" }} />
                  <td className="hidden sm:table-cell" style={{ padding: "12px 16px" }} />
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "#37352f", fontSize: 15 }}>
                    {formatPrice(totalIngresos)}
                  </td>
                  <td className="hidden md:table-cell" style={{ padding: "12px 16px" }} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
