"use client";

import { useEffect, useState, useCallback } from "react";
import { getCategoryEmoji, CATEGORY_EMOJI } from "@/lib/constants";

const CATEGORIAS = ["Todos", ...Object.keys(CATEGORY_EMOJI)];

function getStockColor(cantidad: number): string {
  if (cantidad === 0) return "#c2410c";
  if (cantidad === 1) return "#b7791f";
  return "#37352f";
}


interface InventarioItem {
  id: string;
  producto_id: string;
  cantidad: number;
  ubicacion: string;
  stock_minimo: number;
  productos: {
    id: string;
    nombre: string;
    slug: string;
    categoria: string;
    sku: string | null;
    precio_venta: number;
    imagen_url: string | null;
    activo: boolean;
  };
}

export default function InventarioPage() {
  const [items, setItems] = useState<InventarioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<Record<string, unknown> | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (categoria) params.set("categoria", categoria);

    const res = await fetch(`/api/inventario?${params}`);
    const json = await res.json();
    setItems(json.data || []);
    setLoading(false);
  }, [debouncedSearch, categoria]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const agotadosCount = items.filter((item) => item.cantidad === 0).length;

  const totalInventoryValue = items.reduce(
    (sum, item) => sum + item.cantidad * item.productos.precio_venta,
    0
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#37352f", lineHeight: 1.2 }}>
            📦 Inventario
          </h1>
          <p style={{ fontSize: 14, color: "#8b867c", marginTop: 4 }}>
            {items.length} productos{agotadosCount > 0 ? ` · ${agotadosCount} agotados` : ""} · {formatPrice(totalInventoryValue)} en inventario
          </p>
        </div>
        <button
          onClick={async () => {
            setSyncing(true);
            setSyncResult(null);
            try {
              const res = await fetch("/api/sync/sanity", { method: "POST" });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Error al sincronizar");
              setSyncResult(data);
              fetchData();
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : "Error desconocido";
              setSyncResult({ error: message });
            } finally {
              setSyncing(false);
            }
          }}
          disabled={syncing}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            backgroundColor: syncing ? "#9b968c" : "#37352f",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            border: "none",
            cursor: syncing ? "wait" : "pointer",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { if (!syncing) e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {syncing ? "⏳ Sincronizando..." : "🔄 Sincronizar con Sanity"}
        </button>
      </div>

      {/* Resultado de sincronización */}
      {syncResult && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 13,
            backgroundColor: syncResult.error ? "#fdf3ec" : "#eaf3ec",
            color: syncResult.error ? "#c2410c" : "#16794a",
            border: `1px solid ${syncResult.error ? "#f5d5c3" : "#c3e2c9"}`,
          }}
        >
          {syncResult.error
            ? `❌ ${syncResult.error}`
            : `✅ Sincronización completa — ${syncResult.creados ?? 0} creados, ${syncResult.actualizados ?? 0} actualizados, ${syncResult.sinCambios ?? 0} sin cambios`}
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap items-center" style={{ gap: 10, marginBottom: 24 }}>
        {/* Search */}
        <div style={{ position: "relative", width: 280 }}>
          <svg
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 15,
              height: 15,
              color: "#9b968c",
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            style={{
              width: "100%",
              paddingLeft: 34,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              backgroundColor: "#f8f7f4",
              border: "1px solid #eeece7",
              borderRadius: 9,
              fontSize: 13.5,
              color: "#37352f",
              outline: "none",
            }}
          />
        </div>

        {/* Category chips */}
        {CATEGORIAS.map((cat) => {
          const isActive = cat === "Todos" ? !categoria : categoria === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoria(cat === "Todos" ? "" : cat)}
              style={{
                padding: "7px 13px",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 8,
                border: isActive ? "1px solid #37352f" : "1px solid #e6e3db",
                backgroundColor: isActive ? "#37352f" : "#fff",
                color: isActive ? "#fff" : "#6b6760",
                cursor: "pointer",
                transition: "all 0.15s",
                lineHeight: 1,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div
        style={{
          border: "1px solid #eeece7",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
            Cargando inventario...
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
            No se encontraron productos.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f7f4" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#9b968c",
                    }}
                  >
                    Producto
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#9b968c",
                    }}
                  >
                    SKU
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#9b968c",
                    }}
                  >
                    Stock
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#9b968c",
                    }}
                  >
                    Precio
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#9b968c",
                    }}
                  >
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const emoji = getCategoryEmoji(item.productos.categoria);
                  const stockColor = getStockColor(item.cantidad);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderTop: "1px solid #f1efe9",
                        cursor: "pointer",
                        transition: "background-color 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#faf9f6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={() =>
                        (window.location.href = `/admin/inventario/${item.productos.id}`)
                      }
                    >
                      {/* Producto */}
                      <td style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              backgroundColor: "#f3f1ec",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 15,
                              flexShrink: 0,
                            }}
                          >
                            {emoji}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#37352f",
                                lineHeight: 1.3,
                              }}
                            >
                              {item.productos.nombre}
                            </div>
                            <div style={{ fontSize: 12, color: "#9b968c" }}>
                              {item.productos.categoria}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td
                        style={{
                          padding: "10px 16px",
                          fontFamily: "monospace",
                          fontSize: 13,
                          color: "#9b968c",
                        }}
                      >
                        {item.productos.sku || "—"}
                      </td>

                      {/* Stock */}
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: stockColor }}>
                          {item.cantidad}
                        </span>
                      </td>

                      {/* Precio */}
                      <td style={{ padding: "10px 16px", fontSize: 14, color: "#37352f" }}>
                        {formatPrice(item.productos.precio_venta)}
                      </td>

                      {/* Valor (precio × stock) */}
                      <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 500, color: "#37352f", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {item.cantidad > 0 ? formatPrice(item.cantidad * item.productos.precio_venta) : <span style={{ color: "#9b968c" }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
