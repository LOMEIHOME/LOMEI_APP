"use client";

import { useEffect, useState, useCallback } from "react";
import { getStockStatus } from "@/components/admin/StatusBadge";

interface AlertaItem {
  id: string;
  producto_id: string;
  cantidad: number;
  stock_minimo: number;
  productos: {
    id: string;
    nombre: string;
    categoria: string;
  };
}

interface AlertaConfig {
  notificar_email: boolean;
  email_destino: string;
  notificar_whatsapp: boolean;
  telefono_destino: string;
  frecuencia_horas: number;
  activo: boolean;
}

interface AlertaLog {
  id: string;
  creado_en: string;
  productos: { nombre: string } | null;
  cantidad_actual: number;
  canal: string;
  enviado: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  low: { label: "Bajo", bg: "#fbf3e0", color: "#b7791f" },
  ok: { label: "En stock", bg: "#e6f4ea", color: "#16794a" },
  out: { label: "Agotado", bg: "#fde8e8", color: "#c0392b" },
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

/* ── Toggle switch component ──────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        width: 38,
        height: 22,
        borderRadius: 11,
        backgroundColor: checked ? "#37352f" : "#d8d3c8",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 19 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [config, setConfig] = useState<AlertaConfig>({
    notificar_email: false,
    email_destino: "",
    notificar_whatsapp: false,
    telefono_destino: "",
    frecuencia_horas: 24,
    activo: true,
  });
  const [logs, setLogs] = useState<AlertaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [alertasRes, configRes, logsRes] = await Promise.all([
        fetch("/api/inventario?alerta=true"),
        fetch("/api/alertas/config"),
        fetch("/api/alertas/log"),
      ]);
      const alertasJson = await alertasRes.json();
      const configJson = await configRes.json();
      const logsJson = await logsRes.json();
      setAlertas(alertasJson.data || []);
      if (configJson.data) setConfig(configJson.data);
      setLogs(logsJson.data || []);
    } catch {
      // silenciar errores de red
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await fetch("/api/alertas/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silenciar errores
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
        Cargando...
      </div>
    );
  }

  /* ── Shared styles ──────────────────────────────────────── */
  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "10px 16px",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#9b968c",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#f8f7f4",
    border: "1px solid #eeece7",
    borderRadius: 9,
    fontSize: 13.5,
    color: "#37352f",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#37352f", lineHeight: 1.2 }}>
          {"🔔 Alertas"}
        </h1>
        <p style={{ fontSize: 14, color: "#8b867c", marginTop: 4 }}>
          Gesti&oacute;n de alertas y notificaciones de stock
        </p>
      </div>

