interface OrderStatusBadgeProps {
  estado: "pendiente" | "completada" | "cancelada";
}

const STYLES: Record<string, string> = {
  completada: "bg-[#eaf3ec] text-[#16794a]",
  pendiente: "bg-[#fbf3e0] text-[#b7791f]",
  cancelada: "bg-[#f1efe9] text-[#8a857c]",
};

const LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
};

export default function OrderStatusBadge({ estado }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full ${STYLES[estado]}`}
    >
      {LABELS[estado]}
    </span>
  );
}
