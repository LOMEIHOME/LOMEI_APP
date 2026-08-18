"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { formatFecha } from "@/lib/constants";

interface OrdenItem {
  id: string;
  producto_id: string;
  productos: { nombre: string; sku: string | null } | null;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
}

interface Orden {
  id: string;
  numero: number;
  estado: "pendiente" | "completada" | "cancelada";
  creado_en: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_tel: string | null;
  subtotal: number;
  descuento: number;
  total: number;
  nota: string | null;
  ticket_html: string | null;
  orden_items: OrdenItem[];
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) => formatFecha(d);


/* ---- Shared style helpers ---- */
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

const cardStyle: React.CSSProperties = {
  border: "1px solid #eeece7",
  borderRadius: 12,
  backgroundColor: "#fff",
  padding: 24,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#9b968c",
  marginBottom: 14,
};

export default function OrdenDetallePage() {
  const params = useParams();
  const id = params.id as string;

  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrden = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/ordenes/${id}`);
      const json = await res.json();
      setOrden(json.data || null);
    } catch {
      setError("No se pudo cargar la orden.");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchOrden();
  }, [fetchOrden]);

  const [cancellingItem, setCancellingItem] = useState<string | null>(null);

  const handleCancelItem = async (item: OrdenItem) => {
    const nombre = item.productos?.nombre || "este artículo";
    if (!confirm(`¿Cancelar "${nombre}" (×${item.cantidad}) y devolver al inventario?`)) return;
    setCancellingItem(item.id);
    try {
      const res = await fetch(`/api/ordenes/${id}/items/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error || "No se pudo cancelar el artículo");
      } else {
        await fetchOrden();
      }
    } catch {
      setError("Error al cancelar el artículo");
    }
    setCancellingItem(null);
  };

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
        Cargando...
      </div>
    );
  }

  if (error && !orden) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#c2410c", marginBottom: 12 }}>{error}</p>
        <button onClick={fetchOrden} style={{ fontSize: 13, color: "#37352f", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>Reintentar</button>
      </div>
    );
  }

  if (!orden) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Link
          href="/admin/ordenes"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12.5,
            color: "#9b968c",
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          &larr; Órdenes
        </Link>
        <p style={{ fontSize: 14, color: "#9b968c" }}>Orden no encontrada.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <Link
        href="/admin/ordenes"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12.5,
          color: "#9b968c",
          textDecoration: "none",
          marginBottom: 20,
          transition: "color 0.15s ease",
        }}
        className="hover:!text-[#6b6760]"
      >
        &larr; Órdenes
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#37352f",
            fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
            margin: 0,
          }}
        >
          #{String(orden.numero).padStart(4, "0")}
        </h1>
        <OrderStatusBadge estado={orden.estado} />
        <span style={{ fontSize: 13, color: "#9b968c" }}>
          {formatDate(orden.creado_en)}
        </span>
      </div>

      {/* Two cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
        className="!grid-cols-1 sm:!grid-cols-2"
      >
        {/* Cliente */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Cliente</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#37352f" }}>
              {orden.cliente_nombre}
            </span>
            <span style={{ fontSize: 13, color: "#9b968c" }}>
              {orden.cliente_email}
            </span>
            <span style={{ fontSize: 13, color: "#9b968c" }}>
              {orden.cliente_tel || "\u2014"}
            </span>
          </div>
        </div>

        {/* Resumen */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Resumen</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#9b968c" }}>Subtotal</span>
              <span style={{ fontSize: 14, color: "#37352f" }}>{formatPrice(orden.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#9b968c" }}>Descuento</span>
              <span style={{ fontSize: 14, color: "#37352f" }}>{formatPrice(orden.descuento)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #eeece7",
                paddingTop: 10,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#37352f" }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#37352f" }}>{formatPrice(orden.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div
        style={{
          border: "1px solid #eeece7",
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "#fff",
          marginBottom: 20,
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f7f4" }}>
                <th style={{ ...thStyle, textAlign: "left" }}>Producto</th>
                <th className="hidden sm:table-cell" style={thStyle}>SKU</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Cant.</th>
                <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "right" }}>
                  P. unitario
                </th>
                <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "center" }}>
                  Dto.
                </th>
                <th style={{ ...thStyle, textAlign: "right" }}>Subtotal</th>
                {orden.estado !== "cancelada" && (
                  <th style={{ ...thStyle, textAlign: "center", width: 60 }}></th>
                )}
              </tr>
            </thead>
            <tbody>
              {orden.orden_items?.map((item, i) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: i < orden.orden_items.length - 1 ? "1px solid #f3f1ec" : "none",
                  }}
                  className="hover:bg-[#f8f7f4] transition-colors"
                >
                  <td style={{ padding: "12px 16px", color: "#37352f" }}>
                    {item.productos?.nombre || "Producto eliminado"}
                  </td>
                  <td
                    className="hidden sm:table-cell"
                    style={{
                      padding: "12px 16px",
                      fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
                      fontSize: 12,
                      color: "#6b6760",
                    }}
                  >
                    {item.productos?.sku || "—"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "#37352f" }}>
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
                    style={{ padding: "12px 16px", textAlign: "center", color: item.descuento > 0 ? "#16794a" : "#9b968c", fontSize: 13 }}
                  >
                    {item.descuento > 0 ? `${item.descuento}%` : "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#37352f",
                    }}
                  >
                    {formatPrice(item.subtotal)}
                  </td>
                  {orden.estado !== "cancelada" && (
                    <td style={{ padding: "12px 8px", textAlign: "center" }}>
                      <button
                        onClick={() => handleCancelItem(item)}
                        disabled={cancellingItem === item.id}
                        title="Cancelar artículo y devolver al inventario"
                        style={{
                          fontFamily: "inherit",
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#c2410c",
                          background: cancellingItem === item.id ? "#f1efe9" : "none",
                          border: "1px solid #e6e3db",
                          borderRadius: 6,
                          padding: "4px 8px",
                          cursor: cancellingItem === item.id ? "not-allowed" : "pointer",
                          opacity: cancellingItem === item.id ? 0.5 : 1,
                        }}
                      >
                        {cancellingItem === item.id ? "..." : "✕"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota */}
      {orden.nota && (
        <div
          style={{
            backgroundColor: "#f8f7f4",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Nota</h3>
          <p style={{ fontSize: 14, color: "#37352f", margin: 0, lineHeight: 1.6 }}>
            {orden.nota}
          </p>
        </div>
      )}

      {/* Ticket */}
      {orden.ticket_html && (
        <div
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            backgroundColor: "#fff",
            padding: 24,
            marginBottom: 20,
          }}
        >
          <h3 style={sectionTitle}>Nota de venta</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                const w = window.open("", "_blank");
                if (w) {
                  w.document.write(orden.ticket_html!);
                  w.document.close();
                }
              }}
              style={{
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 500,
                color: "#37352f",
                background: "#fff",
                border: "1px solid #e6e3db",
                borderRadius: 8,
                padding: "9px 18px",
                cursor: "pointer",
              }}
            >
              👁️ Ver ticket
            </button>
            <button
              onClick={() => {
                const w = window.open("", "_blank");
                if (w) {
                  w.document.write(orden.ticket_html!);
                  w.document.close();
                  setTimeout(() => w.print(), 300);
                }
              }}
              style={{
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 500,
                color: "#fff",
                background: "#37352f",
                border: "none",
                borderRadius: 8,
                padding: "9px 18px",
                cursor: "pointer",
              }}
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={() => {
                const blob = new Blob([orden.ticket_html!], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `ticket-NV-${String(orden.numero).padStart(4, "0")}.html`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 500,
                color: "#37352f",
                background: "#fff",
                border: "1px solid #e6e3db",
                borderRadius: 8,
                padding: "9px 18px",
                cursor: "pointer",
              }}
            >
              💾 Descargar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
