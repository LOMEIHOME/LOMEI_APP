import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// GET /api/dashboard/correlacion — Productos frecuentemente comprados juntos
export async function GET() {
  const supabase = createServiceRoleClient();

  // Buscar pares de productos que aparecen en la misma orden
  const { data, error } = await supabase.rpc("productos_correlacion");

  if (error) {
    // Si la función RPC no existe, usar query manual
    const { data: ordenes, error: ordError } = await supabase
      .from("orden_items")
      .select("orden_id, producto_id, productos(nombre, categoria)")
      .not("producto_id", "is", null);

    if (ordError) {
      return NextResponse.json({ error: ordError.message }, { status: 500 });
    }

    // Agrupar items por orden
    const ordeneMap: Record<string, Array<{ producto_id: string; nombre: string; categoria: string }>> = {};
    for (const item of ordenes ?? []) {
      const oid = item.orden_id as string;
      if (!ordeneMap[oid]) ordeneMap[oid] = [];
      const prod = item.productos as unknown as { nombre: string; categoria: string };
      ordeneMap[oid].push({
        producto_id: item.producto_id as string,
        nombre: prod?.nombre || "Desconocido",
        categoria: prod?.categoria || "",
      });
    }

    // Contar pares
    const pairCount: Record<string, { a: string; b: string; nombre_a: string; nombre_b: string; cat_a: string; cat_b: string; count: number }> = {};

    for (const items of Object.values(ordeneMap)) {
      if (items.length < 2) continue;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const [a, b] = items[i].producto_id < items[j].producto_id
            ? [items[i], items[j]]
            : [items[j], items[i]];
          const key = `${a.producto_id}:${b.producto_id}`;
          if (!pairCount[key]) {
            pairCount[key] = {
              a: a.producto_id,
              b: b.producto_id,
              nombre_a: a.nombre,
              nombre_b: b.nombre,
              cat_a: a.categoria,
              cat_b: b.categoria,
              count: 0,
            };
          }
          pairCount[key].count++;
        }
      }
    }

    const correlaciones = Object.values(pairCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return NextResponse.json({ data: correlaciones });
  }

  return NextResponse.json({ data: data ?? [] });
}
