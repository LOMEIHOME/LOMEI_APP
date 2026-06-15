"use client";

/* ============================================================
   FilterTabs — filtros tipo tab con subrayado camel y conteo
   Sustituye a las pills warm-gray; usado en /proyectos y
   /catalogo. Scrollable horizontal en móvil.
   ============================================================ */
interface FilterTabsProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
  counts?: Record<string, number>;
}

export default function FilterTabs({
  categories,
  active,
  onChange,
  counts,
}: FilterTabsProps) {
  return (
    <div className="flex gap-6 md:gap-8 border-b border-[var(--color-sand)]/55 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex items-baseline gap-1.5 pb-3.5 -mb-px whitespace-nowrap text-xs tracking-[0.18em] uppercase border-b transition-colors duration-400 cursor-pointer ${
            active === cat
              ? "text-[var(--color-dark)] border-[var(--color-camel)]"
              : "text-[var(--color-dark)]/55 border-transparent hover:text-[var(--color-dark)]"
          }`}
        >
          {cat}
          {counts && counts[cat] !== undefined && (
            <span className="font-serif italic text-xs normal-case tracking-normal text-[var(--color-warm-gray)]">
              {counts[cat]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
