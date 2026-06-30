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

const ESTADO_BTN_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  completada: { bg: "#eaf3ec", color: "#16794a", border: "#c8e6cc" },
  pendiente: { bg: "#fbf3e0", color: "#b7791f", border: "#f0deb0" },
  cancelada: { bg: "#f1efe9", color: "#8a857c", border: "#e0ddd5" },
};

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
      <div
        style={{
          padding: 48,
          textAlign: "center",
          fontSize: 14,
          color: "#9b968c",
        }}
      >
        Cargando...
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
          {formatDate(orden.created_at)}
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
              {orden.cliente_telefono || "\u2014"}
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
                <th style={{ ...thStyle, textAlign: "right" }}>Cant.</th>
                <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "right" }}>
                  P. unitario
                </th>
                <th style={{ ...thStyle, textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orden.items?.map((item, i) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: i < orden.items.length - 1 ? "1px solid #f3f1ec" : "none",
                  }}
                  className="hover:bg-[#f8f7f4] transition-colors"
                >
                  <td style={{ padding: "12px 16px", color: "#37352f" }}>
                    {item.producto_nombre}
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
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#37352f",
                    }}
                  >
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

      {/* Cambiar estado */}
      <div
        style={{
          border: "1px solid #eeece7",
          borderRadius: 12,
          backgroundColor: "#fff",
          padding: 24,
        }}
      >
        <h3 style={sectionTitle}>Cambiar estado</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ESTADOS.map((e) => {
            const isCurrent = orden.estado === e;
            const colors = ESTADO_BTN_COLORS[e];
            return (
              <button
                key={e}
                onClick={() => handleChangeEstado(e)}
                disabled={isCurrent || updating}
                style={{
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 8,
                  border: isCurrent
                    ? `2px solid ${colors.color}`
                    : `1px solid ${colors.border}`,
                  backgroundColor: colors.bg,
                  color: colors.color,
                  cursor: isCurrent || updating ? "default" : "pointer",
                  opacity: updating && !isCurrent ? 0.5 : 1,
                  transition: "all 0.15s ease",
                }}
              >
                {ESTADO_LABELS[e]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
