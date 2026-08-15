"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTag from "@/components/ui/SectionTag";
import FadeIn from "@/components/sections/FadeIn";

export default function ContactoPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = nombre.trim() && email.trim() && mensaje.trim() && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim() || null,
          mensaje: mensaje.trim(),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al enviar");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar forceScrolled />

      <section className="bg-[var(--color-linen)] pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <FadeIn>
            <SectionTag className="!text-[11px] !text-[var(--color-oak)]">
              Contacto
            </SectionTag>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-6xl tracking-wider text-[var(--color-dark)]">
              Hablemos
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-dark)]/70 max-w-lg">
              Agenda una cita o envíanos un mensaje. Nos encantará conocer tu
              proyecto.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Info de contacto */}
          <FadeIn>
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-oak)] mb-3">
                  Email
                </p>
                <a
                  href="mailto:contacto@lomeihome.com"
                  className="text-base md:text-lg text-[var(--color-dark)] hover:text-[var(--color-camel)] transition-colors duration-400"
                >
                  contacto@lomeihome.com
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-oak)] mb-3">
                  Teléfono
                </p>
                <a
                  href="tel:+524424874466"
                  className="text-base md:text-lg text-[var(--color-dark)] hover:text-[var(--color-camel)] transition-colors duration-400"
                >
                  442 487 4466
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-oak)] mb-3">
                  Instagram
                </p>
                <a
                  href="https://instagram.com/lomeihome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg text-[var(--color-dark)] hover:text-[var(--color-camel)] transition-colors duration-400"
                >
                  @lomeihome
                </a>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--color-oak)] mb-3">
                  Ubicación
                </p>
                <p className="text-base md:text-lg text-[var(--color-dark)]">
                  Querétaro, México
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Formulario */}
          <FadeIn delay={0.15}>
            <div className="bg-[var(--color-linen)] rounded-sm p-6 md:p-10">
              <h2 className="font-serif text-xl md:text-2xl tracking-wider text-[var(--color-dark)] mb-6">
                Envíanos un mensaje
              </h2>

              {sent ? (
                <div className="text-center py-8">
                  <p className="text-2xl mb-3">✓</p>
                  <p className="text-base text-[var(--color-dark)] font-medium mb-2">
                    Mensaje enviado
                  </p>
                  <p className="text-sm text-[var(--color-warm-gray)]">
                    Te responderemos lo antes posible.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setNombre("");
                      setEmail("");
                      setTelefono("");
                      setMensaje("");
                    }}
                    className="mt-6 text-[11px] tracking-[0.2em] uppercase text-[var(--color-camel)] border-b border-[var(--color-camel)]/40 pb-1 hover:border-[var(--color-camel)] transition-colors duration-400 cursor-pointer"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Nombre *"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-sand)]/50 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-camel)]/60 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-sand)]/50 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-camel)]/60 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-sand)]/50 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-camel)]/60 transition-colors"
                  />
                  <textarea
                    placeholder="Cuéntanos sobre tu proyecto *"
                    rows={4}
                    required
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--color-white)] border border-[var(--color-sand)]/50 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)] focus:outline-none focus:border-[var(--color-camel)]/60 transition-colors resize-none"
                  />

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full py-3.5 text-[var(--color-white)] text-[11px] tracking-[0.2em] uppercase rounded-sm transition-colors duration-300 mt-2"
                    style={{
                      backgroundColor: canSubmit ? "var(--color-dark)" : "var(--color-warm-gray)",
                      cursor: canSubmit ? "pointer" : "not-allowed",
                    }}
                  >
                    {sending ? "Enviando..." : "Enviar mensaje"}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mapa */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[85rem] mx-auto px-6 md:px-10 lg:px-16">
          <FadeIn>
            <div className="relative w-full aspect-[16/7] md:aspect-[16/5] rounded-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d-100.4407433!3d20.6918795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d3579df9997761%3A0xdf95ccd8ee8dd63!2sPLAZA%20SANTA%20KLARA!5e0!3m2!1ses!2smx!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <a
              href="https://share.google/B9fBb1NxDTQ24VloD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-[11px] tracking-[0.2em] uppercase text-[var(--color-camel)] border-b border-[var(--color-camel)]/40 pb-1 hover:border-[var(--color-camel)] transition-colors duration-400"
            >
              Ver en Google Maps →
            </a>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
