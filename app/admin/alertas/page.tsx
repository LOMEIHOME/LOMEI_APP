"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import StatusBadge, { getStockStatus } from "@/components/admin/StatusBadge";

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
  created_at: string;
  producto_nombre: string;
  stock_actual: number;
  canal: string;
  enviado: boolean;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

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
      if (configJson) setConfig(configJson);
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
      <div className="p-12 text-center text-sm text-[var(--color-warm-gray)]">
        Cargando...
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
          Alertas
        </h1>
        <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
          Gestión de alertas y notificaciones de stock
        </p>
      </div>

      {/* Sección 1: Productos con stock bajo */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[var(--color-sand)]/20">
          <h2 className="text-sm font-medium tracking-wide text-[var(--color-dark)]">
            Productos con stock bajo
          </h2>
        </div>

        {alertas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sand)]/20">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Producto
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden md:table-cell">
                    Categoría
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Stock actual
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden sm:table-cell">
                    Stock mínimo
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {alertas.map((item) => {
                  const status = getStockStatus(item.cantidad, item.stock_minimo);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--color-sand)]/10 hover:bg-[var(--color-linen)]/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/inventario/${item.productos.id}`}
                          className="text-[var(--color-dark)] hover:text-[var(--color-oak)] transition-colors font-medium"
                        >
                          {item.productos.nombre}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-warm-gray)] hidden md:table-cell">
                        {item.productos.categoria}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[var(--color-dark)]">
                        {item.cantidad}
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--color-warm-gray)] hidden sm:table-cell">
                        {item.stock_minimo}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-warm-gray)]">
              No hay productos con stock bajo
            </p>
          </div>
        )}
      </div>

      {/* Sección 2: Configuración de alertas */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-6 mb-6">
        <h2 className="text-sm font-medium tracking-wide text-[var(--color-dark)] mb-6">
          Configuración de alertas
        </h2>

        <div className="space-y-5 max-w-lg">
          {/* Notificar por email */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.notificar_email}
              onChange={(e) => setConfig({ ...config, notificar_email: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-oak)]"
            />
            <label className="text-sm text-[var(--color-dark)]">
              Notificaciones por email
            </label>
          </div>
          {config.notificar_email && (
            <input
              type="email"
              value={config.email_destino}
              onChange={(e) => setConfig({ ...config, email_destino: e.target.value })}
              placeholder="correo@ejemplo.com"
              className="w-full px-3 py-2 text-sm border border-[var(--color-sand)]/40 rounded-sm focus:outline-none focus:border-[var(--color-oak)]"
            />
          )}

          {/* Notificar por WhatsApp */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.notificar_whatsapp}
              onChange={(e) => setConfig({ ...config, notificar_whatsapp: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-oak)]"
            />
            <label className="text-sm text-[var(--color-dark)]">
              Notificaciones por WhatsApp
            </label>
          </div>
          {config.notificar_whatsapp && (
            <input
              type="tel"
              value={config.telefono_destino}
              onChange={(e) => setConfig({ ...config, telefono_destino: e.target.value })}
              placeholder="+52 771 100 9084"
              className="w-full px-3 py-2 text-sm border border-[var(--color-sand)]/40 rounded-sm focus:outline-none focus:border-[var(--color-oak)]"
            />
          )}

          {/* Frecuencia */}
          <div>
            <label className="block text-sm text-[var(--color-dark)] mb-1.5">
              Frecuencia de notificaciones
            </label>
            <select
              value={config.frecuencia_horas}
              onChange={(e) => setConfig({ ...config, frecuencia_horas: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-[var(--color-sand)]/40 rounded-sm focus:outline-none focus:border-[var(--color-oak)]"
            >
              <option value={6}>Cada 6 horas</option>
              <option value={12}>Cada 12 horas</option>
              <option value={24}>Cada 24 horas</option>
              <option value={48}>Cada 48 horas</option>
            </select>
          </div>

          {/* Alertas activas */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={config.activo}
              onChange={(e) => setConfig({ ...config, activo: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-oak)]"
            />
            <label className="text-sm text-[var(--color-dark)]">
              Alertas activas
            </label>
          </div>

          {/* Botón guardar */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              className="px-4 py-2.5 bg-[var(--color-dark)] text-white text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar configuración"}
            </button>
            {saved && (
              <span className="text-xs text-green-600">
                Configuración guardada
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sección 3: Historial de alertas */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-sand)]/20">
          <h2 className="text-sm font-medium tracking-wide text-[var(--color-dark)]">
            Historial de alertas
          </h2>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-sand)]/20">
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Producto
                  </th>
                  <th className="text-right px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal hidden sm:table-cell">
                    Canal
                  </th>
                  <th className="text-center px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-[var(--color-warm-gray)] font-normal">
                    Enviado
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--color-sand)]/10 hover:bg-[var(--color-linen)]/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-[var(--color-dark)]">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-dark)]">
                      {log.producto_nombre}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--color-dark)]">
                      {log.stock_actual}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-warm-gray)] hidden sm:table-cell">
                      {log.canal}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {log.enviado ? (
                        <span className="text-green-600">&#10003;</span>
                      ) : (
                        <span className="text-red-500">&#10005;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--color-warm-gray)]">
              Sin alertas registradas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
