import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generarNotaDeVenta, calcularTotales } from "@/lib/ticket";
import { sendEmail } from "@/lib/email";

const IVA_RATE = 0.16;

// POST /api/ordenes — Crear orden desde checkout
export async function POST(request: NextRequest) {
  const supabase = await createAdminClient();
  const body = await request.json();

  const { cliente_nombre, cliente_email, cliente_tel, nota, items } = body;

  if (!cliente_nombre || !cliente_email || !items?.length) {
    return NextResponse.json(
      { error: "Nombre, email y al menos un producto son requeridos" },
      { status: 400 }
    );
  }

  // Calcular totales
  const orderItems = items.map(
    (item: { slug: string; nombre: string; cantidad: number; precio_unitario: number }) => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.cantidad * item.precio_unitario,
    })
  );

  const { subtotal, iva, total } = calcularTotales(orderItems);

  // Crear orden
  const { data: orden, error: ordenError } = await supabase
    .from("ordenes")
    .insert({
      cliente_nombre,
      cliente_email,
      cliente_tel: cliente_tel || null,
      estado: "completada",
      subtotal,
      descuento: 0,
      total,
      nota: nota || null,
    })
    .select()
    .single();

  if (ordenError) {
    return NextResponse.json({ error: ordenError.message }, { status: 400 });
  }

  // Crear items de la orden
  // Buscar producto_id por slug o crear items sin referencia a producto de inventario
  for (const item of items) {
    // Intentar encontrar el producto en la tabla de productos (inventario)
    const { data: producto } = await supabase
      .from("productos")
      .select("id")
      .eq("slug", item.slug)
      .single();

    await supabase.from("orden_items").insert({
      orden_id: orden.id,
      producto_id: producto?.id || null,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.cantidad * item.precio_unitario,
    });

    // Si existe en inventario, deducir stock
    if (producto?.id) {
      const { data: inv } = await supabase
        .from("inventario")
        .select("id, cantidad")
        .eq("producto_id", producto.id)
        .single();

      if (inv) {
        const nuevaCantidad = Math.max(0, (inv.cantidad as number) - item.cantidad);
        await supabase
          .from("inventario")
          .update({ cantidad: nuevaCantidad })
          .eq("id", inv.id);

        await supabase.from("movimientos").insert({
          producto_id: producto.id,
          tipo: "salida",
          cantidad: item.cantidad,
          cantidad_antes: inv.cantidad,
          cantidad_despues: nuevaCantidad,
          nota: `Venta — Orden #${orden.numero}`,
        });
      }
    }
  }

  // Generar nota de venta
  const folio = `NV-${String(orden.numero).padStart(4, "0")}`;
  const fecha = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ticketHtml = generarNotaDeVenta({
    folio,
    fecha,
    cliente_nombre,
    cliente_email,
    cliente_tel,
    items: orderItems,
    subtotal,
    iva,
    total,
    nota,
  });

  // Enviar nota de venta por email
  if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
    try {
      await sendEmail({
        to: cliente_email,
        subject: `Nota de Venta ${folio} — LOMEI HOME`,
        html: ticketHtml,
      });
    } catch {
      // Email falla silenciosamente — la orden ya se guardó
    }
  }

  return NextResponse.json(
    {
      data: {
        id: orden.id,
        numero: orden.numero,
        folio,
        total,
        ticket_html: ticketHtml,
      },
    },
    { status: 201 }
  );
}

// GET /api/ordenes — Listar órdenes (admin)
export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);

  const estado = searchParams.get("estado");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("ordenes")
    .select("*", { count: "exact" })
    .order("creado_en", { ascending: false })
    .range(offset, offset + limit - 1);

  if (estado) {
    query = query.eq("estado", estado);
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
