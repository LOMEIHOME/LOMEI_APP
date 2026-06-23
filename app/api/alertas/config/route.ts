import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("alertas_config")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({
      data: {
        notificar_email: true,
        notificar_whatsapp: false,
        email_destino: "",
        telefono_destino: "",
        frecuencia_horas: 24,
        activo: true,
      },
    });
  }

  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createAdminClient();
  const body = await request.json();

  const {
    notificar_email,
    notificar_whatsapp,
    email_destino,
    telefono_destino,
    frecuencia_horas,
    activo,
  } = body;

  const config = {
    notificar_email,
    notificar_whatsapp,
    email_destino,
    telefono_destino,
    frecuencia_horas,
    activo,
  };

  // Intentar obtener configuración existente
  const { data: existing, error: fetchError } = await supabase
    .from("alertas_config")
    .select("id")
    .limit(1)
    .single();

  if (existing && !fetchError) {
    // Actualizar existente
    const { data: result, error } = await supabase
      .from("alertas_config")
      .update(config)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: result });
  } else {
    // Insertar nueva configuración
    const { data: result, error } = await supabase
      .from("alertas_config")
      .insert(config)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: result });
  }
}
