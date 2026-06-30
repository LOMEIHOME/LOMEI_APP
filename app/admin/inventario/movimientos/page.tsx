"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Movimiento {
  id: string;
  producto_id: string;
  tipo: string;
  cantidad: number;
  cantidad_antes: number;
  cantidad_despues: number;
  nota: string | null;
  creado_en: string;
  productos: { nombre: string; slug: string };
}

const TIPO_CONFIG: Record<string, { label: string; color: string }> = {
  entrada: { label: "Entrada", color: "#16794a" },
  salida: { label: "Salida", color: "#c2410c" },
  ajuste: { label: "Ajuste", color: "#b7791f" },
  devolucion: { label: "Devolución", color: "#16794a" },
};

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`/api/inventario/movimientos?page=${page}&limit=30`);
      const json = await res.json();
      setMovimientos(json.data || []);
      setTotalPages(json.pagination?.pages || 1);
      setLoading(false);
    }
    fetchData();
  }, [page]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#9b968c", marginBottom: 16 }}>
        <Link href="/admin/inventario" style={{ color: "#9b968c", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#37352f")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9b968c")}>
          Inventario
        </Link>
        <span>/</span>
        <span style={{ color: "#37352f" }}>Movimientos</span>
      </div>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#37352f" }}>
          📋 Historial de movimientos
        </h1>
        <p style={{ fontSize: 14, color: "#8b867c", marginTop: 4 }}>
          Registro de todos los cambios de stock
        </p>
      </div>

      <div style={{ border: "1px solid #eeece7", borderRadius: 12, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
            Cargando movimientos...
          </div>
        ) : movimientos.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
            Sin movimientos registrados.
          </div>
        ) : (
          <>
            {movimientos.map((mov) => {
              const cfg = TIPO_CONFIG[mov.tipo] || { label: mov.tipo, color: "#6b6760" };
              const delta = mov.cantidad_despues - mov.cantidad_antes;
              const deltaStr = (delta >= 0 ? "+" : "") + delta;

              return (
                <div
                  key={mov.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 18px",
                    borderBottom: "1px solid #f4f2ec",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#faf9f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: 12.5, color: cfg.color, fontVariantNumeric: "tabular-nums" }}>
                        {deltaStr}
                      </span>
                      <span style={{ fontSize: 12.5, color: "#9b968c" }}>·</span>
                      <Link
                        href={`/admin/inventario/${mov.producto_id}`}
                        style={{ fontSize: 13, color: "#37352f", textDecoration: "none", fontWeight: 500 }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#6b6760")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#37352f")}
                      >
                        {mov.productos?.nombre || "—"}
                      </Link>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#9b968c", marginTop: 2 }}>
                      {mov.nota || "Sin nota"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    <div style={{ fontSize: 12.5, color: "#6b6760" }}>
                      {mov.cantidad_antes} → {mov.cantidad_despues}
                    </div>
                    <div style={{ fontSize: 11, color: "#b3ada1" }}>
                      {formatDate(mov.creado_en)}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {totalPages > 1 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "12px 0",
            borderTop: "1px solid #f1efe9",
          }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                fontFamily: "inherit",
                fontSize: 12.5,
                color: page === 1 ? "#d8d3c8" : "#6b6760",
                background: "transparent",
                border: 0,
                cursor: page === 1 ? "default" : "pointer",
              }}
            >
              ← Anterior
            </button>
            <span style={{ fontSize: 12.5, color: "#9b968c" }}>
              {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                fontFamily: "inherit",
                fontSize: 12.5,
                color: page === totalPages ? "#d8d3c8" : "#6b6760",
                background: "transparent",
                border: 0,
                cursor: page === totalPages ? "default" : "pointer",
              }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
