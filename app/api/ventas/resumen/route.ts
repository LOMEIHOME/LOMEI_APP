import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);

  const now = new Date();
  const desde =
    searchParams.get("desde") ??
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const hasta =
    searchParams.get("hasta") ?? now.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("vista_ventas_resumen")
    .select("*")
    .gte("fecha", desde)
    .lte("fecha", hasta)
    .order("fecha", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
