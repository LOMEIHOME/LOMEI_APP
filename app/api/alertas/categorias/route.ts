import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// GET /api/alertas/categorias — Stock total por categoría
export async function GET() {
  const supabase = createServiceRoleClient();

  // Obtener todos los productos activos con su inventario
  const { data, error } = await supabase
    .from("productos")
    .select("categoria, inventario(cantidad)")
    .eq("activo", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Agrupar stock total por categoría
  const porCategoria: Record<string, { total: number; productos: number }> = {};

  for (const prod of data || []) {
    const cat = prod.categoria;
    if (!porCategoria[cat]) {
      porCategoria[cat] = { total: 0, productos: 0 };
    }
    const inv = prod.inventario as unknown as { cantidad: number }[];
    const stock = inv?.[0]?.cantidad ?? 0;
    porCategoria[cat].total += stock;
    porCategoria[cat].productos += 1;
  }

  return NextResponse.json({ data: porCategoria });
}
