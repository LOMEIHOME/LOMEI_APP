"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getCategoryEmoji } from "@/lib/constants";

interface Kpis {
  productos_activos: number;
  stock_bajo: number;
  ventas_mes: number;
  ingresos_mes: number;
  productos_por_categoria?: Record<string, number>;
  stock_bajo_por_categoria?: Record<string, number>;
}

interface TopProducto {
  producto_id: string;
  nombre: string;
  categoria: string;
  vendidos: number;
}

interface StockCategoria {
  total: number;
  productos: number;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);

// CATEGORY_EMOJI y getCategoryEmoji importados de @/lib/constants

function getDateString(): string {
  const now = new Date();
  const days = [
    "domingo",
    "lunes",
    "martes",
    "mi\u00e9rcoles",
    "jueves",
    "viernes",
    "s\u00e1bado",
  ];
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `Resumen de hoy, ${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]}.`;
}

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<Kpis>({
    productos_activos: 0,
    stock_bajo: 0,
    ventas_mes: 0,
    ingresos_mes: 0,
  });
  const [topProductos, setTopProductos] = useState<TopProducto[]>([]);
  const [stockPorCategoria, setStockPorCategoria] = useState<Record<string, StockCategoria>>({});
  const [umbrales, setUmbrales] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [kpisRes, topRes, catRes, configRes] = await Promise.all([
        fetch("/api/dashboard/kpis"),
        fetch("/api/dashboard/top-productos"),
        fetch("/api/alertas/categorias"),
        fetch("/api/alertas/config"),
      ]);
      const kpisJson = await kpisRes.json();
      const topJson = await topRes.json();
      const catJson = await catRes.json();
      const configJson = await configRes.json();
      setKpis(kpisJson.data || kpisJson);
      setTopProductos(topJson.data || []);
      setStockPorCategoria(catJson.data || {});
      setUmbrales(configJson.data?.umbrales_categoria || {});
    } catch {
      setError("No se pudieron cargar los datos.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="p-12 text-center text-[13px] text-[#9b968c]">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center">
        <p className="text-[14px] text-[#c2410c] mb-3">{error}</p>
        <button
          onClick={fetchData}
          className="text-[13px] text-[#37352f] underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[960px]">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-[#9b968c] mb-1">
            {"\u{1F44B}"} Buen día
          </p>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#37352f] leading-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-[13px] sm:text-[14px] text-[#8b867c]">{getDateString()}</p>
        </div>
        <Link
          href="/admin/inventario/nuevo"
          className="flex items-center justify-center gap-1.5 bg-[#37352f] text-white text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-[#2c2a26] transition-colors shrink-0 w-full sm:w-auto"
        >
          <span className="text-[15px] leading-none">{"\uFF0B"}</span>
          Nuevo producto
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-7">
        {/* Productos activos */}
        <div className="bg-[#f8f7f4] rounded-xl p-[17px] group relative">
          <div className="text-[19px] mb-2.5">{"\u{1F4E6}"}</div>
          <div className="text-[28px] font-bold text-[#37352f] leading-none">
            {kpis.productos_activos}
          </div>
          <div className="text-[12.5px] text-[#8b867c] mt-1">
            Productos activos
          </div>
          {kpis.productos_por_categoria && Object.keys(kpis.productos_por_categoria).length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#e6e3db] space-y-1">
              {Object.entries(kpis.productos_por_categoria)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between text-[11.5px]">
                    <span className="text-[#8b867c] truncate">
                      {getCategoryEmoji(cat)} {cat}
                    </span>
                    <span className="text-[#37352f] font-medium ml-2">{count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Ventas del mes */}
        <div className="bg-[#f8f7f4] rounded-xl p-[17px]">
          <div className="text-[19px] mb-2.5">{"\u{1F6CD}\uFE0F"}</div>
          <div className="text-[28px] font-bold text-[#37352f] leading-none">
            {kpis.ventas_mes}
          </div>
          <div className="text-[12.5px] text-[#8b867c] mt-1">
            Ventas del mes
          </div>
        </div>

        {/* Ingresos del mes */}
        <div className="bg-[#f8f7f4] rounded-xl p-[17px]">
          <div className="text-[19px] mb-2.5">{"\u{1F4C8}"}</div>
          <div className="text-[28px] font-bold text-[#37352f] leading-none">
            {formatPrice(kpis.ingresos_mes)}
          </div>
          <div className="text-[12.5px] text-[#8b867c] mt-1">
            Ingresos del mes
          </div>
        </div>
      </div>

      {/* Two-column layout — stacks on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-5">
        {/* Left: Stock por categoría */}
        {Object.keys(stockPorCategoria).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-[#37352f]">
                {"\u{1F4CA}"} Stock por categoría
              </h2>
              <Link
                href="/admin/alertas"
                className="text-[12.5px] text-[#9b968c] hover:text-[#6b6760] transition-colors"
              >
                Configurar umbrales
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(stockPorCategoria)
                .sort(([, a], [, b]) => a.total - b.total)
                .map(([cat, info]) => {
                  const umbral = umbrales[cat] || 0;
                  const bajoPorUmbral = umbral > 0 && info.total <= umbral;
                  return (
                    <div
                      key={cat}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        bajoPorUmbral
                          ? "border-[#f0c9b4] bg-[#fffcfa]"
                          : "border-[#eeece7] bg-white"
                      }`}
                    >
                      <div
                        className={`w-[38px] h-[38px] rounded-[9px] flex items-center justify-center text-[17px] shrink-0 ${
                          bajoPorUmbral ? "bg-[#fdf3ec]" : "bg-[#f3f1ec]"
                        }`}
                      >
                        {getCategoryEmoji(cat)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#37352f] truncate">
                          {cat}
                        </div>
                        <div className="text-[11px] text-[#9b968c]">
                          {info.productos} producto{info.productos !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          className={`text-[14px] font-semibold ${
                            bajoPorUmbral ? "text-[#c2410c]" : "text-[#37352f]"
                          }`}
                        >
                          {info.total}
                        </div>
                        <div className="text-[11px] text-[#9b968c]">
                          {umbral > 0 ? `mín ${umbral}` : "sin mín"}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Right: Top 5 más vendidos */}
        <div>
          <h2 className="text-[15px] font-bold text-[#37352f] mb-3">
            {"\u{1F3C6}"} Más vendidos
          </h2>
          {topProductos.length > 0 ? (
            <div className="flex flex-col gap-2">
              {topProductos.map((item, i) => {
                const emoji = getCategoryEmoji(item.categoria);
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <Link
                    key={item.producto_id}
                    href={`/admin/inventario/${item.producto_id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#eeece7] bg-white hover:bg-[#fafaf8] transition-colors"
                  >
                    {/* Posición */}
                    <div className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center text-[17px] shrink-0 bg-[#f3f1ec]">
                      {i < 3 ? medals[i] : emoji}
                    </div>

                    {/* Nombre + categoría */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium text-[#37352f] truncate">
                        {item.nombre}
                      </div>
                      <div className="text-[11.5px] text-[#9b968c]">
                        {item.categoria}
                      </div>
                    </div>

                    {/* Vendidos */}
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-semibold text-[#37352f]">
                        {item.vendidos}
                      </div>
                      <div className="text-[11px] text-[#9b968c]">vendidos</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#f8f7f4] rounded-xl p-6 text-center">
              <p className="text-[13px] text-[#9b968c]">
                Aún no hay ventas registradas
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
