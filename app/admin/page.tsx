"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Kpis {
  productos_activos: number;
  stock_bajo: number;
  ventas_mes: number;
  ingresos_mes: number;
}

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

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);

const CATEGORY_EMOJI: Record<string, string> = {
  Muebles: "\u{1F6CB}\uFE0F",
  "Cojines & Textiles": "\u{1F9F6}",
  Adornos: "\u{1F3FA}",
  "Iluminaci\u00f3n": "\u{1F4A1}",
  Alfombras: "\u{1F9F5}",
  Acabados: "\u{1FA9E}",
  Jarrones: "\u{1F3FA}",
  Capelos: "\u{1F514}",
  Relojes: "\u231B",
  Florero: "\u{1F338}",
};

function getCategoryEmoji(cat: string): string {
  return CATEGORY_EMOJI[cat] || "\u{1F4E6}";
}

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
  const router = useRouter();
  const [kpis, setKpis] = useState<Kpis>({
    productos_activos: 0,
    stock_bajo: 0,
    ventas_mes: 0,
    ingresos_mes: 0,
  });
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [kpisRes, alertasRes] = await Promise.all([
        fetch("/api/dashboard/kpis"),
        fetch("/api/inventario?alerta=true"),
      ]);
      const kpisJson = await kpisRes.json();
      const alertasJson = await alertasRes.json();
      setKpis(kpisJson);
      setAlertas(alertasJson.data || []);
    } catch {
      // silenciar errores de red
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

  return (
    <div className="max-w-[960px]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[13px] text-[#9b968c] mb-1">
            {"\u{1F44B}"} Buen día
          </p>
          <h1 className="text-[28px] font-bold text-[#37352f] leading-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-[14px] text-[#8b867c]">{getDateString()}</p>
        </div>
        <Link
          href="/admin/inventario/nuevo"
          className="flex items-center gap-1.5 bg-[#37352f] text-white text-[13px] font-medium rounded-lg px-4 py-2.5 hover:bg-[#2c2a26] transition-colors"
        >
          <span className="text-[15px] leading-none">{"\uFF0B"}</span>
          Nuevo producto
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {/* Productos activos */}
        <div className="bg-[#f8f7f4] rounded-xl p-[17px]">
          <div className="text-[19px] mb-2.5">{"\u{1F4E6}"}</div>
          <div className="text-[28px] font-bold text-[#37352f] leading-none">
            {kpis.productos_activos}
          </div>
          <div className="text-[12.5px] text-[#8b867c] mt-1">
            Productos activos
          </div>
        </div>

        {/* Stock bajo */}
        <button
          onClick={() => router.push("/admin/alertas")}
          className="bg-[#fdf3ec] rounded-xl p-[17px] text-left cursor-pointer hover:bg-[#fceee4] transition-colors"
        >
          <div className="text-[19px] mb-2.5">{"\u26A0\uFE0F"}</div>
          <div className="text-[28px] font-bold text-[#c2410c] leading-none">
            {kpis.stock_bajo}
          </div>
          <div className="text-[12.5px] text-[#b06a44] mt-1">Stock bajo</div>
        </button>

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

      {/* Two-column layout */}
      <div
        className="grid gap-5"
        style={{ gridTemplateColumns: "1.5fr 1fr" }}
      >
        {/* Left: Necesitan reposicion */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-[#37352f]">
              {"\u26A0\uFE0F"} Necesitan reposición
            </h2>
            <Link
              href="/admin/alertas"
              className="text-[12.5px] text-[#9b968c] hover:text-[#6b6760] transition-colors"
            >
              Ver todas
            </Link>
          </div>

          {alertas.length > 0 ? (
            <div className="flex flex-col gap-2">
              {alertas.slice(0, 6).map((item) => {
                const isCritical = item.cantidad === 0;
                const emoji = getCategoryEmoji(item.productos.categoria);
                return (
                  <Link
                    key={item.id}
                    href={`/admin/inventario/${item.producto_id}`}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors hover:shadow-sm ${
                      isCritical
                        ? "border-[#f0c9b4] bg-white hover:bg-[#fffcfa]"
                        : "border-[#eeece7] bg-white hover:bg-[#fafaf8]"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-[38px] h-[38px] rounded-[9px] flex items-center justify-center text-[17px] shrink-0 ${
                        isCritical ? "bg-[#fdf3ec]" : "bg-[#f3f1ec]"
                      }`}
                    >
                      {emoji}
                    </div>

                    {/* Name + category */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium text-[#37352f] truncate">
                        {item.productos.nombre}
                      </div>
                      <div className="text-[11.5px] text-[#9b968c]">
                        {item.productos.categoria}
                      </div>
                    </div>

                    {/* Stock count */}
                    <div className="text-right shrink-0">
                      <div
                        className={`text-[14px] font-semibold ${
                          isCritical ? "text-[#c2410c]" : "text-[#d97706]"
                        }`}
                      >
                        {item.cantidad}
                      </div>
                      <div className="text-[11px] text-[#9b968c]">
                        mín {item.stock_minimo}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#f8f7f4] rounded-xl p-6 text-center">
              <p className="text-[13px] text-[#9b968c]">
                No hay productos con stock bajo
              </p>
            </div>
          )}
        </div>

        {/* Right: Actividad reciente */}
        <div>
          <h2 className="text-[15px] font-bold text-[#37352f] mb-3">
            {"\u{1F552}"} Actividad reciente
          </h2>
          <div className="bg-[#f8f7f4] rounded-xl px-4 py-1">
            <div className="py-4 text-center">
              <p className="text-[13px] text-[#9b968c]">
                Sin actividad reciente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
