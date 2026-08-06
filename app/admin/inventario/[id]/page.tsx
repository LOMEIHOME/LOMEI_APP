"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCategoryEmoji, formatFecha } from "@/lib/constants";

/* ──────────────────────────── Types ──────────────────────────── */

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  categoria: string;
  sku: string | null;
  precio_costo: number;
  precio_venta: number;
  descripcion: string | null;
  dimensiones: string | null;
  materiales: string[] | null;
  acabados: string[] | null;
  imagen_url: string | null;
  activo: boolean;
  inventario: {
    id: string;
    cantidad: number;
    ubicacion: string;
    stock_minimo: number;
  }[];
}

interface Movimiento {
  id: string;
  tipo: string;
  cantidad: number;
  cantidad_antes: number;
  cantidad_despues: number;
  nota: string | null;
  creado_en: string;
}

/* ──────────────────────────── Constants ──────────────────────── */

const TIPO_LABELS: Record<string, string> = {
  entrada: "Entrada",
  salida: "Salida",
  ajuste: "Ajuste",
  devolucion: "Devolución",
};

const TIPO_DESCRIPTIONS: Record<string, string> = {
  entrada: "Recibido / restock",
  salida: "Vendido / retirado",
  ajuste: "Valor absoluto",
  devolucion: "Producto devuelto",
};

/* ──────────────────────────── Helpers ────────────────────────── */

function getNotionStatus(cantidad: number, min: number) {
  if (cantidad <= 0)
    return { label: "Agotado", bg: "#f1efe9", color: "#8a857c" };
  if (cantidad < min * 0.5)
    return { label: "Crítico", bg: "#fdf3ec", color: "#c2410c" };
  if (cantidad < min)
    return { label: "Bajo", bg: "#fbf3e0", color: "#b7791f" };
  return { label: "En stock", bg: "#eaf3ec", color: "#16794a" };
}

