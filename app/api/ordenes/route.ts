import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { generarNotaDeVenta, calcularTotales } from "@/lib/ticket";
import { sendEmail } from "@/lib/email";

// POST /api/ordenes — Crear orden desde checkout
export async function POST(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const body = await request.json();

  const { cliente_nombre, cliente_email, cliente_tel, cliente_id, nota, enviar_ticket, items } = body;

  if (!cliente_nombre?.trim() || !items?.length) {
    return NextResponse.json(
      { error: "Nombre y al menos un producto son requeridos" },
      { status: 400 }
    );
  }

  if (enviar_ticket && !cliente_email?.trim()) {
    return NextResponse.json(
      { error: "El email es requerido para enviar el ticket" },
      { status: 400 }
    );
  }

  // Validar cada item: cantidades positivas y enteras
  for (const item of items) {
    if (!item.cantidad || item.cantidad < 1 || !Number.isInteger(item.cantidad)) {
      return NextResponse.json(
        { error: `Cantidad inválida para "${item.nombre}"` },
        { status: 400 }
      );
    }
    if (!Number.isFinite(item.precio_unitario) || item.precio_unitario <= 0) {
      return NextResponse.json(
        { error: `Precio inválido para "${item.nombre}"` },
        { status: 400 }
      );
    }
    // Validar descuento (porcentaje 0-100)
    const desc = item.descuento ?? 0;
    if (!Number.isFinite(desc) || desc < 0 || desc > 100) {
      return NextResponse.json(
        { error: `Descuento inválido para "${item.nombre}"` },
        { status: 400 }
      );
    }
  }

  // Validar stock y precio de cada producto contra la BD
  const productosValidados: { id: string; slug: string; nombre: string; invId: string; invCantidad: number; cantidadSolicitada: number; precio_unitario: number; descuento: number }[] = [];

  for (const item of items) {
    const { data: producto } = await supabase
      .from("productos")
      .select("id, nombre, precio_venta")
      .eq("slug", item.slug)
      .eq("activo", true)
      .single();

    if (!producto) {
      return NextResponse.json(
        { error: `Producto "${item.nombre}" no encontrado o inactivo` },
        { status: 400 }
      );
    }

    // Validar que el precio no fue manipulado
    if (Math.abs(producto.precio_venta - item.precio_unitario) > 0.01) {
      return NextResponse.json(
        { error: `El precio de "${item.nombre}" cambió. Recarga la página e intenta de nuevo.` },
        { status: 400 }
      );
    }

    const { data: inv } = await supabase
      .from("inventario")
      .select("id, cantidad")
      .eq("producto_id", producto.id)
      .single();

    if (!inv || (inv.cantidad as number) < item.cantidad) {
      return NextResponse.json(
        { error: `Stock insuficiente para "${item.nombre}" (disponible: ${inv?.cantidad ?? 0})` },
        { status: 400 }
      );
    }

    productosValidados.push({
      id: producto.id,
      slug: item.slug,
      nombre: item.nombre,
      invId: inv.id,
      invCantidad: inv.cantidad as number,
      cantidadSolicitada: item.cantidad,
      precio_unitario: producto.precio_venta, // Usar precio de la BD, no del frontend
      descuento: item.descuento ?? 0,
    });
  }

  // Calcular totales con precios validados de la BD (aplicando descuentos)
  const orderItems = productosValidados.map((pv) => {
    const base = pv.cantidadSolicitada * pv.precio_unitario;
    const descuentoMonto = pv.descuento > 0 ? Math.round(base * (pv.descuento / 100) * 100) / 100 : 0;
    return {
      nombre: pv.nombre,
      cantidad: pv.cantidadSolicitada,
      precio_unitario: pv.precio_unitario,
      descuento: pv.descuento,
      subtotal: base - descuentoMonto,
    };
  });

  const { subtotal, iva, total } = calcularTotales(orderItems);

  // Crear orden
  const { data: orden, error: ordenError } = await supabase
    .from("ordenes")
    .insert({
      cliente_nombre,
      cliente_email,
      cliente_tel: cliente_tel || null,
      cliente_id: cliente_id || null,
      estado: "completada",
      subtotal,
      descuento: orderItems.reduce((s, oi) => {
        const base = oi.cantidad * oi.precio_unitario;
        return s + (base - oi.subtotal);
      }, 0),
      total,
      nota: nota || null,
    })
    .select()
    .single();

  if (ordenError) {
    return NextResponse.json({ error: ordenError.message }, { status: 400 });
  }

  // Crear items de la orden y deducir stock (ya validado arriba)
  for (const pv of productosValidados) {
    const base = pv.cantidadSolicitada * pv.precio_unitario;
    const descMonto = pv.descuento > 0 ? Math.round(base * (pv.descuento / 100) * 100) / 100 : 0;
    await supabase.from("orden_items").insert({
      orden_id: orden.id,
      producto_id: pv.id,
      cantidad: pv.cantidadSolicitada,
      precio_unitario: pv.precio_unitario,
      descuento: pv.descuento,
      subtotal: base - descMonto,
    });

    const nuevaCantidad = pv.invCantidad - pv.cantidadSolicitada;
    await supabase
      .from("inventario")
      .update({ cantidad: nuevaCantidad })
      .eq("id", pv.invId);

    await supabase.from("movimientos").insert({
      producto_id: pv.id,
      tipo: "salida",
      cantidad: pv.cantidadSolicitada,
      cantidad_antes: pv.invCantidad,
      cantidad_despues: nuevaCantidad,
      nota: `Venta — Orden #${orden.numero}`,
    });
  }

  // Generar nota de venta
  const folio = `NV-${String(orden.numero).padStart(4, "0")}`;
  const fecha = new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalDescuento = orderItems.reduce((s, oi) => {
    const base = oi.cantidad * oi.precio_unitario;
    return s + (base - oi.subtotal);
  }, 0);

  const ticketHtml = generarNotaDeVenta({
    folio,
    fecha,
    cliente_nombre,
    cliente_email,
    cliente_tel,
    items: orderItems,
    subtotal,
    descuento: totalDescuento,
    iva,
    total,
    nota,
  });

  // Guardar ticket en la orden
  await supabase
    .from("ordenes")
    .update({ ticket_html: ticketHtml })
    .eq("id", orden.id);

  // Enviar nota de venta por email (solo si se solicitó)
  let emailEnviado = false;
  if (enviar_ticket && cliente_email && process.env.EMAIL_USER && process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN) {
    try {
      await sendEmail({
        to: cliente_email,
        subject: `Nota de Venta ${folio} — LOMEI HOME`,
        html: ticketHtml,
      });
      emailEnviado = true;
    } catch (err) {
      console.error("Error enviando email:", err instanceof Error ? err.message : err);
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
        email_enviado: emailEnviado,
      },
    },
    { status: 201 }
  );
}

// GET /api/ordenes — Listar órdenes (admin)
export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
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

  const search = searchParams.get("search");
  if (search) {
    const num = parseInt(search);
    if (!isNaN(num)) {
      query = query.or(`numero.eq.${num},cliente_nombre.ilike.%${search}%`);
    } else {
      query = query.ilike("cliente_nombre", `%${search}%`);
    }
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
