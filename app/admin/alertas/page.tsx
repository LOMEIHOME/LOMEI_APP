"use client";

import { useEffect, useState, useCallback } from "react";
import { getCategoryEmoji } from "@/lib/constants";

interface AlertaConfig {
  notificar_email: boolean;
  email_destino: string;
  notificar_whatsapp: boolean;
  telefono_destino: string;
  frecuencia_horas: number;
  activo: boolean;
  umbrales_categoria?: Record<string, number>;
}

interface CategoriaStock {
  total: number;
  productos: number;
}

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
  const [config, setConfig] = useState<AlertaConfig>({
    notificar_email: false,
    email_destino: "",
    notificar_whatsapp: false,
    telefono_destino: "",
    frecuencia_horas: 24,
    activo: true,
    umbrales_categoria: {},
  });
  const [stockPorCategoria, setStockPorCategoria] = useState<Record<string, CategoriaStock>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [configRes, catRes] = await Promise.all([
        fetch("/api/alertas/config"),
        fetch("/api/alertas/categorias"),
      ]);
      const configJson = await configRes.json();
      const catJson = await catRes.json();
      if (configJson.data) setConfig({
        ...configJson.data,
        umbrales_categoria: configJson.data.umbrales_categoria || {},
      });
      setStockPorCategoria(catJson.data || {});
    } catch {
      setError("No se pudieron cargar las alertas.");
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
      setError("No se pudo guardar la configuración.");
    }
    setSaving(false);
  };

  const umbrales = config.umbrales_categoria || {};
  const setUmbral = (cat: string, val: number) => {
    setConfig({
      ...config,
      umbrales_categoria: { ...umbrales, [cat]: val },
    });
  };

  // Categorías con alerta activa (stock total < umbral)
  const categoriasConAlerta = Object.entries(stockPorCategoria)
    .filter(([cat, data]) => {
      const umbral = umbrales[cat];
      return umbral != null && umbral > 0 && data.total < umbral;
    })
    .sort((a, b) => a[1].total - b[1].total);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: "center", fontSize: 14, color: "#9b968c" }}>
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#c2410c", marginBottom: 12 }}>{error}</p>
        <button onClick={fetchData} style={{ fontSize: 13, color: "#37352f", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>Reintentar</button>
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

  const cardStyle: React.CSSProperties = {
    border: "1px solid #eeece7",
    borderRadius: 12,
    padding: 22,
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#37352f", lineHeight: 1.2 }}>
          {"🔔 Alertas"}
        </h1>
        <p style={{ fontSize: 14, color: "#8b867c", marginTop: 4 }}>
          Gestión de alertas y notificaciones de stock
        </p>
      </div>

      {/* ── Alertas por categoría ─────────────────────────── */}
      {categoriasConAlerta.length > 0 && (
        <div
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1efe9" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#37352f" }}>
              Categorías con stock bajo
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f7f4" }}>
                  <th style={thStyle}>Categoría</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Stock total</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Umbral</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Productos</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {categoriasConAlerta.map(([cat, data]) => {
                  const umbral = umbrales[cat] || 0;
                  const pct = umbral > 0 ? data.total / umbral : 1;
                  const isCritical = pct < 0.5;
                  return (
                    <tr key={cat} style={{ borderTop: "1px solid #f1efe9" }}>
                      <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 500, color: "#37352f" }}>
                        {getCategoryEmoji(cat)} {cat}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 14, fontWeight: 600, color: isCritical ? "#c2410c" : "#b7791f" }}>
                        {data.total}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 14, color: "#9b968c" }}>
                        {umbral}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 14, color: "#9b968c" }}>
                        {data.productos}
                      </td>
                      <td style={{ padding: "10px 16px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 500,
                            backgroundColor: isCritical ? "#fdf3ec" : "#fbf3e0",
                            color: isCritical ? "#c2410c" : "#b7791f",
                            lineHeight: 1,
                          }}
                        >
                          {isCritical ? "Crítico" : "Bajo"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Two-column layout: Umbrales + Config ────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
        className="alertas-grid"
      >
        {/* ── Umbrales por categoría ─────────────────────── */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#37352f", marginBottom: 6 }}>
            Umbrales por categoría
          </div>
          <div style={{ fontSize: 12, color: "#9b968c", marginBottom: 16 }}>
            Define el stock mínimo total por categoría. Si el stock total de una categoría baja del umbral, se generará una alerta.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(stockPorCategoria)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([cat, data]) => {
                const umbral = umbrales[cat] ?? "";
                const isLow = typeof umbral === "number" && umbral > 0 && data.total < umbral;
                return (
                  <div
                    key={cat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      borderRadius: 8,
                      backgroundColor: isLow ? "#fdf3ec" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: 15, width: 22, textAlign: "center" }}>
                      {getCategoryEmoji(cat)}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#37352f",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={cat}
                    >
                      {cat}
                    </span>
                    <span style={{ fontSize: 12, color: "#9b968c", minWidth: 24, textAlign: "right" }}>
                      {data.total}
                    </span>
                    <span style={{ fontSize: 11, color: "#c5c0b8" }}>/</span>
                    <input
                      type="number"
                      min={0}
                      value={umbral}
                      onChange={(e) => setUmbral(cat, e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                      placeholder="—"
                      style={{
                        width: 52,
                        padding: "4px 6px",
                        backgroundColor: "#f8f7f4",
                        border: "1px solid #eeece7",
                        borderRadius: 6,
                        fontSize: 13,
                        color: "#37352f",
                        textAlign: "center",
                        outline: "none",
                      }}
                    />
                  </div>
                );
              })}
          </div>

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              style={{
                padding: "8px 16px",
                backgroundColor: "#37352f",
                color: "#fff",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.55 : 1,
              }}
            >
              {saving ? "Guardando..." : "Guardar umbrales"}
            </button>
            {saved && (
              <span style={{ fontSize: 12, color: "#16794a", fontWeight: 500 }}>
                Guardado
              </span>
            )}
          </div>
        </div>

        {/* ── Config card ────────────────────────────────── */}
        <div style={cardStyle}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#37352f", marginBottom: 20 }}>
            Configuración de alertas
          </div>

          {/* Email toggle */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f" }}>Notificaciones por email</div>
                <div style={{ fontSize: 12, color: "#9b968c", marginTop: 2 }}>Recibe alertas de stock bajo por correo</div>
              </div>
              <Toggle checked={config.notificar_email} onChange={(v) => setConfig({ ...config, notificar_email: v })} />
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f" }}>Notificaciones por WhatsApp</div>
                <div style={{ fontSize: 12, color: "#9b968c", marginTop: 2 }}>Recibe alertas directamente en tu teléfono</div>
              </div>
              <Toggle checked={config.notificar_whatsapp} onChange={(v) => setConfig({ ...config, notificar_whatsapp: v })} />
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

          {/* Frequency */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f", marginBottom: 6 }}>Frecuencia de notificaciones</div>
            <select
              value={config.frecuencia_horas}
              onChange={(e) => setConfig({ ...config, frecuencia_horas: Number(e.target.value) })}
              style={{ ...inputStyle, appearance: "auto" as React.CSSProperties["appearance"], cursor: "pointer" }}
            >
              <option value={6}>Cada 6 horas</option>
              <option value={12}>Cada 12 horas</option>
              <option value={24}>Cada 24 horas</option>
              <option value={48}>Cada 48 horas</option>
            </select>
          </div>

          {/* Alertas activas */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#37352f" }}>Alertas activas</div>
              <div style={{ fontSize: 12, color: "#9b968c", marginTop: 2 }}>Activar o desactivar todas las alertas</div>
            </div>
            <Toggle checked={config.activo} onChange={(v) => setConfig({ ...config, activo: v })} />
          </div>

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
            }}
          >
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>

      </div>

      {/* Responsive: stack columns on smaller screens */}
      <style>{`
        @media (max-width: 768px) {
          .alertas-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