function formatDate(date: string) {
  return formatFecha(date);
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

/* ──────────────────────────── Page ───────────────────────────── */

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  /* Adjustment form state */
  const [tipo, setTipo] = useState("entrada");
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchData = useCallback(async () => {
    const [prodRes, movRes] = await Promise.all([
      fetch(`/api/productos/${id}`),
      fetch(`/api/inventario/movimientos?producto_id=${id}&limit=15`),
    ]);
    const prodJson = await prodRes.json();
    const movJson = await movRes.json();
    setProducto(prodJson.data);
    setMovimientos(movJson.data || []);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Submit stock adjustment */
  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto) return;
    const inv = producto.inventario?.[0];
    if (!inv) return;

    setFormError("");
    setSubmitting(true);

    const res = await fetch(`/api/inventario/${inv.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, cantidad, nota: nota || null }),
    });
    const json = await res.json();

    if (!res.ok) {
      setFormError(json.error || "Error al ajustar stock");
      setSubmitting(false);
      return;
    }

    setCantidad(1);
    setNota("");
    setSubmitting(false);
    fetchData();
  };

  /* ── Loading / Not found ── */
  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontSize: 13, color: "#9b968c" }}>
        Cargando producto...
      </div>
    );
  }

  if (!producto) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontSize: 13, color: "#9b968c" }}>
        Producto no encontrado
      </div>
    );
  }

  /* ── Derived values ── */
  const inv = producto.inventario?.[0];
  const currentQty = inv?.cantidad ?? 0;
  const minQty = inv?.stock_minimo ?? 0;
  const status = getNotionStatus(currentQty, minQty);
  const emoji = getCategoryEmoji(producto.categoria);

  let preview = currentQty;
  if (tipo === "entrada" || tipo === "devolucion") preview = currentQty + Math.abs(cantidad);
  else if (tipo === "salida") preview = Math.max(0, currentQty - Math.abs(cantidad));
  else if (tipo === "ajuste") preview = Math.max(0, cantidad);

  const tipoKeys = ["entrada", "salida", "ajuste", "devolucion"] as const;

  /* ── Render ── */
  return (
    <div style={{ maxWidth: 960, fontFamily: "'Montserrat', sans-serif" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12.5, marginBottom: 20 }}>
        <Link
          href="/admin/inventario"
          style={{ color: "#9b968c", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#37352f")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9b968c")}
        >
          Inventario
        </Link>
        <span style={{ color: "#9b968c", margin: "0 6px" }}>/</span>
        <span style={{ color: "#37352f" }}>{producto.nombre}</span>
      </div>

      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>{emoji}</span>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#37352f",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {producto.nombre}
            </h1>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: 99,
                backgroundColor: status.bg,
                color: status.color,
                whiteSpace: "nowrap",
              }}
            >
              {status.label}
            </span>
          </div>
          <p
            style={{
              fontSize: 13.5,
              color: "#9b968c",
              margin: "6px 0 0 0",
            }}
          >
            {producto.categoria}
            {producto.sku && (
              <span style={{ fontFamily: "monospace", marginLeft: 8 }}>
                {producto.sku}
              </span>
            )}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Link
            href={`/admin/inventario/${id}/editar`}
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid #e6e3db",
              color: "#37352f",
              textDecoration: "none",
              backgroundColor: "#fff",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#faf9f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            ✏️ Editar producto
          </Link>
          <button
            onClick={async () => {
              const action = producto.activo !== false ? "desactivar" : "reactivar";
              if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} este producto?`)) return;
              if (action === "desactivar") {
                await fetch(`/api/productos/${id}`, { method: "DELETE" });
              } else {
                await fetch(`/api/productos/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ activo: true }),
                });
              }
              fetchData();
            }}
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid #e6e3db",
              color: producto.activo !== false ? "#c2410c" : "#16794a",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#faf9f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          >
            {producto.activo !== false ? "🚫 Desactivar" : "✅ Reactivar"}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div
        className="notion-detail-grid"
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Stock card */}
          <div
            style={{
              backgroundColor: "#f8f7f4",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#b3ada1",
                margin: "0 0 12px 0",
              }}
            >
              Stock actual
            </p>
            <p
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: status.color,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {currentQty}
            </p>
            <p
              style={{
                fontSize: 12.5,
                color: "#9b968c",
                margin: "10px 0 0 0",
              }}
            >
              Mínimo {minQty} · {inv?.ubicacion ?? "—"}
            </p>
            <p
              style={{
                fontSize: 12.5,
                color: "#9b968c",
                margin: "4px 0 0 0",
              }}
            >
              Precio venta {formatPrice(producto.precio_venta)}
            </p>
          </div>

          {/* Adjustment form card */}
          {inv && (
            <div
              style={{
                border: "1px solid #eeece7",
                borderRadius: 12,
                padding: 18,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#b3ada1",
                  margin: "0 0 14px 0",
                }}
              >
                Ajustar stock
              </p>

              <form onSubmit={handleAdjust}>
                {/* 2x2 type buttons */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {tipoKeys.map((t) => {
                    const active = tipo === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTipo(t)}
                        style={{
                          textAlign: "left",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: `1.5px solid ${active ? "#b9a98a" : "#eeece7"}`,
                          backgroundColor: active ? "#f6f1e6" : "#fff",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.15s",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#37352f",
                            margin: 0,
                          }}
                        >
                          {TIPO_LABELS[t]}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#9b968c",
                            margin: "2px 0 0 0",
                          }}
                        >
                          {TIPO_DESCRIPTIONS[t]}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Quantity input */}
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#b3ada1",
                      marginBottom: 6,
                    }}
                  >
                    {tipo === "ajuste" ? "Nueva cantidad" : "Cantidad"}
                  </label>
                  <input
                    type="number"
                    min={tipo === "ajuste" ? 0 : 1}
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      fontSize: 14,
                      color: "#37352f",
                      border: "1.5px solid #eeece7",
                      borderRadius: 8,
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b9a98a")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#eeece7")}
                  />
                </div>

                {/* Preview row */}
                <div
                  style={{
                    backgroundColor: "#f8f7f4",
                    borderRadius: 8,
                    padding: "9px 14px",
                    fontSize: 13,
                    color: "#37352f",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>{currentQty}</span>
                  <span style={{ color: "#9b968c" }}>&rarr;</span>
                  <span style={{ fontWeight: 700 }}>{preview}</span>
                  <span style={{ color: "#9b968c", fontSize: 12 }}>unidades</span>
                </div>

                {/* Note input */}
                <div style={{ marginBottom: 14 }}>
                  <input
                    type="text"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Nota (opcional)..."
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#37352f",
                      border: "1.5px solid #eeece7",
                      borderRadius: 8,
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#b9a98a")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#eeece7")}
                  />
                </div>

                {formError && (
                  <p style={{ fontSize: 12, color: "#c2410c", margin: "0 0 10px 0" }}>
                    {formError}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "#fff",
                    backgroundColor: submitting ? "#6b6560" : "#37352f",
                    border: "none",
                    borderRadius: 8,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "background-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) e.currentTarget.style.backgroundColor = "#4a4740";
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) e.currentTarget.style.backgroundColor = "#37352f";
                  }}
                >
                  {submitting ? "Aplicando..." : "Aplicar movimiento"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Right column: Movement history ── */}
        <div
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #eeece7",
            }}
          >
            <h2
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "#37352f",
                margin: 0,
              }}
            >
              Historial de movimientos
            </h2>
          </div>

          {movimientos.length === 0 ? (
            <p style={{ padding: 20, fontSize: 13, color: "#9b968c" }}>
              Sin movimientos registrados
            </p>
          ) : (
            <div>
              {movimientos.map((mov, i) => {
                const isAdd = mov.tipo === "entrada" || mov.tipo === "devolucion";
                const isSub = mov.tipo === "salida";
                const deltaColor = isAdd ? "#16794a" : isSub ? "#c2410c" : "#b7791f";
                const deltaText = isAdd
                  ? `+${mov.cantidad}`
                  : isSub
                    ? `-${mov.cantidad}`
                    : `= ${mov.cantidad_despues}`;

                return (
                  <div
                    key={mov.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "14px 20px",
                      borderBottom:
                        i < movimientos.length - 1 ? "1px solid #f5f3ef" : "none",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#37352f",
                          }}
                        >
                          {TIPO_LABELS[mov.tipo] || mov.tipo}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: deltaColor,
                          }}
                        >
                          {deltaText}
                        </span>
                      </div>
                      {mov.nota && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#9b968c",
                            margin: "3px 0 0 0",
                          }}
                        >
                          {mov.nota}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontSize: 12.5,
                          color: "#9b968c",
                          margin: 0,
                        }}
                      >
                        {mov.cantidad_antes} &rarr; {mov.cantidad_despues}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#c4bfb6",
                          margin: "2px 0 0 0",
                        }}
                      >
                        {formatDate(mov.creado_en)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .notion-detail-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 720px) {
          .notion-detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
