"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const CATEGORIAS = [
  "Todos",
  "Muebles",
  "Cojines & Textiles",
  "Adornos",
  "Jarrones",
  "Iluminación",
  "Alfombras",
  "Acabados",
  "Capelos",
  "Relojes",
  "Florero",
];

const EMOJI_MAP: Record<string, string> = {
  Muebles: "🛋️",
  "Cojines & Textiles": "🧶",
  Adornos: "🏺",
  Iluminación: "💡",
  Alfombras: "🧵",
  Acabados: "🪞",
  Jarrones: "🏺",
  Capelos: "🔔",
  Relojes: "⏳",
  Florero: "🌸",
};

function getCategoryEmoji(cat: string): string {
  return EMOJI_MAP[cat] || "📦";
}

type StockStatus = "en_stock" | "bajo" | "critico" | "agotado";

function getStockStatus(cantidad: number, stockMinimo: number): StockStatus {
  if (cantidad === 0) return "agotado";
  if (cantidad <= Math.floor(stockMinimo * 0.5)) return "critico";
  if (cantidad <= stockMinimo) return "bajo";
  return "en_stock";
}

const STATUS_CONFIG: Record<StockStatus, { label: string; bg: string; color: string }> = {
  en_stock: { label: "En stock", bg: "#eaf3ec", color: "#16794a" },
  bajo: { label: "Bajo", bg: "#fbf3e0", color: "#b7791f" },
  critico: { label: "Crítico", bg: "#fdf3ec", color: "#c2410c" },
  agotado: { label: "Agotado", bg: "#f1efe9", color: "#8a857c" },
};

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

  const lowStockCount = items.filter(
    (item) => item.cantidad > 0 && item.cantidad <= item.stock_minimo
  ).length;

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
            {items.length} productos · {lowStockCount} con stock bajo
          </p>
        </div>
        <Link
          href="/admin/inventario/nuevo"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            backgroundColor: "#37352f",
            color: "#fff",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ＋ Nuevo producto
        </Link>
      </div>

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
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#9b968c",
                    }}
                  >
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const status = getStockStatus(item.cantidad, item.stock_minimo);
                  const statusConf = STATUS_CONFIG[status];
                  const emoji = getCategoryEmoji(item.productos.categoria);
                  const stockColor =
                    status === "en_stock"
                      ? "#16794a"
                      : status === "bajo"
                      ? "#b7791f"
                      : status === "critico"
                      ? "#c2410c"
                      : "#8a857c";

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
                        <span style={{ fontSize: 12, color: "#9b968c" }}>
                          /{item.stock_minimo}
                        </span>
                      </td>

                      {/* Precio */}
                      <td style={{ padding: "10px 16px", fontSize: 14, color: "#37352f" }}>
                        {formatPrice(item.productos.precio_venta)}
                      </td>

                      {/* Estado */}
                      <td style={{ padding: "10px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: statusConf.bg,
                            color: statusConf.color,
                            lineHeight: 1,
                          }}
                        >
                          {statusConf.label}
                        </span>
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
