interface OrderStatusBadgeProps {
  estado: "pendiente" | "completada" | "cancelada";
}

const STYLES = {
  pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  completada: "bg-green-50 text-green-700 border-green-200",
  cancelada: "bg-red-50 text-red-700 border-red-200",
};

const LABELS = {
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
};

export default function OrderStatusBadge({ estado }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] tracking-wider uppercase border rounded-sm ${STYLES[estado]}`}
    >
      {LABELS[estado]}
    </span>
  );
}
