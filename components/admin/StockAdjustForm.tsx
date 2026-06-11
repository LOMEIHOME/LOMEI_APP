"use client";

import { useState } from "react";

interface StockAdjustFormProps {
  inventarioId: string;
  cantidadActual: number;
  onSuccess: () => void;
}

const TIPOS = [
  { value: "entrada", label: "Entrada", desc: "Producto recibido / restock" },
  { value: "salida", label: "Salida", desc: "Producto vendido / retirado" },
  { value: "ajuste", label: "Ajuste", desc: "Corrección manual (valor absoluto)" },
  { value: "devolucion", label: "Devolución", desc: "Producto devuelto" },
];

export default function StockAdjustForm({
  inventarioId,
  cantidadActual,
  onSuccess,
}: StockAdjustFormProps) {
  const [tipo, setTipo] = useState("entrada");
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/inventario/${inventarioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, cantidad, nota: nota || null }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Error al ajustar stock");
      setLoading(false);
      return;
    }

    setCantidad(1);
    setNota("");
    setLoading(false);
    onSuccess();
  };

  // Preview del resultado
  let preview = cantidadActual;
  if (tipo === "entrada" || tipo === "devolucion") preview = cantidadActual + Math.abs(cantidad);
  else if (tipo === "salida") preview = Math.max(0, cantidadActual - Math.abs(cantidad));
  else if (tipo === "ajuste") preview = Math.max(0, cantidad);

  const inputClass =
    "w-full px-4 py-2.5 bg-white border border-[var(--color-sand)]/50 rounded-sm text-sm text-[var(--color-dark)] focus:outline-none focus:border-[var(--color-oak)] transition-colors";
  const labelClass =
    "block text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Tipo de movimiento</label>
        <div className="grid grid-cols-2 gap-2">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTipo(t.value)}
              className={`p-3 text-left rounded-sm border transition-colors ${
                tipo === t.value
                  ? "border-[var(--color-oak)] bg-[var(--color-linen)]"
                  : "border-[var(--color-sand)]/30 hover:border-[var(--color-sand)]"
              }`}
            >
              <p className="text-xs font-medium text-[var(--color-dark)]">{t.label}</p>
              <p className="text-[10px] text-[var(--color-warm-gray)] mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          {tipo === "ajuste" ? "Nueva cantidad" : "Cantidad"}
        </label>
        <input
          type="number"
          min={tipo === "ajuste" ? 0 : 1}
          required
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-linen)]/60 rounded-sm">
        <span className="text-xs text-[var(--color-warm-gray)]">
          {cantidadActual}
        </span>
        <span className="text-xs text-[var(--color-warm-gray)]">&rarr;</span>
        <span className="text-xs font-medium text-[var(--color-dark)]">
          {preview}
        </span>
        <span className="text-[10px] text-[var(--color-warm-gray)]">unidades</span>
      </div>

      <div>
        <label className={labelClass}>Nota (opcional)</label>
        <input
          type="text"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          className={inputClass}
          placeholder="Motivo del ajuste..."
        />
      </div>

      {error && <p className="text-xs text-red-600/80">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[var(--color-dark)] text-white text-xs tracking-[0.15em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Aplicar movimiento"}
      </button>
    </form>
  );
}
