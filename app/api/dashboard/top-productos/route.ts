import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createAdminClient();

  // Agrupa orden_items por producto, suma cantidades vendidas
  const { data, error } = await supabase
    .from("orden_items")
    .select("producto_id, cantidad, productos(nombre, categoria)")
    .order("cantidad", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Agrupar por producto_id y sumar cantidades
  const map = new Map<
    string,
    { producto_id: string; nombre: string; categoria: string; vendidos: number }
  >();

  for (const row of data ?? []) {
    const prod = row.productos as unknown as { nombre: string; categoria: string } | null;
    if (!prod) continue;

    const existing = map.get(row.producto_id);
    if (existing) {
      existing.vendidos += row.cantidad;
    } else {
      map.set(row.producto_id, {
        producto_id: row.producto_id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        vendidos: row.cantidad,
      });
    }
  }

  const top = [...map.values()]
    .sort((a, b) => b.vendidos - a.vendidos)
    .slice(0, 5);

  return NextResponse.json({ data: top });
}
