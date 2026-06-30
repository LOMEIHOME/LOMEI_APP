import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/pos/productos — Búsqueda ligera para POS (productos + stock)
export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const limit = parseInt(searchParams.get("limit") || "10");

  let query = supabase
    .from("productos")
    .select("id, nombre, slug, sku, categoria, precio_venta, imagen_url, inventario(cantidad)")
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
  const results = (data || []).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    slug: p.slug,
    sku: p.sku,
    categoria: p.categoria,
    precio_venta: p.precio_venta,
    imagen_url: p.imagen_url,
    stock: (p.inventario as { cantidad: number }[])?.[0]?.cantidad ?? 0,
  }));

  return NextResponse.json({ data: results });
}
