import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/inventario/movimientos — Historial de movimientos
export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);

  const productoId = searchParams.get("producto_id");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("movimientos")
    .select("*, productos(nombre, slug)", { count: "exact" })
    .order("creado_en", { ascending: false })
    .range(offset, offset + limit - 1);

  if (productoId) {
    query = query.eq("producto_id", productoId);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit),
    },
  });
}
