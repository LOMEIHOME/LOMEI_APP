"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/data/productos";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, itemCount, subtotal, iva, total } =
    useCart();

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-16 md:pb-24 min-h-screen">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-5xl tracking-wider text-[var(--color-dark)]">
            Carrito
          </h1>
          <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
            {itemCount === 0
              ? "Tu carrito está vacío"
              : `${itemCount} artículo${itemCount !== 1 ? "s" : ""}`}
          </p>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-sm text-[var(--color-warm-gray)]">
                Aún no has agregado productos.
              </p>
              <Link
                href="/catalogo"
                className="inline-block mt-6 px-6 py-3 bg-[var(--color-dark)] text-white text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Lista de productos */}
              <div className="lg:col-span-8">
                <div className="divide-y divide-[var(--color-sand)]/20">
                  {items.map((item) => (
                    <div
                      key={item.slug}
                      className="flex gap-4 py-6 first:pt-0"
                    >
                      {/* Imagen */}
                      <Link
                        href={`/catalogo/${item.slug}`}
                        className="relative w-20 h-24 md:w-24 md:h-28 flex-shrink-0 overflow-hidden rounded-sm bg-[var(--color-linen)]"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/catalogo/${item.slug}`}
                          className="text-sm text-[var(--color-dark)] hover:text-[var(--color-oak)] transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm font-serif text-[var(--color-oak)]">
                          {formatPrice(item.price)}
                        </p>

                        {/* Cantidad */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex items-center border border-[var(--color-sand)]/40 rounded-sm">
                            <button
                              onClick={() =>
                                updateQuantity(item.slug, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-xs text-[var(--color-dark)] border-x border-[var(--color-sand)]/40">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.slug, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center text-[var(--color-warm-gray)] hover:text-[var(--color-dark)] transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="text-[10px] tracking-wider uppercase text-[var(--color-warm-gray)] hover:text-red-500 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <p className="text-sm font-serif text-[var(--color-dark)] hidden sm:block">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen */}
              <div className="lg:col-span-4">
                <div className="bg-[var(--color-linen)]/60 rounded-sm p-6 sticky top-28">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--color-dark)] font-medium mb-5">
                    Resumen del pedido
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-warm-gray)]">Subtotal</span>
                      <span className="text-[var(--color-dark)]">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-warm-gray)]">IVA (16%)</span>
                      <span className="text-[var(--color-dark)]">
                        {formatPrice(iva)}
                      </span>
                    </div>
                    <div className="h-[0.5px] bg-[var(--color-sand)]/50" />
                    <div className="flex justify-between">
                      <span className="font-medium text-[var(--color-dark)]">Total</span>
                      <span className="font-serif text-lg text-[var(--color-oak)]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/tienda/checkout"
                    className="block w-full mt-6 py-3 bg-[var(--color-dark)] text-white text-center text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors"
                  >
                    Continuar compra
                  </Link>

                  <Link
                    href="/catalogo"
                    className="block w-full mt-3 text-center text-xs text-[var(--color-warm-gray)] hover:text-[var(--color-oak)] transition-colors"
                  >
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
