import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { generarNotaDeVenta, calcularTotales } from "@/lib/ticket";
import { IVA_RATE } from "@/lib/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServiceRoleClient();
  const { id } = await params;

  const { data: orden, error } = await supabase
    .from("ordenes")
    .select("*, orden_items(*, productos(nombre, categoria))")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Si la orden no tiene ticket guardado, regenerarlo y guardarlo
  if (!orden.ticket_html && orden.orden_items?.length > 0) {
    const ticketHtml = regenerarTicket(orden);
    await supabase
      .from("ordenes")
      .update({ ticket_html: ticketHtml })
      .eq("id", id);
    orden.ticket_html = ticketHtml;
  }

  return NextResponse.json({ data: orden });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createServiceRoleClient();
  const { id } = await params;
  const body = await request.json();
  const { estado } = body;

  const estadosValidos = ["pendiente", "completada", "cancelada"];
  if (!estadosValidos.includes(estado)) {
    return NextResponse.json(
      { error: `Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")}` },
      { status: 400 }
    );
  }

  const { data: updated, error } = await supabase
    .from("ordenes")
    .update({ estado })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: updated });
}

// Regenerar ticket HTML a partir de los datos de la orden
function regenerarTicket(orden: Record<string, unknown>): string {
  const items = (orden.orden_items as Array<Record<string, unknown>>).map((item) => {
    const prod = item.productos as { nombre: string } | null;
    return {
      nombre: prod?.nombre || "Producto",
      cantidad: item.cantidad as number,
      precio_unitario: item.precio_unitario as number,
      descuento: (item.descuento as number) || 0,
      subtotal: item.subtotal as number,
    };
  });

  const total = orden.total as number;
  const subtotal = Math.round((total / (1 + IVA_RATE)) * 100) / 100;
  const iva = Math.round((total - subtotal) * 100) / 100;

  const folio = `NV-${String(orden.numero).padStart(4, "0")}`;
  const fecha = new Date(orden.creado_en as string).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return generarNotaDeVenta({
    folio,
    fecha,
    cliente_nombre: (orden.cliente_nombre as string) || "",
    cliente_email: (orden.cliente_email as string) || "",
    cliente_tel: (orden.cliente_tel as string) || undefined,
    items,
    subtotal,
    descuento: (orden.descuento as number) || 0,
    iva,
    total,
    nota: (orden.nota as string) || undefined,
  });
}
