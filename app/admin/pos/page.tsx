"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { IVA_RATE } from "@/lib/constants";

/* ──────────────────────────── Types ──────────────────────────── */

interface ProductoResult {
  id: string;
  nombre: string;
  slug: string;
  sku: string | null;
  categoria: string;
  precio_venta: number;
  stock: number;
}

interface CartItem {
  producto_id: string;
  slug: string;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  stock_disponible: number;
}

interface ClienteExistente {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: string;
}

interface CompletedOrder {
  folio: string;
  total: number;
  ticket_html: string;
  email: string;
  email_enviado: boolean;
}

const TIPOS_CLIENTE = [
  { value: "menudeo", label: "Menudeo" },
  { value: "mayorista", label: "Mayorista" },
  { value: "disenador", label: "Diseñador" },
  { value: "arquitecto", label: "Arquitecto" },
  { value: "otro", label: "Otro" },
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);

/* ──────────────────────────── Styles ─────────────────────────── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "inherit",
  fontSize: 13.5,
  color: "#37352f",
  border: "1px solid #e6e3db",
  borderRadius: 8,
  padding: "9px 12px",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const sectionHeader: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "#b3ada1",
  marginBottom: 14,
};

/* ──────────────────────────── Page ───────────────────────────── */

export default function PuntoDeVentaPage() {
  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Product search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Client search
  const [clientSearch, setClientSearch] = useState("");
  const [clientResults, setClientResults] = useState<ClienteExistente[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // Client form
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTel, setClienteTel] = useState("");
  const [clienteTipo, setClienteTipo] = useState("menudeo");
  const [nota, setNota] = useState("");
  const [enviarTicket, setEnviarTicket] = useState(false);

  // Checkout
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Product search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await fetch(`/api/pos/productos?search=${encodeURIComponent(searchQuery)}&limit=8`);
      const json = await res.json();
      setSearchResults(json.data || []);
      setShowDropdown(true);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Client search with debounce
  useEffect(() => {
    if (!clientSearch.trim()) {
      setClientResults([]);
      setShowClientDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/clientes?search=${encodeURIComponent(clientSearch)}&limit=5`);
      const json = await res.json();
      setClientResults(json.data || []);
      setShowClientDropdown(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (clientSearchRef.current && !clientSearchRef.current.contains(e.target as Node)) {
        setShowClientDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Add product to cart
  const addToCart = useCallback((producto: ProductoResult) => {
    if (producto.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.producto_id === producto.id);
      if (existing) {
        if (existing.cantidad >= producto.stock) return prev;
        return prev.map((i) =>
          i.producto_id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          producto_id: producto.id,
          slug: producto.slug,
          nombre: producto.nombre,
          precio_unitario: producto.precio_venta,
          cantidad: 1,
          stock_disponible: producto.stock,
        },
      ];
    });
    setSearchQuery("");
    setShowDropdown(false);
  }, []);

  const updateQty = (productoId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.producto_id !== productoId) return i;
          const newQty = i.cantidad + delta;
          if (newQty <= 0) return null;
          if (newQty > i.stock_disponible) return i;
          return { ...i, cantidad: newQty };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productoId: string) => {
    setCart((prev) => prev.filter((i) => i.producto_id !== productoId));
  };

  // Select existing client
  const selectClient = (c: ClienteExistente) => {
    setClienteNombre(c.nombre);
    setClienteEmail(c.email || "");
    setClienteTel(c.telefono || "");
    setClienteTipo(c.tipo);
    setClientSearch("");
    setShowClientDropdown(false);
  };

  // Totals — el precio ya incluye IVA, calcular hacia atrás
  const total = cart.reduce((s, i) => s + i.precio_unitario * i.cantidad, 0);
  const subtotal = Math.round((total / (1 + IVA_RATE)) * 100) / 100;
  const iva = Math.round((total - subtotal) * 100) / 100;

  const canSubmit = cart.length > 0 && clienteNombre.trim() && (!enviarTicket || clienteEmail.trim()) && !isSubmitting;

  // Checkout
  const handleCheckout = async () => {
    if (!canSubmit) return;
    setSubmitError("");
    setIsSubmitting(true);

    // Crear o encontrar cliente
    let clienteId: string | null = null;
    try {
      const clienteRes = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: clienteNombre,
          email: clienteEmail,
          telefono: clienteTel || null,
          tipo: clienteTipo,
        }),
      });
      const clienteJson = await clienteRes.json();
      if (clienteJson.data?.id) {
        clienteId = clienteJson.data.id;
      }
    } catch {
      // Continuar sin cliente_id si falla
    }

    // Crear orden
    const items = cart.map((i) => ({
      slug: i.slug,
      nombre: i.nombre,
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
    }));

    const res = await fetch("/api/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_nombre: clienteNombre,
        cliente_email: clienteEmail || null,
        cliente_tel: clienteTel || null,
        cliente_id: clienteId,
        nota: nota || null,
        enviar_ticket: enviarTicket,
        items,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setSubmitError(json.error || "Error al procesar la venta");
      setIsSubmitting(false);
      return;
    }

    setCompletedOrder({
      folio: json.data.folio,
      total: json.data.total,
      ticket_html: json.data.ticket_html,
      email: clienteEmail,
      email_enviado: json.data.email_enviado ?? false,
    });
    setIsSubmitting(false);
  };

  // Reset for new sale
  const resetAll = () => {
    setCart([]);
    setClienteNombre("");
    setClienteEmail("");
    setClienteTel("");
    setClienteTipo("menudeo");
    setNota("");
    setEnviarTicket(false);
    setCompletedOrder(null);
    setSubmitError("");
  };

  // Open ticket in new window
  const viewTicket = () => {
    if (!completedOrder?.ticket_html) return;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(completedOrder.ticket_html);
      w.document.close();
    }
  };

  // Imprimir ticket (A1)
  const printTicket = () => {
    if (!completedOrder?.ticket_html) return;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(completedOrder.ticket_html);
      w.document.close();
      // Esperar a que el contenido renderice antes de imprimir
      setTimeout(() => w.print(), 300);
    }
  };

  // Guardar ticket como HTML
  const saveTicket = () => {
    if (!completedOrder?.ticket_html) return;
    const blob = new Blob([completedOrder.ticket_html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${completedOrder.folio}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Success overlay ── */
  if (completedOrder) {
    return (
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <div
            style={{
              textAlign: "center",
              border: "1px solid #eeece7",
              borderRadius: 16,
              padding: "48px 56px",
              background: "#fff",
              maxWidth: 420,
              width: "100%",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#37352f",
                margin: "0 0 8px",
              }}
            >
              Venta registrada
            </h2>
            <p
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#37352f",
                margin: "16px 0 4px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatPrice(completedOrder.total)}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#9b968c",
                margin: "0 0 20px",
                fontFamily: "monospace",
              }}
            >
              {completedOrder.folio}
            </p>
            <div
              style={{
                background: completedOrder.email_enviado ? "#eaf3ec" : "#f8f7f4",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 13,
                color: completedOrder.email_enviado ? "#16794a" : "#6b6760",
                marginBottom: 28,
              }}
            >
              {completedOrder.email_enviado
                ? <>Ticket enviado a <strong>{completedOrder.email}</strong></>
                : "Venta registrada correctamente"}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={resetAll}
                style={{
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#fff",
                  background: "#37352f",
                  border: "none",
                  borderRadius: 8,
                  padding: "11px 24px",
                  cursor: "pointer",
                }}
              >
                Nueva venta
              </button>
              <button
                onClick={viewTicket}
                style={{
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#37352f",
                  background: "#fff",
                  border: "1px solid #e6e3db",
                  borderRadius: 8,
                  padding: "11px 24px",
                  cursor: "pointer",
                }}
              >
                Ver ticket
              </button>
              <button
                onClick={printTicket}
                style={{
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#37352f",
                  background: "#fff",
                  border: "1px solid #e6e3db",
                  borderRadius: 8,
                  padding: "11px 24px",
                  cursor: "pointer",
                }}
              >
                🖨️ Imprimir
              </button>
              <button
                onClick={saveTicket}
                style={{
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#37352f",
                  background: "#fff",
                  border: "1px solid #e6e3db",
                  borderRadius: 8,
                  padding: "11px 24px",
                  cursor: "pointer",
                }}
              >
                💾 Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main POS layout ── */
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#37352f", margin: 0 }}>
          🛒 Punto de Venta
        </h1>
        <p style={{ fontSize: 14, color: "#8b867c", marginTop: 4 }}>
          Registra ventas y genera tickets
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 20,
          alignItems: "start",
        }}
        className="pos-grid"
      >
        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Product search */}
          <div
            style={{
              border: "1px solid #eeece7",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
            }}
          >
            <div style={sectionHeader}>Agregar productos</div>
            <div ref={searchRef} style={{ position: "relative" }}>
              <div style={{ position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 15,
                    height: 15,
                    color: "#9b968c",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchResults.length > 0 && searchResults[0].stock > 0) {
                      addToCart(searchResults[0]);
                    }
                  }}
                  placeholder="Buscar por nombre o SKU..."
                  style={{
                    ...inputStyle,
                    paddingLeft: 34,
                    background: "#f8f7f4",
                    border: "1px solid #eeece7",
                    borderRadius: 9,
                  }}
                />
              </div>

              {/* Search dropdown */}
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    background: "#fff",
                    border: "1px solid #eeece7",
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    zIndex: 50,
                    maxHeight: 320,
                    overflowY: "auto",
                  }}
                >
                  {isSearching ? (
                    <div style={{ padding: 16, fontSize: 13, color: "#9b968c", textAlign: "center" }}>
                      Buscando...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div style={{ padding: 16, fontSize: 13, color: "#9b968c", textAlign: "center" }}>
                      Sin resultados
                    </div>
                  ) : (
                    searchResults.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => addToCart(p)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          cursor: p.stock > 0 ? "pointer" : "not-allowed",
                          borderBottom: "1px solid #f4f2ec",
                          opacity: p.stock > 0 ? 1 : 0.4,
                        }}
                        onMouseEnter={(e) => {
                          if (p.stock > 0) e.currentTarget.style.background = "#faf9f6";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 500, color: "#37352f" }}>
                              {p.nombre}
                            </span>
                            {p.sku && (
                              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6b6760", background: "#f4f2ec", borderRadius: 4, padding: "1px 6px" }}>
                                {p.sku}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 11.5, color: "#9b968c", marginTop: 1 }}>
                            {p.categoria}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#37352f" }}>
                            {formatPrice(p.precio_venta)}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: p.stock > 0 ? "#16794a" : "#c2410c",
                              marginTop: 1,
                            }}
                          >
                            {p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cart items */}
          <div
            style={{
              border: "1px solid #eeece7",
              borderRadius: 12,
              background: "#fff",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #eeece7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={sectionHeader as React.CSSProperties}>
                Carrito ({cart.length} {cart.length === 1 ? "producto" : "productos"})
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  style={{
                    fontFamily: "inherit",
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#c2410c",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 6px",
                  }}
                >
                  Vaciar
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  fontSize: 13,
                  color: "#9b968c",
                }}
              >
                Busca y selecciona productos para agregarlos
              </div>
            ) : (
              <div>
                {cart.map((item, i) => (
                  <div
                    key={item.producto_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 20px",
                      borderBottom: i < cart.length - 1 ? "1px solid #f4f2ec" : "none",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: "#37352f",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.nombre}
                      </div>
                      <div style={{ fontSize: 12, color: "#9b968c", marginTop: 1 }}>
                        {formatPrice(item.precio_unitario)} c/u
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginLeft: 12,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQty(item.producto_id, -1)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "1px solid #e6e3db",
                          background: "#fff",
                          fontSize: 16,
                          color: "#6b6760",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "inherit",
                        }}
                      >
                        -
                      </button>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#37352f",
                          minWidth: 20,
                          textAlign: "center",
                        }}
                      >
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.producto_id, 1)}
                        disabled={item.cantidad >= item.stock_disponible}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: "1px solid #e6e3db",
                          background: "#fff",
                          fontSize: 16,
                          color:
                            item.cantidad >= item.stock_disponible
                              ? "#d8d3c8"
                              : "#6b6760",
                          cursor:
                            item.cantidad >= item.stock_disponible
                              ? "not-allowed"
                              : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "inherit",
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Line total + remove */}
                    <div
                      style={{
                        textAlign: "right",
                        marginLeft: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#37352f",
                          fontVariantNumeric: "tabular-nums",
                          minWidth: 80,
                        }}
                      >
                        {formatPrice(item.precio_unitario * item.cantidad)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.producto_id)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: 16,
                          color: "#c2410c",
                          cursor: "pointer",
                          padding: 2,
                          lineHeight: 1,
                        }}
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client info */}
          <div
            style={{
              border: "1px solid #eeece7",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
            }}
          >
            <div style={sectionHeader}>Datos del cliente</div>

            {/* Client search */}
            <div ref={clientSearchRef} style={{ position: "relative", marginBottom: 14 }}>
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="🔍 Buscar cliente existente..."
                style={{
                  ...inputStyle,
                  background: "#f8f7f4",
                  border: "1px solid #eeece7",
                  fontSize: 12.5,
                }}
              />
              {showClientDropdown && clientResults.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    background: "#fff",
                    border: "1px solid #eeece7",
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    zIndex: 50,
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  {clientResults.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => selectClient(c)}
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f4f2ec",
                        fontSize: 13,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#faf9f6")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div style={{ fontWeight: 500, color: "#37352f" }}>
                        {c.nombre}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#9b968c" }}>
                        {c.email}
                        {c.telefono && ` · ${c.telefono}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>
                  Nombre <span style={{ color: "#c2410c" }}>*</span>
                </div>
                <input
                  type="text"
                  required
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  placeholder="Nombre del cliente"
                  style={inputStyle}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>
                  Email {enviarTicket && <span style={{ color: "#c2410c" }}>*</span>}
                </div>
                <input
                  type="email"
                  value={clienteEmail}
                  onChange={(e) => setClienteEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  style={inputStyle}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>
                  Teléfono
                </div>
                <input
                  type="tel"
                  value={clienteTel}
                  onChange={(e) => setClienteTel(e.target.value)}
                  placeholder="442 123 4567"
                  style={inputStyle}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>
                  Tipo de cliente
                </div>
                <select
                  value={clienteTipo}
                  onChange={(e) => setClienteTipo(e.target.value)}
                  style={inputStyle}
                >
                  {TIPOS_CLIENTE.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>
                  Nota (opcional)
                </div>
                <input
                  type="text"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Observaciones de la venta..."
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#6b6760",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enviarTicket}
                    onChange={(e) => setEnviarTicket(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#37352f", cursor: "pointer" }}
                  />
                  Enviar ticket por correo al cliente
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column: Order summary ── */}
        <div
          style={{
            border: "1px solid #eeece7",
            borderRadius: 12,
            background: "#fff",
            position: "sticky",
            top: 20,
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #eeece7" }}>
            <div style={{ ...sectionHeader, margin: 0 }}>Resumen de venta</div>
          </div>

          {/* Cart summary lines */}
          <div style={{ padding: "12px 20px" }}>
            {cart.length === 0 ? (
              <div
                style={{
                  padding: "24px 0",
                  textAlign: "center",
                  fontSize: 13,
                  color: "#9b968c",
                }}
              >
                Sin productos
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cart.map((item) => (
                  <div
                    key={item.producto_id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#6b6760" }}>
                      {item.nombre}
                      {item.cantidad > 1 && (
                        <span style={{ color: "#9b968c" }}> ×{item.cantidad}</span>
                      )}
                    </span>
                    <span
                      style={{
                        color: "#37352f",
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatPrice(item.precio_unitario * item.cantidad)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <div
              style={{
                padding: "16px 20px",
                borderTop: "1px solid #eeece7",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#9b968c",
                  marginBottom: 6,
                }}
              >
                <span>Subtotal</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#9b968c",
                  marginBottom: 12,
                }}
              >
                <span>IVA (16%)</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatPrice(iva)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #eeece7",
                  paddingTop: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#37352f",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#37352f",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {submitError && (
            <div
              style={{
                padding: "0 20px 12px",
                fontSize: 12.5,
                color: "#c2410c",
              }}
            >
              {submitError}
            </div>
          )}

          {/* Checkout button */}
          <div style={{ padding: "0 20px 20px" }}>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canSubmit}
              style={{
                width: "100%",
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: canSubmit ? "#37352f" : "#c4bfb6",
                border: "none",
                borderRadius: 10,
                padding: "14px 0",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              {`🛒 Cobrar ${cart.length > 0 ? formatPrice(total) : ""}`}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => !isSubmitting && setShowConfirm(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "32px 36px",
              maxWidth: 400,
              width: "90%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🛒</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#37352f", margin: "0 0 8px" }}>
              Confirmar venta
            </h3>
            <p style={{ fontSize: 14, color: "#6b6760", margin: "0 0 4px" }}>
              Cliente: <strong>{clienteNombre}</strong>
            </p>
            <p style={{ fontSize: 24, fontWeight: 700, color: "#37352f", margin: "12px 0 20px", fontVariantNumeric: "tabular-nums" }}>
              {formatPrice(total)}
            </p>
            <p style={{ fontSize: 12, color: "#9b968c", margin: "0 0 20px" }}>
              {cart.length} {cart.length === 1 ? "producto" : "productos"}
            </p>

            {submitError && (
              <div style={{ padding: "8px 12px", marginBottom: 16, borderRadius: 8, background: "#fdf3ec", fontSize: 12.5, color: "#c2410c" }}>
                {submitError}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowConfirm(false); setSubmitError(""); }}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#37352f",
                  background: "#fff",
                  border: "1px solid #e6e3db",
                  borderRadius: 8,
                  padding: "11px 0",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await handleCheckout();
                  if (!submitError) setShowConfirm(false);
                }}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  background: isSubmitting ? "#c4bfb6" : "#37352f",
                  border: "none",
                  borderRadius: 8,
                  padding: "11px 0",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .pos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
