interface StatusBadgeProps {
  status: "ok" | "low" | "out";
  label?: string;
}

const STYLES = {
  ok: "bg-green-50 text-green-700 border-green-200",
  low: "bg-amber-50 text-amber-700 border-amber-200",
  out: "bg-red-50 text-red-700 border-red-200",
};

const LABELS = {
  ok: "En stock",
  low: "Stock bajo",
  out: "Agotado",
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase border rounded-sm ${STYLES[status]}`}
    >
      {label || LABELS[status]}
    </span>
  );
}

export function getStockStatus(
  cantidad: number,
  stockMinimo: number
): "ok" | "low" | "out" {
  if (cantidad === 0) return "out";
  if (cantidad <= stockMinimo) return "low";
  return "ok";
}
