import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createAdminClient();
  const { id } = await params;

  const { data: orden, error } = await supabase
    .from("ordenes")
    .select("*, orden_items(*, productos(nombre))")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: orden });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createAdminClient();
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
