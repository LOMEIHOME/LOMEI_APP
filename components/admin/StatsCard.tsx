interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
}

export default function StatsCard({ label, value, subtitle, accent }: StatsCardProps) {
  return (
    <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-5">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)]">
        {label}
      </p>
      <p
        className={`mt-2 font-serif text-3xl tracking-wide ${
          accent ? "text-[var(--color-oak)]" : "text-[var(--color-dark)]"
        }`}
      >
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-[var(--color-warm-gray)]">{subtitle}</p>
      )}
    </div>
  );
}
