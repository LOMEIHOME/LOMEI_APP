import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [productosRes, stockRes, ventasRes, productosCatRes, stockCatRes] = await Promise.all([
    supabase
      .from("productos")
      .select("id", { count: "exact" })
      .eq("activo", true),
    supabase
      .from("vista_stock_bajo")
      .select("id", { count: "exact" }),
    supabase
      .from("vista_ventas_resumen")
      .select("num_ordenes, total_ventas")
      .gte("fecha", firstDayOfMonth),
    // Productos activos por categoría
    supabase
      .from("productos")
      .select("categoria")
      .eq("activo", true),
    // Stock bajo por categoría (join con productos)
    supabase
      .from("vista_stock_bajo")
      .select("producto_id, productos(categoria)"),
  ]);

  if (productosRes.error) {
    return NextResponse.json(
      { error: productosRes.error.message },
      { status: 500 }
    );
  }
  if (stockRes.error) {
    return NextResponse.json(
      { error: stockRes.error.message },
      { status: 500 }
    );
  }
  if (ventasRes.error) {
    return NextResponse.json(
      { error: ventasRes.error.message },
      { status: 500 }
    );
  }

  const productos_activos = productosRes.count ?? 0;
  const stock_bajo = stockRes.count ?? 0;

  const ventas_mes = (ventasRes.data ?? []).reduce(
    (sum: number, row: { num_ordenes: number }) => sum + (row.num_ordenes ?? 0),
    0
  );
  const ingresos_mes = (ventasRes.data ?? []).reduce(
    (sum: number, row: { total_ventas: number }) =>
      sum + (row.total_ventas ?? 0),
    0
  );

  // Desglose por categoría
  const productos_por_categoria: Record<string, number> = {};
  for (const p of productosCatRes.data ?? []) {
    const cat = (p as { categoria: string }).categoria || "Sin categoría";
    productos_por_categoria[cat] = (productos_por_categoria[cat] || 0) + 1;
  }

  const stock_bajo_por_categoria: Record<string, number> = {};
  for (const s of stockCatRes.data ?? []) {
    const prod = (s as unknown as { productos: { categoria: string } | null }).productos;
    const cat = prod?.categoria || "Sin categoría";
    stock_bajo_por_categoria[cat] = (stock_bajo_por_categoria[cat] || 0) + 1;
  }

  return NextResponse.json({
    data: {
      productos_activos,
      stock_bajo,
      ventas_mes,
      ingresos_mes,
      productos_por_categoria,
      stock_bajo_por_categoria,
    },
  });
}
