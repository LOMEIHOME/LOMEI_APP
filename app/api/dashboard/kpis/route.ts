import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [productosRes, stockRes, ventasRes] = await Promise.all([
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

  return NextResponse.json({
    data: {
      productos_activos,
      stock_bajo,
      ventas_mes,
      ingresos_mes,
    },
  });
}
