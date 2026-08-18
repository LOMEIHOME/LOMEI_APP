"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", emoji: "📊" },
  { label: "Punto de Venta", href: "/admin/pos", emoji: "🛒" },
  { label: "Inventario", href: "/admin/inventario", emoji: "📦" },
  { label: "Ventas", href: "/admin/ventas", emoji: "💰" },
  { label: "Reportes", href: "/admin/reportes", emoji: "📋" },
  { label: "Órdenes", href: "/admin/ordenes", emoji: "🧾" },
  { label: "Correlaciones", href: "/admin/correlaciones", emoji: "🔗" },
  { label: "Alertas", href: "/admin/alertas", emoji: "🔔", hasAlertBadge: true },
];

const QUICK_LINKS = [
  { label: "Nueva venta", href: "/admin/pos", emoji: "🛒" },
  { label: "Revisar alertas", href: "/admin/alertas", emoji: "🔔" },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [alertCount, setAlertCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Fetch alert count by category thresholds
    Promise.all([
      fetch("/api/alertas/categorias").then((r) => r.json()),
      fetch("/api/alertas/config").then((r) => r.json()),
    ])
      .then(([catJson, configJson]) => {
        const stock: Record<string, { total: number }> = catJson.data || {};
        const umbrales: Record<string, number> =
          configJson.data?.umbrales_categoria || {};
        const count = Object.entries(stock).filter(([cat, info]) => {
          const umbral = umbrales[cat] || 0;
          return umbral > 0 && info.total <= umbral;
        }).length;
        setAlertCount(count);
      })
      .catch(() => {});

    // Fetch user email
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const initials = userEmail
    ? userEmail
        .split("@")[0]
        .split(/[._-]/)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase() || "")
        .join("")
    : "—";

  const displayName = userEmail ? userEmail.split("@")[0] : "Cargando...";

  return (
    <>
      {/* Overlay móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          width: 240,
          backgroundColor: "#f8f7f4",
          borderRight: "1px solid #eeece7",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between" style={{ padding: "20px 16px 16px 16px" }}>
          <Link href="/admin" className="flex items-center gap-2.5" onClick={onClose}>
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: "#37352f",
              }}
            >
              <span className="text-white font-bold" style={{ fontSize: 15, lineHeight: 1 }}>
                L
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="font-semibold leading-tight"
                style={{ fontSize: 14, color: "#37352f" }}
              >
                LOMEI HOME
              </span>
              <span
                className="leading-tight"
                style={{ fontSize: 11.5, color: "#9b9a97" }}
              >
                Panel interno
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center rounded-md hover:bg-black/5 transition-colors"
            style={{ width: 28, height: 28, color: "#9b9a97" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: "4px 12px" }}>
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const badge = item.hasAlertBadge ? alertCount : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 transition-colors duration-150"
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    fontSize: 14,
                    backgroundColor: active ? "#ebe9e3" : "transparent",
                    color: active ? "#37352f" : "#6b6760",
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "#f0efeb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{item.emoji}</span>
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 && (
                    <span
                      style={{
                        backgroundColor: "#f0c4a8",
                        color: "#9a4a16",
                        fontSize: 11,
                        borderRadius: 10,
                        padding: "1px 8px",
                        fontWeight: 500,
                        lineHeight: "18px",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Accesos rápidos */}
          <div style={{ marginTop: 24 }}>
            <div
              className="uppercase font-medium tracking-wider"
              style={{
                fontSize: 10.5,
                color: "#9b9a97",
                padding: "0 10px",
                marginBottom: 6,
              }}
            >
              Accesos rápidos
            </div>
            <div className="flex flex-col gap-0.5">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-2.5 transition-colors duration-150"
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#6b6760",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0efeb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{link.emoji}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Usuario */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #eeece7",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "#ebe9e3",
                color: "#37352f",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="leading-tight truncate"
                style={{ fontSize: 13, fontWeight: 500, color: "#37352f" }}
              >
                {displayName}
              </span>
              <span
                className="leading-tight"
                style={{ fontSize: 11, color: "#9b9a97" }}
              >
                Administradora
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
