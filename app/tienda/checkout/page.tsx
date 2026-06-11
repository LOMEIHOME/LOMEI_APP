"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/data/productos";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, iva, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    nota: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setError("");
    setLoading(true);

    const res = await fetch("/api/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_nombre: form.nombre,
        cliente_email: form.email,
        cliente_tel: form.telefono || null,
        nota: form.nota || null,
        items: items.map((item) => ({
          slug: item.slug,
          nombre: item.name,
          cantidad: item.quantity,
          precio_unitario: item.price,
        })),
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Error al procesar la orden");
      setLoading(false);
      return;
    }

    clearCart();
    router.push(`/tienda/confirmacion?orden=${json.data.id}`);
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <section className="pt-32 pb-24 min-h-screen">
          <div className="max-w-lg mx-auto px-6 text-center">
            <h1 className="font-serif text-3xl tracking-wider text-[var(--color-dark)]">
              Carrito vacío
            </h1>
            <p className="mt-4 text-sm text-[var(--color-warm-gray)]">
              Agrega productos antes de continuar.
            </p>
            <Link
              href="/catalogo"
              className="inline-block mt-6 px-6 py-3 bg-[var(--color-dark)] text-white text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors"
            >
              Ir al catálogo
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-white border border-[var(--color-sand)]/50 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)]/40 focus:outline-none focus:border-[var(--color-oak)] transition-colors";
  const labelClass =
    "block text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-1.5";

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-16 md:pb-24 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-5xl tracking-wider text-[var(--color-dark)]">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
            Completa tus datos para confirmar el pedido
          </p>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Formulario */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} id="checkout-form" className="space-y-5">
                <div className="bg-white rounded-sm border border-[var(--color-sand)]/30 p-6 space-y-4">
                  <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-dark)] font-medium mb-2">
                    Datos de contacto
                  </h3>

                  <div>
                    <label className={labelClass}>
                      Nombre completo <span className="text-[var(--color-oak)]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, nombre: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Correo electrónico <span className="text-[var(--color-oak)]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="tu@email.com"
                    />
                    <p className="mt-1 text-[10px] text-[var(--color-warm-gray)]">
                      Recibirás tu nota de venta en este correo
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Teléfono</label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, telefono: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="442 123 4567"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Notas del pedido</label>
                    <textarea
                      value={form.nota}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, nota: e.target.value }))
                      }
                      className={`${inputClass} min-h-[70px] resize-y`}
                      placeholder="Instrucciones especiales, acabado preferido, etc."
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-600/80">{error}</p>}
              </form>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-5">
              <div className="bg-[var(--color-linen)]/60 rounded-sm p-6 sticky top-28">
                <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--color-dark)] font-medium mb-5">
                  Tu pedido
                </h3>

                <div className="divide-y divide-[var(--color-sand)]/20">
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-3 py-3 first:pt-0">
                      <div className="relative w-12 h-14 flex-shrink-0 overflow-hidden rounded-sm bg-[var(--color-cream)]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[var(--color-dark)] truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-warm-gray)]">
                          Cant: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-serif text-[var(--color-dark)]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--color-sand)]/30 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-warm-gray)]">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-warm-gray)]">IVA (16%)</span>
                    <span>{formatPrice(iva)}</span>
                  </div>
                  <div className="h-[0.5px] bg-[var(--color-sand)]/50" />
                  <div className="flex justify-between">
                    <span className="font-medium text-[var(--color-dark)]">Total</span>
                    <span className="font-serif text-lg text-[var(--color-oak)]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading}
                  className="w-full mt-6 py-3 bg-[var(--color-dark)] text-white text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors disabled:opacity-50"
                >
                  {loading ? "Procesando..." : "Confirmar pedido"}
                </button>

                <Link
                  href="/tienda/carrito"
                  className="block w-full mt-3 text-center text-xs text-[var(--color-warm-gray)] hover:text-[var(--color-oak)] transition-colors"
                >
                  Volver al carrito
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
