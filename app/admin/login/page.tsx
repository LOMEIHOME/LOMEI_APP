"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: "inherit",
    fontSize: 14,
    color: "#37352f",
    border: "1px solid #e6e3db",
    borderRadius: 8,
    padding: "11px 14px",
    background: "#fff",
    outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8f7f4",
      padding: "0 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#37352f",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 12,
          }}>
            L
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#37352f" }}>LOMEI HOME</div>
          <div style={{ fontSize: 12.5, color: "#9b968c", marginTop: 2 }}>Panel de administración</div>
        </div>

        {/* Form card */}
        <div style={{
          background: "#fff",
          border: "1px solid #eeece7",
          borderRadius: 12,
          padding: 28,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>
                Correo electrónico
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lomeihome.mx"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#6b6760", marginBottom: 5 }}>
                Contraseña
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{ fontSize: 13, color: "#c2410c", marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 500,
                color: "#fff",
                background: "#37352f",
                border: 0,
                borderRadius: 8,
                padding: "11px 0",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
