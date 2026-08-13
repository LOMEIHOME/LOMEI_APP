import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

type Params = { params: Promise<{ id: string }> };

// PUT /api/inventario/[id] — Ajustar stock (crea movimiento automáticamente)
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = createServiceRoleClient();
  const body = await request.json() as {
    tipo: string;
    cantidad: number;
    nota?: string;
    stock_minimo?: number;
  };

  // Obtener inventario actual
  const { data, error: getError } = await supabase
    .from("inventario")
    .select("*")
    .eq("id", id)
    .single();

  if (getError || !data) {
    return NextResponse.json(
      { error: "Registro de inventario no encontrado" },
      { status: 404 }
    );
  }

  const cantidadAntes = data.cantidad as number;
  let cantidadDespues: number;

  switch (body.tipo) {
    case "entrada":
      cantidadDespues = cantidadAntes + Math.abs(body.cantidad);
      break;
    case "salida":
      cantidadDespues = Math.max(0, cantidadAntes - Math.abs(body.cantidad));
      break;
    case "ajuste":
      cantidadDespues = Math.max(0, body.cantidad);
      break;
    case "devolucion":
      cantidadDespues = cantidadAntes + Math.abs(body.cantidad);
      break;
    default:
      return NextResponse.json(
        { error: "Tipo de movimiento inválido" },
        { status: 400 }
      );
  }

  // Actualizar inventario
  const { error: updateError } = await supabase
    .from("inventario")
    .update({
      cantidad: cantidadDespues,
      stock_minimo: body.stock_minimo ?? data.stock_minimo,
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  // Registrar movimiento
  const { error: movError } = await supabase.from("movimientos").insert({
    producto_id: data.producto_id,
    tipo: body.tipo,
    cantidad: Math.abs(body.cantidad),
    cantidad_antes: cantidadAntes,
    cantidad_despues: cantidadDespues,
    nota: body.nota || null,
  });

  if (movError) {
    return NextResponse.json({ error: movError.message }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      inventario_id: id,
      producto_id: data.producto_id,
      cantidad_antes: cantidadAntes,
      cantidad_despues: cantidadDespues,
      tipo: body.tipo,
    },
  });
}
