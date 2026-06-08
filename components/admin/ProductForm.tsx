"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS = [
  "Muebles",
  "Cojines & Textiles",
  "Adornos",
  "Iluminación",
  "Alfombras",
  "Acabados",
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
    // Solo para create
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

  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-[var(--color-sand)]/50 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)]/40 focus:outline-none focus:border-[var(--color-oak)] transition-colors";
  const labelClass =
    "block text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Información básica */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-6 space-y-4">
        <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-dark)] font-medium mb-4">
          Información del producto
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Nombre</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
              placeholder="Mesa de Centro Encino"
            />
          </div>

          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className={inputClass}
              placeholder="mesa-centro-encino"
            />
          </div>

          <div>
            <label className={labelClass}>SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className={inputClass}
              placeholder="MUE-001"
            />
          </div>

          <div>
            <label className={labelClass}>Categoría</label>
            <select
              value={form.categoria}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoria: e.target.value }))
              }
              className={inputClass}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Dimensiones</label>
            <input
              type="text"
              value={form.dimensiones}
              onChange={(e) =>
                setForm((f) => ({ ...f, dimensiones: e.target.value }))
              }
              className={inputClass}
              placeholder="120 × 60 × 45 cm"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            value={form.descripcion}
            onChange={(e) =>
              setForm((f) => ({ ...f, descripcion: e.target.value }))
            }
            className={`${inputClass} min-h-[80px] resize-y`}
            placeholder="Descripción del producto..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Materiales (separados por coma)</label>
            <input
              type="text"
              value={form.materiales}
              onChange={(e) =>
                setForm((f) => ({ ...f, materiales: e.target.value }))
              }
              className={inputClass}
              placeholder="Encino natural, Acero"
            />
          </div>
          <div>
            <label className={labelClass}>Acabados (separados por coma)</label>
            <input
              type="text"
              value={form.acabados}
              onChange={(e) =>
                setForm((f) => ({ ...f, acabados: e.target.value }))
              }
              className={inputClass}
              placeholder="Natural, Nogal, Negro"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>URL de imagen</label>
          <input
            type="text"
            value={form.imagen_url}
            onChange={(e) =>
              setForm((f) => ({ ...f, imagen_url: e.target.value }))
            }
            className={inputClass}
            placeholder="/images/productos/mesa-centro.jpg"
          />
        </div>
      </div>

      {/* Precios */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-6">
        <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-dark)] font-medium mb-4">
          Precios
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Precio costo (MXN)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.precio_costo}
              onChange={(e) =>
                setForm((f) => ({ ...f, precio_costo: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Precio venta (MXN)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.precio_venta}
              onChange={(e) =>
                setForm((f) => ({ ...f, precio_venta: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Stock inicial (solo en crear) */}
      {mode === "create" && (
        <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-6">
          <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-dark)] font-medium mb-4">
            Stock inicial
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Cantidad</label>
              <input
                type="number"
                min="0"
                value={form.cantidad_inicial}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    cantidad_inicial: Number(e.target.value),
                  }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Ubicación</label>
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ubicacion: e.target.value }))
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock mínimo</label>
              <input
                type="number"
                min="0"
                value={form.stock_minimo}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    stock_minimo: Number(e.target.value),
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error y botones */}
      {error && (
        <p className="text-xs text-red-600/80">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[var(--color-dark)] text-white text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : mode === "create"
              ? "Crear producto"
              : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-[var(--color-sand)]/50 text-xs tracking-[0.15em] uppercase text-[var(--color-warm-gray)] rounded-sm hover:border-[var(--color-oak)] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
