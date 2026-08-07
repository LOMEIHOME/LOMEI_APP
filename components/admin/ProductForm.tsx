"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIAS = [
  "Muebles",
  "Cojines",
  "Textiles",
  "Adornos",
  "Jarrones",
  "Iluminación",
  "Alfombras",
  "Acabados",
  "Capelos",
  "Relojes",
  "Florero",
  "Macetas",
  "Plantas Artificiales",
];

interface ProductFormProps {
  initialData?: {
    id?: string;
    nombre: string;
    slug: string;
    categoria: string;
    sku: string;
    precio_costo: number;
    precio_venta: number;
    descripcion: string;
    dimensiones: string;
    materiales: string[];
    acabados: string[];
    imagen_url: string;
  };
  initialStock?: {
    cantidad: number;
    ubicacion: string;
    stock_minimo: number;
  };
  mode: "create" | "edit";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "inherit",
  fontSize: 13.5,
  color: "#37352f",
  border: "1px solid #e6e3db",
  borderRadius: 8,
  padding: "9px 12px",
  background: "#fff",
  outline: "none",
};

export default function ProductForm({
  initialData,
  initialStock,
  mode,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: initialData?.nombre || "",
    slug: initialData?.slug || "",
    categoria: initialData?.categoria || CATEGORIAS[0],
    sku: initialData?.sku || "",
    precio_costo: initialData?.precio_costo || 0,
    precio_venta: initialData?.precio_venta || 0,
    descripcion: initialData?.descripcion || "",
    dimensiones: initialData?.dimensiones || "",
    materiales: initialData?.materiales?.join(", ") || "",
    acabados: initialData?.acabados?.join(", ") || "",
    imagen_url: initialData?.imagen_url || "",
    cantidad_inicial: initialStock?.cantidad || 0,
    ubicacion: initialStock?.ubicacion || "Showroom",
    stock_minimo: initialStock?.stock_minimo || 2,
  });

  const handleNameChange = (nombre: string) => {
    setForm((f) => ({
      ...f,
      nombre,
      slug: mode === "create" ? slugify(nombre) : f.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      nombre: form.nombre,
      slug: form.slug,
      categoria: form.categoria,
      sku: form.sku || null,
      precio_costo: Number(form.precio_costo),
      precio_venta: Number(form.precio_venta),
      descripcion: form.descripcion || null,
      dimensiones: form.dimensiones || null,
      materiales: form.materiales
        ? form.materiales.split(",").map((m) => m.trim()).filter(Boolean)
        : [],
      acabados: form.acabados
        ? form.acabados.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      imagen_url: form.imagen_url || null,
      ...(mode === "create" && {
        cantidad_inicial: Number(form.cantidad_inicial),
        ubicacion: form.ubicacion,
        stock_minimo: Number(form.stock_minimo),
      }),
    };

    const url =
      mode === "edit"
        ? `/api/productos/${initialData?.id}`
        : "/api/productos";

    const res = await fetch(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Error al guardar");
      setLoading(false);
      return;
    }

    router.push("/admin/inventario");
    router.refresh();
  };

  const title = mode === "create" ? "Nuevo producto" : "Editar producto";
  const btnLabel = mode === "create" ? "Crear producto" : "Guardar cambios";

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#9b968c", marginBottom: 16 }}>
        <Link href="/admin/inventario" style={{ color: "#9b968c", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#37352f")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9b968c")}>
          Inventario
        </Link>
        <span>/</span>
        <span style={{ color: "#37352f" }}>{title}</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#37352f", letterSpacing: "-0.01em", marginBottom: 22 }}>
        {title}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Información del producto */}
        <div style={{ border: "1px solid #eeece7", borderRadius: 12, padding: 22, marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b3ada1", fontWeight: 600, marginBottom: 16 }}>
            Información del producto
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <label style={{ gridColumn: "span 2" }}>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Nombre</div>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Mesa de Centro Encino"
                style={inputStyle}
              />
            </label>
            <label>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>SKU</div>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                placeholder="MUE-001"
                style={inputStyle}
              />
            </label>
            <label>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Categoría</div>
              <select
                value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                style={inputStyle}
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label style={{ gridColumn: "span 2" }}>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Dimensiones</div>
              <input
                type="text"
                value={form.dimensiones}
                onChange={(e) => setForm((f) => ({ ...f, dimensiones: e.target.value }))}
                placeholder="120 × 60 × 45 cm"
                style={inputStyle}
              />
            </label>
            <label style={{ gridColumn: "span 2" }}>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Descripción</div>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripción del producto..."
                style={{ ...inputStyle, minHeight: 78, resize: "vertical" as const }}
              />
            </label>
            <label style={{ gridColumn: "span 2" }}>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Materiales (separados por coma)</div>
              <input
                type="text"
                value={form.materiales}
                onChange={(e) => setForm((f) => ({ ...f, materiales: e.target.value }))}
                placeholder="Encino natural, Acero"
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        {/* Precios */}
        <div style={{ border: "1px solid #eeece7", borderRadius: 12, padding: 22, marginBottom: 16 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b3ada1", fontWeight: 600, marginBottom: 16 }}>
            Precios
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <label>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Precio costo (MXN)</div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precio_costo}
                onChange={(e) => setForm((f) => ({ ...f, precio_costo: Number(e.target.value) }))}
                style={inputStyle}
              />
            </label>
            <label>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Precio venta (MXN)</div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precio_venta}
                onChange={(e) => setForm((f) => ({ ...f, precio_venta: Number(e.target.value) }))}
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        {/* Stock inicial (solo create) */}
        {mode === "create" && (
          <div style={{ border: "1px solid #eeece7", borderRadius: 12, padding: 22, marginBottom: 16 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b3ada1", fontWeight: 600, marginBottom: 16 }}>
              Stock inicial
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <label>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Cantidad</div>
                <input
                  type="number"
                  min="0"
                  value={form.cantidad_inicial}
                  onChange={(e) => setForm((f) => ({ ...f, cantidad_inicial: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </label>
              <label>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Ubicación</div>
                <input
                  type="text"
                  value={form.ubicacion}
                  onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))}
                  style={inputStyle}
                />
              </label>
              <label>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>Stock mínimo</div>
                <input
                  type="number"
                  min="0"
                  value={form.stock_minimo}
                  onChange={(e) => setForm((f) => ({ ...f, stock_minimo: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </label>
            </div>
          </div>
        )}

        {error && (
          <div style={{ fontSize: 13, color: "#c2410c", marginBottom: 12 }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "inherit",
              fontSize: 13.5,
              fontWeight: 500,
              color: "#fff",
              background: "#37352f",
              border: 0,
              borderRadius: 8,
              padding: "11px 22px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "Guardando..." : btnLabel}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/inventario")}
            style={{
              fontFamily: "inherit",
              fontSize: 13.5,
              color: "#6b6760",
              background: "#fff",
              border: "1px solid #e6e3db",
              borderRadius: 8,
              padding: "11px 22px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
