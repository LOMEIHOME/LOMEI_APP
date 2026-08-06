"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getCategoryEmoji } from "@/lib/constants";
import CorrelacionGraph from "@/components/admin/CorrelacionGraph";

interface Correlacion {
  a: string;
  b: string;
  nombre_a: string;
  nombre_b: string;
  cat_a: string;
  cat_b: string;
  count: number;
}

export default function CorrelacionesPage() {
  const [correlaciones, setCorrelaciones] = useState<Correlacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/correlacion");
      const json = await res.json();
      setCorrelaciones(json.data || []);
    } catch {
      setError("No se pudieron cargar las correlaciones.");
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
      <div className="mb-6">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#37352f] leading-tight">
          {"\u{1F517}"} Correlaciones
        </h1>
        <p className="mt-1 text-[13px] sm:text-[14px] text-[#8b867c]">
          Productos que se compran juntos en el mismo ticket
        </p>
      </div>

      {correlaciones.length === 0 ? (
        <div className="rounded-xl border border-[#eeece7] bg-[#f8f7f4] p-12 text-center">
          <div className="text-[32px] mb-3">{"\u{1F517}"}</div>
          <p className="text-[14px] text-[#37352f] font-medium mb-1">
            Sin correlaciones aún
          </p>
          <p className="text-[13px] text-[#9b968c] max-w-[360px] mx-auto">
            Las correlaciones aparecen cuando se venden 2 o más productos en el
            mismo ticket. Realiza ventas desde el{" "}
            <Link
              href="/admin/pos"
              className="text-[#37352f] underline hover:no-underline"
            >
              Punto de Venta
            </Link>{" "}
            para ver los patrones.
          </p>
        </div>
      ) : (
        <>
          {/* Grafo de red */}
          <div className="mb-6 hidden sm:block">
            <CorrelacionGraph correlaciones={correlaciones} />
          </div>

          {/* Lista de pares (siempre visible, debajo del grafo en desktop, única vista en mobile) */}
          <div>
            <h2 className="text-[15px] font-bold text-[#37352f] mb-3">
              Detalle de pares
            </h2>
            <div className="flex flex-col gap-2">
              {correlaciones.map((corr) => (
                <div
                  key={`${corr.a}-${corr.b}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#eeece7] bg-white"
                >
                  {/* Emojis */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[15px]">
                      {getCategoryEmoji(corr.cat_a)}
                    </span>
                    <span className="text-[11px] text-[#c5c0b8]">+</span>
                    <span className="text-[15px]">
                      {getCategoryEmoji(corr.cat_b)}
                    </span>
                  </div>

                  {/* Nombres */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#37352f]">
                      <span className="font-medium">{corr.nombre_a}</span>
                      <span className="text-[#9b968c] mx-2">+</span>
                      <span className="font-medium">{corr.nombre_b}</span>
                    </div>
                    <div className="text-[11px] text-[#9b968c] mt-0.5">
                      {corr.cat_a}
                      {corr.cat_a !== corr.cat_b ? ` · ${corr.cat_b}` : ""}
                    </div>
                  </div>

                  {/* Count */}
                  <div className="text-right shrink-0">
                    <div className="text-[14px] font-semibold text-[#37352f]">
                      {corr.count}
                    </div>
                    <div className="text-[11px] text-[#9b968c]">veces</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
