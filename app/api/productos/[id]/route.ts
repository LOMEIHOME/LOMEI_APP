import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type Params = { params: Promise<{ id: string }> };

// GET /api/productos/[id]
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("productos")
    .select("*, inventario(*)")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// PUT /api/productos/[id]
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("productos")
    .update({
      nombre: body.nombre,
      slug: body.slug,
      categoria: body.categoria,
      sku: body.sku || null,
      precio_costo: body.precio_costo,
      precio_venta: body.precio_venta,
      descripcion: body.descripcion || null,
      dimensiones: body.dimensiones || null,
      materiales: body.materiales || [],
      acabados: body.acabados || [],
      imagen_url: body.imagen_url || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/productos/[id] — Soft delete
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("productos")
    .update({ activo: false })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
