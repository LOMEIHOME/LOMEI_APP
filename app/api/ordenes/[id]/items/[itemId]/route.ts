import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// DELETE /api/ordenes/[id]/items/[itemId] — Cancelar un artículo de la orden y restaurar stock
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const supabase = createServiceRoleClient();
  const { id: ordenId, itemId } = await params;

  // 1. Obtener el item y la orden
  const { data: item, error: itemError } = await supabase
    .from("orden_items")
    .select("id, producto_id, cantidad, precio_unitario, descuento, subtotal")
    .eq("id", itemId)
    .eq("orden_id", ordenId)
    .single();

  if (itemError || !item) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
  }

  // Obtener estado de la orden para saber si restaurar stock
  const { data: orden } = await supabase
    .from("ordenes")
    .select("estado, numero")
    .eq("id", ordenId)
    .single();

  // 2. Solo restaurar stock si la orden estaba completada (stock fue deducido al completar)
  if (orden?.estado === "completada") {
    const { data: inv } = await supabase
      .from("inventario")
      .select("id, cantidad")
      .eq("producto_id", item.producto_id)
      .single();

    if (inv) {
      const nuevaCantidad = (inv.cantidad as number) + item.cantidad;
      await supabase
        .from("inventario")
        .update({ cantidad: nuevaCantidad })
        .eq("id", inv.id);

      await supabase.from("movimientos").insert({
        producto_id: item.producto_id,
        tipo: "entrada",
        cantidad: item.cantidad,
        cantidad_antes: inv.cantidad,
        cantidad_despues: nuevaCantidad,
        nota: `Cancelación de artículo — Orden #${String(orden.numero).padStart(4, "0")}`,
      });
    }
  }

  // 3. Eliminar el item de la orden
  await supabase
    .from("orden_items")
    .delete()
    .eq("id", itemId);

  // 4. Recalcular totales de la orden
  const { data: remainingItems } = await supabase
    .from("orden_items")
    .select("cantidad, precio_unitario, descuento, subtotal")
    .eq("orden_id", ordenId);

  // 5. Si no quedan items, cancelar la orden automáticamente
  if (!remainingItems || remainingItems.length === 0) {
    await supabase
      .from("ordenes")
      .update({ total: 0, descuento: 0, subtotal: 0, estado: "cancelada" })
      .eq("id", ordenId);

    return NextResponse.json({ success: true, orden_cancelada: true });
  }

  const nuevoTotal = remainingItems.reduce((s, i) => s + (i.subtotal as number), 0);
  const nuevoDescuento = remainingItems.reduce((s, i) => {
    const base = (i.cantidad as number) * (i.precio_unitario as number);
    return s + (base - (i.subtotal as number));
  }, 0);

  await supabase
    .from("ordenes")
    .update({
      total: nuevoTotal,
      descuento: nuevoDescuento,
      subtotal: nuevoTotal,
    })
    .eq("id", ordenId);

  return NextResponse.json({ success: true, orden_cancelada: false });
}
