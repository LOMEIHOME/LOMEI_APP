"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 bg-[var(--color-cream)] border-b border-[var(--color-sand)]/40">
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 -ml-2 text-[var(--color-dark)] hover:text-[var(--color-oak)] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Título de sección (placeholder) */}
      <div className="hidden lg:block">
        <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-warm-gray)]">
          Panel de Administración
        </p>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-xs tracking-wider uppercase text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          Salir
        </button>
      </div>
    </header>
  );
}
