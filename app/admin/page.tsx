import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";

export default function AdminDashboardPage() {
  // TODO: Reemplazar con datos reales de Supabase
  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl tracking-wider text-[var(--color-dark)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
          Resumen general de operaciones
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Productos" value="—" subtitle="En catálogo" />
        <StatsCard label="Stock bajo" value="—" subtitle="Requieren atención" accent />
        <StatsCard label="Ventas del mes" value="—" subtitle="Órdenes completadas" />
        <StatsCard label="Ingresos" value="—" subtitle="Este mes" />
      </div>

      {/* Alertas de stock bajo */}
      <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium tracking-wide text-[var(--color-dark)]">
            Alertas de stock bajo
          </h2>
          <Link
            href="/admin/alertas"
            className="text-xs text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors"
          >
            Ver todas
          </Link>
        </div>
        <p className="text-sm text-[var(--color-warm-gray)]">
          Conecta Supabase para ver alertas en tiempo real.
        </p>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/inventario/nuevo"
          className="flex items-center gap-3 p-4 bg-white rounded-sm border border-[var(--color-sand)]/30 hover:border-[var(--color-oak)]/40 transition-colors group"
        >
          <div className="w-9 h-9 rounded-sm bg-[var(--color-linen)] flex items-center justify-center text-[var(--color-oak)] group-hover:bg-[var(--color-oak)] group-hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-[var(--color-dark)]">Nuevo producto</p>
            <p className="text-[10px] text-[var(--color-warm-gray)]">Agregar al inventario</p>
          </div>
        </Link>

        <Link
          href="/admin/ventas/nueva"
          className="flex items-center gap-3 p-4 bg-white rounded-sm border border-[var(--color-sand)]/30 hover:border-[var(--color-oak)]/40 transition-colors group"
        >
          <div className="w-9 h-9 rounded-sm bg-[var(--color-linen)] flex items-center justify-center text-[var(--color-oak)] group-hover:bg-[var(--color-oak)] group-hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-[var(--color-dark)]">Registrar venta</p>
            <p className="text-[10px] text-[var(--color-warm-gray)]">Nueva orden manual</p>
          </div>
        </Link>

        <Link
          href="/admin/inventario"
          className="flex items-center gap-3 p-4 bg-white rounded-sm border border-[var(--color-sand)]/30 hover:border-[var(--color-oak)]/40 transition-colors group"
        >
          <div className="w-9 h-9 rounded-sm bg-[var(--color-linen)] flex items-center justify-center text-[var(--color-oak)] group-hover:bg-[var(--color-oak)] group-hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-[var(--color-dark)]">Ver inventario</p>
            <p className="text-[10px] text-[var(--color-warm-gray)]">Consultar stock actual</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
