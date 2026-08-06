import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/productos — Listar productos con búsqueda, filtro y paginación
export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const categoria = searchParams.get("categoria") || "";
  const activo = searchParams.get("activo");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("productos")
    .select("*", { count: "exact" })
    .order("creado_en", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`nombre.ilike.%${search}%,sku.ilike.%${search}%`);
  }
  if (categoria) {
    query = query.eq("categoria", categoria);
  }
  if (activo !== null && activo !== "") {
    query = query.eq("activo", activo === "true");
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

// POST /api/productos — Crear producto
export async function POST(request: NextRequest) {
  const supabase = await createAdminClient();
  const body = await request.json();

  if (!body.nombre || !body.slug || !body.categoria) {
    return NextResponse.json(
      { error: "Nombre, slug y categoría son requeridos" },
      { status: 400 }
    );
  }

  if (body.precio_venta != null && body.precio_venta < 0) {
    return NextResponse.json(
      { error: "El precio de venta no puede ser negativo" },
      { status: 400 }
    );
  }

  const { data: producto, error } = await supabase
    .from("productos")
    .insert({
      nombre: body.nombre,
      slug: body.slug,
      categoria: body.categoria,
      sku: body.sku || null,
      precio_costo: body.precio_costo || 0,
      precio_venta: body.precio_venta || 0,
      descripcion: body.descripcion || null,
      dimensiones: body.dimensiones || null,
      materiales: body.materiales || [],
      acabados: body.acabados || [],
      imagen_url: body.imagen_url || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Crear registro de inventario automáticamente
  const { error: invError } = await supabase.from("inventario").insert({
    producto_id: producto.id,
    cantidad: body.cantidad_inicial || 0,
    ubicacion: body.ubicacion || "Showroom",
    stock_minimo: body.stock_minimo || 2,
  });

  if (invError) {
    return NextResponse.json({ error: invError.message }, { status: 400 });
  }

  // Registrar movimiento inicial si hay stock
  if (body.cantidad_inicial && body.cantidad_inicial > 0) {
    await supabase.from("movimientos").insert({
      producto_id: producto.id,
      tipo: "entrada",
      cantidad: body.cantidad_inicial,
      cantidad_antes: 0,
      cantidad_despues: body.cantidad_inicial,
      nota: "Stock inicial al crear producto",
    });
  }

  return NextResponse.json({ data: producto }, { status: 201 });
}
