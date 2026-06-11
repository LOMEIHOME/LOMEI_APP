"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative h-10 w-48">
            <Image
              src="/images/logos/logo-dark.png"
              alt="LOMEI HOME"
              fill
              className="object-contain"
              sizes="192px"
              priority
            />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-2"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[var(--color-sand)]/60 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)]/50 focus:outline-none focus:border-[var(--color-oak)] transition-colors"
              placeholder="admin@lomeihome.mx"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] tracking-[0.2em] uppercase text-[var(--color-warm-gray)] mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[var(--color-sand)]/60 rounded-sm text-sm text-[var(--color-dark)] placeholder:text-[var(--color-warm-gray)]/50 focus:outline-none focus:border-[var(--color-oak)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600/80">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-dark)] text-white text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[var(--color-camel)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] tracking-wider text-[var(--color-warm-gray)]">
          Panel de Administración
        </p>
      </div>
    </div>
  );
}
