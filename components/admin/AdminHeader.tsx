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
    <header className="sticky top-0 z-30 flex items-center justify-between h-12 px-4 bg-white border-b border-[#e8e8e8]">
      {/* Hamburguesa solo en movil */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 -ml-1.5 rounded-md text-[#91918e] hover:bg-[#f1f1f0] hover:text-[#37352f] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Espaciador para empujar logout a la derecha en desktop */}
      <div className="hidden lg:block" />

      {/* Cerrar sesion */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] text-[#91918e] hover:bg-[#f1f1f0] hover:text-[#37352f] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        Salir
      </button>
    </header>
  );
}
