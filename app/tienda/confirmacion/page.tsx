"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const ordenId = searchParams.get("orden");

  return (
    <>
      <Navbar />

      <section className="pt-32 pb-24 min-h-screen">
        <div className="max-w-lg mx-auto px-6 text-center">
          {/* Checkmark */}
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-linen)] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--color-oak)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="mt-6 font-serif text-3xl md:text-4xl tracking-wider text-[var(--color-dark)]">
            Pedido confirmado
          </h1>

          <p className="mt-4 text-sm text-[var(--color-warm-gray)] leading-relaxed">
            Tu nota de venta ha sido enviada a tu correo electrónico.
            <br />
            Si no la ves, revisa tu carpeta de spam.
          </p>

          {ordenId && (
            <p className="mt-4 text-xs text-[var(--color-warm-gray)]">
              ID de orden:{" "}
              <span className="font-mono text-[var(--color-dark)]">
                {ordenId.slice(0, 8)}
              </span>
            </p>
          )}

          <div className="mt-4 p-4 bg-[var(--color-linen)]/60 rounded-sm">
            <p className="text-xs text-[var(--color-warm-gray)] leading-relaxed">
              Para coordinar la entrega o cualquier duda sobre tu pedido,
              contáctanos por WhatsApp al{" "}
              <a
                href="https://wa.me/527711009084"
                className="text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                771 100 90 84
              </a>{" "}
              o al correo{" "}
              <a
                href="mailto:arqinteriorismolv@gmail.com"
                className="text-[var(--color-oak)] hover:text-[var(--color-camel)] transition-colors"
              >
                arqinteriorismolv@gmail.com
              </a>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/catalogo"
              className="inline-block px-6 py-3 bg-[var(--color-dark)] text-white text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors"
            >
              Seguir comprando
            </Link>
            <Link
              href="/"
              className="text-xs text-[var(--color-warm-gray)] hover:text-[var(--color-oak)] transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense>
      <ConfirmacionContent />
    </Suspense>
  );
}
