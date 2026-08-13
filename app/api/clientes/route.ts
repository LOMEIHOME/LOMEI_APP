import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// GET /api/clientes — Listar/buscar clientes
export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search");
  const tipo = searchParams.get("tipo");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("clientes")
    .select("*", { count: "exact" })
    .order("creado_en", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(
      `nombre.ilike.%${search}%,email.ilike.%${search}%,telefono.ilike.%${search}%`
    );
  }

  if (tipo) {
    query = query.eq("tipo", tipo);
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

// POST /api/clientes — Crear cliente
export async function POST(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const body = await request.json();

  const { nombre, email, telefono, tipo, notas } = body;

  if (!nombre) {
    return NextResponse.json(
      { error: "El nombre es requerido" },
      { status: 400 }
    );
  }

  // Si tiene email, buscar si ya existe
  if (email) {
    const { data: existing } = await supabase
      .from("clientes")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ data: existing }, { status: 200 });
    }
  }

  const { data, error } = await supabase
    .from("clientes")
    .insert({
      nombre,
      email: email || null,
      telefono: telefono || null,
      tipo: tipo || "menudeo",
      notas: notas || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
