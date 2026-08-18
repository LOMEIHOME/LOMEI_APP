import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// GET /api/inventario — Listar inventario con datos de producto
export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const categoria = searchParams.get("categoria") || "";

  // Query: inventario con join a productos
  let query = supabase
    .from("inventario")
    .select("*, productos!inner(id, nombre, slug, categoria, sku, precio_venta, imagen_url, activo)")
    .eq("productos.activo", true)
    .order("editado_en", { ascending: false });

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,sku.ilike.%${search}%,categoria.ilike.%${search}%`,
      { referencedTable: "productos" }
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
