"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import StockAdjustForm from "@/components/admin/StockAdjustForm";
import StatusBadge, { getStockStatus } from "@/components/admin/StatusBadge";

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

const TIPO_LABELS: Record<string, string> = {
  entrada: "Entrada",
  salida: "Salida",
  ajuste: "Ajuste",
  devolucion: "Devolución",
};

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"stock" | "editar">("stock");
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!confirm("¿Desactivar este producto del inventario?")) return;
    setDeleting(true);
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    router.push("/admin/inventario");
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
        Cargando producto...
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
        Producto no encontrado
      </div>
    );
  }

  const inv = producto.inventario?.[0];
  const stockStatus = inv ? getStockStatus(inv.cantidad, inv.stock_minimo) : "out";

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--color-warm-gray)] mb-4">
        <Link href="/admin/inventario" className="hover:text-[var(--color-oak)] transition-colors">
          Inventario
        </Link>
        <span>/</span>
        <span className="text-[var(--color-dark)]">{producto.nombre}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
              {producto.nombre}
            </h1>
            <StatusBadge status={stockStatus} />
          </div>
          <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
            {producto.categoria}
            {producto.sku && <span className="ml-2 font-mono">· {producto.sku}</span>}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-red-500/70 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          {deleting ? "Desactivando..." : "Desactivar producto"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[var(--color-sand)]/20">
        <button
          onClick={() => setTab("stock")}
          className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border-b-2 -mb-[1px] ${
            tab === "stock"
              ? "border-[var(--color-oak)] text-[var(--color-dark)]"
              : "border-transparent text-[var(--color-warm-gray)] hover:text-[var(--color-dark)]"
          }`}
        >
          Stock
        </button>
        <button
          onClick={() => setTab("editar")}
          className={`px-4 py-2.5 text-xs tracking-[0.15em] uppercase transition-colors border-b-2 -mb-[1px] ${
            tab === "editar"
              ? "border-[var(--color-oak)] text-[var(--color-dark)]"
              : "border-transparent text-[var(--color-warm-gray)] hover:text-[var(--color-dark)]"
          }`}
        >
          Editar
        </button>
      </div>

      {tab === "stock" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock info + Ajuste */}
          <div className="lg:col-span-1 space-y-6">
            {/* Info actual */}
            <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-3">
                Stock actual
              </h3>
              <p className="font-serif text-4xl text-[var(--color-dark)]">
                {inv?.cantidad ?? 0}
              </p>
              <p className="text-xs text-[var(--color-warm-gray)] mt-1">
                Mínimo: {inv?.stock_minimo ?? 0} · {inv?.ubicacion ?? "—"}
              </p>
            </div>

            {/* Formulario de ajuste */}
            {inv && (
              <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-4">
                  Ajustar stock
                </h3>
                <StockAdjustForm
                  inventarioId={inv.id}
                  cantidadActual={inv.cantidad}
                  onSuccess={fetchData}
                />
              </div>
            )}
          </div>

          {/* Historial de movimientos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-4">
                Historial de movimientos
              </h3>
              {movimientos.length === 0 ? (
                <p className="text-sm text-[var(--color-warm-gray)]">
                  Sin movimientos registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {movimientos.map((mov) => (
                    <div
                      key={mov.id}
                      className="flex items-start justify-between py-2 border-b border-[var(--color-sand)]/10 last:border-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium ${
                              mov.tipo === "entrada" || mov.tipo === "devolucion"
                                ? "text-green-600"
                                : mov.tipo === "salida"
                                  ? "text-red-600"
                                  : "text-amber-600"
                            }`}
                          >
                            {TIPO_LABELS[mov.tipo] || mov.tipo}
                          </span>
                          <span className="text-xs text-[var(--color-warm-gray)]">
                            {mov.tipo === "entrada" || mov.tipo === "devolucion"
                              ? `+${mov.cantidad}`
                              : mov.tipo === "salida"
                                ? `-${mov.cantidad}`
                                : `→ ${mov.cantidad_despues}`}
                          </span>
                        </div>
                        {mov.nota && (
                          <p className="text-[10px] text-[var(--color-warm-gray)] mt-0.5">
                            {mov.nota}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--color-warm-gray)]">
                          {mov.cantidad_antes} → {mov.cantidad_despues}
                        </p>
                        <p className="text-[10px] text-[var(--color-warm-gray)]/60">
                          {formatDate(mov.creado_en)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <ProductForm
          mode="edit"
          initialData={{
            id: producto.id,
            nombre: producto.nombre,
            slug: producto.slug,
            categoria: producto.categoria,
            sku: producto.sku || "",
            precio_costo: producto.precio_costo,
            precio_venta: producto.precio_venta,
            descripcion: producto.descripcion || "",
            dimensiones: producto.dimensiones || "",
            materiales: producto.materiales || [],
            acabados: producto.acabados || [],
            imagen_url: producto.imagen_url || "",
          }}
        />
      )}
    </div>
  );
}
