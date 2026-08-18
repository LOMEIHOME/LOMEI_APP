import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// GET /api/reportes/ventas — Reporte detallado de artículos vendidos
export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);

  const now = new Date();
  const desde = searchParams.get("desde") || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const hasta = searchParams.get("hasta") || now.toISOString().split("T")[0];

  // Agregar hora para incluir todo el día final
  const hastaFin = `${hasta}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from("orden_items")
    .select(`
      cantidad,
      precio_unitario,
      descuento,
      subtotal,
      productos ( nombre, sku ),
      ordenes!inner ( numero, creado_en, estado )
    `)
    .eq("ordenes.estado", "completada")
    .gte("ordenes.creado_en", desde)
    .lte("ordenes.creado_en", hastaFin)
    .order("ordenes(creado_en)", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data || []).map((row) => {
    const producto = row.productos as unknown as { nombre: string; sku: string | null } | null;
    const orden = row.ordenes as unknown as { numero: number; creado_en: string };
    return {
      sku: producto?.sku || "—",
      folio: `NV-${String(orden.numero).padStart(4, "0")}`,
      producto: producto?.nombre || "Producto eliminado",
      cantidad: row.cantidad,
      precio_unitario: row.precio_unitario,
      descuento: row.descuento,
      subtotal: row.subtotal,
      fecha: orden.creado_en,
    };
  });

  return NextResponse.json({ data: items });
}