      {/* ── Low stock table ───────────────────────────────── */}
      <div
        style={{
          border: "1px solid #eeece7",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #f1efe9",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: "#37352f" }}>
            Productos con stock bajo
          </span>
        </div>

        {alertas.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f7f4" }}>
                  <th style={thStyle}>Producto</th>
                  <th style={thStyle}>Categor&iacute;a</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actual</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>M&iacute;nimo</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alertas.map((item) => {
                  const status = getStockStatus(item.cantidad, item.stock_minimo);
                  const statusConf = STATUS_CONFIG[status] || STATUS_CONFIG.low;
                  const stockColor =
                    status === "out"
                      ? "#c2410c"
                      : status === "low"
                      ? "#b7791f"
                      : "#16794a";

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
                      <td
                        style={{
                          padding: "10px 16px",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#37352f",
                        }}
                      >
                        {item.productos.nombre}
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 14, color: "#9b968c" }}>
                        {item.productos.categoria}
                      </td>
                      <td
                        style={{
                          padding: "10px 16px",
                          textAlign: "right",
                          fontSize: 14,
                          fontWeight: 600,
                          color: stockColor,
                        }}
                      >
                        {item.cantidad}
                      </td>
                      <td
                        style={{
                          padding: "10px 16px",
                          textAlign: "right",
                          fontSize: 14,
                          color: "#9b968c",
                        }}
                      >
                        {item.stock_minimo}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "center" }}>
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
        ) : (
          <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
            No hay productos con stock bajo
          </div>
        )}
      </div>

      {/* ── Two-column layout: Config + History ───────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {/* ── Left: Config card ───────────────────────────── */}
        <div
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            padding: 22,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#37352f", marginBottom: 20 }}>
            Configuraci&oacute;n de alertas
          </div>

          {/* Email toggle */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f" }}>
                  Notificaciones por email
                </div>
                <div style={{ fontSize: 12, color: "#9b968c", marginTop: 2 }}>
                  Recibe alertas de stock bajo por correo
                </div>
              </div>
              <Toggle
                checked={config.notificar_email}
                onChange={(v) => setConfig({ ...config, notificar_email: v })}
              />
            </div>
            {config.notificar_email && (
              <input
                type="email"
                value={config.email_destino}
                onChange={(e) => setConfig({ ...config, email_destino: e.target.value })}
                placeholder="correo@ejemplo.com"
                style={{ ...inputStyle, marginTop: 10 }}
              />
            )}
          </div>

          {/* WhatsApp toggle */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f" }}>
                  Notificaciones por WhatsApp
                </div>
                <div style={{ fontSize: 12, color: "#9b968c", marginTop: 2 }}>
                  Recibe alertas directamente en tu tel&eacute;fono
                </div>
              </div>
              <Toggle
                checked={config.notificar_whatsapp}
                onChange={(v) => setConfig({ ...config, notificar_whatsapp: v })}
              />
            </div>
            {config.notificar_whatsapp && (
              <input
                type="tel"
                value={config.telefono_destino}
                onChange={(e) => setConfig({ ...config, telefono_destino: e.target.value })}
                placeholder="+52 771 100 9084"
                style={{ ...inputStyle, marginTop: 10 }}
              />
            )}
          </div>

          {/* Frequency dropdown */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f", marginBottom: 6 }}>
              Frecuencia de notificaciones
            </div>
            <select
              value={config.frecuencia_horas}
              onChange={(e) =>
                setConfig({ ...config, frecuencia_horas: Number(e.target.value) })
              }
              style={{
                ...inputStyle,
                appearance: "auto" as React.CSSProperties["appearance"],
                cursor: "pointer",
              }}
            >
              <option value={6}>Cada 6 horas</option>
              <option value={12}>Cada 12 horas</option>
              <option value={24}>Cada 24 horas</option>
              <option value={48}>Cada 48 horas</option>
            </select>
          </div>

          {/* Alertas activas toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f" }}>
                Alertas activas
              </div>
              <div style={{ fontSize: 12, color: "#9b968c", marginTop: 2 }}>
                Activar o desactivar todas las alertas
              </div>
            </div>
            <Toggle
              checked={config.activo}
              onChange={(v) => setConfig({ ...config, activo: v })}
            />
          </div>

          {/* Save button */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              style={{
                padding: "9px 18px",
                backgroundColor: "#37352f",
                color: "#fff",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.55 : 1,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.opacity = "1";
              }}
            >
              {saving ? "Guardando..." : "Guardar configuraci\u00f3n"}
            </button>
            {saved && (
              <span style={{ fontSize: 13, color: "#16794a", fontWeight: 500 }}>
                Configuraci&oacute;n guardada
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Alert history ────────────────────────── */}
        <div
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f1efe9",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#37352f" }}>
              Historial de alertas
            </span>
          </div>

          {logs.length > 0 ? (
            <div style={{ flex: 1, overflowY: "auto" }}>
              {logs.map((log, idx) => (
                <div
                  key={log.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderTop: idx > 0 ? "1px solid #f1efe9" : "none",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#faf9f6")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f" }}>
                      {log.productos?.nombre || "Producto"}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#9b968c",
                        marginTop: 3,
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>{formatDate(log.creado_en)}</span>
                      <span>&middot;</span>
                      <span>{log.canal}</span>
                      <span>&middot;</span>
                      <span>Stock: {log.cantidad_actual}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: log.enviado ? "#16794a" : "#c0392b",
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    {log.enviado ? "\u2713" : "\u2715"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
              Sin alertas registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
