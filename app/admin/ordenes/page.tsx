"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/admin/SearchInput";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

type EstadoFilter = "" | "pendiente" | "completada" | "cancelada";

interface Orden {
  id: string;
  numero: number;
  cliente_nombre: string;
  created_at: string;
  total: number;
  estado: "pendiente" | "completada" | "cancelada";
}

interface Pagination {
  page: number;
  pages: number;
  total: number;
}

const ESTADOS: { key: EstadoFilter; label: string }[] = [
  { key: "", label: "Todas" },
  { key: "pendiente", label: "Pendiente" },
  { key: "completada", label: "Completada" },
  { key: "cancelada", label: "Cancelada" },
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<EstadoFilter>("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (estado) params.set("estado", estado);
      if (search) params.set("search", search);
      params.set("page", String(page));

      const res = await fetch(`/api/ordenes?${params}`);
      const json = await res.json();
      setOrdenes(json.data || []);
      if (json.pagination) setPagination(json.pagination);
    } catch {
      // silenciar errores de red
    }
    setLoading(false);
  }, [estado, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reiniciar página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [estado, search]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#37352f",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {"🧾 Órdenes"}
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#8b867c",
            marginTop: 4,
          }}
        >
          {pagination.total} orden{pagination.total !== 1 ? "es" : ""} registrada{pagination.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por número o cliente..."
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ESTADOS.map((e) => {
            const isActive = estado === e.key;
            return (
              <button
                key={e.key}
                onClick={() => setEstado(e.key)}
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
                }}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

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
        ) : ordenes.length === 0 ? (
          <div
            style={{
              padding: 48,
              textAlign: "center",
              fontSize: 14,
              color: "#9b968c",
            }}
          >
            No hay órdenes que mostrar.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f7f4" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#9b968c",
                      borderBottom: "1px solid #eeece7",
                    }}
                  >
                    Número
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#9b968c",
                      borderBottom: "1px solid #eeece7",
                    }}
                  >
                    Cliente
                  </th>
                  <th
                    className="hidden sm:table-cell"
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#9b968c",
                      borderBottom: "1px solid #eeece7",
                    }}
                  >
                    Fecha
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#9b968c",
                      borderBottom: "1px solid #eeece7",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "10px 16px",
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#9b968c",
                      borderBottom: "1px solid #eeece7",
                    }}
                  >
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o, i) => (
                    <tr
                      key={o.id}
                      onClick={() => router.push(`/admin/ordenes/${o.id}`)}
                      style={{
                        borderBottom: i < ordenes.length - 1 ? "1px solid #f3f1ec" : "none",
                        cursor: "pointer",
                        transition: "background 0.1s ease",
                      }}
                      className="hover:bg-[#f8f7f4]"
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#37352f",
                        }}
                      >
                        #{String(o.numero).padStart(4, "0")}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#37352f",
                          fontSize: 14,
                        }}
                      >
                        {o.cliente_nombre}
                      </td>
                      <td
                        className="hidden sm:table-cell"
                        style={{
                          padding: "12px 16px",
                          color: "#9b968c",
                          fontSize: 13,
                        }}
                      >
                        {formatDate(o.created_at)}
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
                        {formatPrice(o.total)}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                        }}
                      >
                        <OrderStatusBadge estado={o.estado} />
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            marginTop: 24,
          }}
        >
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 6,
                border: page === p ? "1px solid #37352f" : "1px solid #e6e3db",
                backgroundColor: page === p ? "#37352f" : "#fff",
                color: page === p ? "#fff" : "#6b6760",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
