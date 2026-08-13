import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

// GET /api/clientes/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// PUT /api/clientes/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceRoleClient();
  const body = await request.json();

  const { nombre, email, telefono, tipo, notas } = body;

  const { data, error } = await supabase
    .from("clientes")
    .update({
      ...(nombre !== undefined && { nombre }),
      ...(email !== undefined && { email: email || null }),
      ...(telefono !== undefined && { telefono: telefono || null }),
      ...(tipo !== undefined && { tipo }),
      ...(notas !== undefined && { notas: notas || null }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
