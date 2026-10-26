import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// GET /api/pos/productos — Búsqueda ligera para POS (productos + stock)
export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "10");

  let query = supabase
    .from("productos")
    .select("id, nombre, slug, sku, categoria, precio_venta, imagen_url, venta_por_ml, contenido_ml, inventario(cantidad)")
    .eq("activo", true)
    .order("nombre")
    .limit(limit);

  if (search) {
    query = query.or(`nombre.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aplanar inventario para devolver cantidad directamente
  const results = (data || []).map((p) => {
    const ventaPorMl = p.venta_por_ml ?? false;
    const contenidoMl = (p.contenido_ml as number | null) ?? null;
    // Calcular precio por ml: precio del frasco / contenido en ml
    const precioPorMl = ventaPorMl && contenidoMl && contenidoMl > 0
      ? Math.round((p.precio_venta / contenidoMl) * 100) / 100
      : null;
    return {
      id: p.id,
      nombre: p.nombre,
      slug: p.slug,
      sku: p.sku,
      categoria: p.categoria,
      precio_venta: p.precio_venta,
      precio_por_ml: precioPorMl,
      contenido_ml: contenidoMl,
      imagen_url: p.imagen_url,
      venta_por_ml: ventaPorMl,
      stock: (p.inventario as { cantidad: number }[])?.[0]?.cantidad ?? 0,
    };
  });

  return NextResponse.json({ data: results });
}
