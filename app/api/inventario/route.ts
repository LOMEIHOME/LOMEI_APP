import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/inventario — Listar inventario con datos de producto
export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);

  const alerta = searchParams.get("alerta");
  const search = searchParams.get("search") || "";
  const categoria = searchParams.get("categoria") || "";

  // Si piden solo alertas, usar la vista
  if (alerta === "true") {
    const { data, error } = await supabase
      .from("vista_stock_bajo")
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  }

  // Query normal: inventario con join a productos
  let query = supabase
    .from("inventario")
    .select("*, productos!inner(id, nombre, slug, categoria, sku, precio_venta, imagen_url, activo)")
    .eq("productos.activo", true)
    .order("editado_en", { ascending: false });

  if (search) {
    query = query.or(
      `productos.nombre.ilike.%${search}%,productos.sku.ilike.%${search}%`,
    );
  }
  if (categoria) {
    query = query.eq("productos.categoria", categoria);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
