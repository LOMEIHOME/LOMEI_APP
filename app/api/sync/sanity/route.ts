import { NextResponse } from "next/server";
import { getAllProductos } from "@/lib/sanity";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    // Verificar autenticación
    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const sanityProducts = await getAllProductos();
    const supabase = createServiceRoleClient();

    // Obtener todos los productos de Supabase
    const { data: supabaseProducts, error: fetchError } = await supabase
      .from("productos")
      .select("id, slug, sku, nombre, categoria, precio_venta, descripcion, dimensiones, materiales");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const supabaseMap = new Map(
      (supabaseProducts || []).filter((p: { sku: string | null }) => p.sku).map((p: { sku: string; [key: string]: unknown }) => [p.sku, p])
    );

    let creados = 0;
    let actualizados = 0;
    let sinCambios = 0;

    for (const sp of sanityProducts) {
      const existing = supabaseMap.get(sp.slug) as {
        id: string;
        slug: string;
        nombre: string;
        categoria: string;
        precio_venta: number;
        descripcion: string;
        dimensiones: string;
        materiales: string[];
      } | undefined;

      const mapped = {
        nombre: sp.name,
        slug: sp.slug,
        sku: sp.slug,
        categoria: sp.category || "Adornos",
        precio_venta: Math.round((sp.price || 0) * 100) / 100,
        descripcion: sp.description || "",
        dimensiones: sp.dimensions || "",
        materiales: sp.materials || [],
        activo: true,
      };

      if (!existing) {
        // Producto nuevo — crear en productos + inventario
        const { data: newProduct, error: insertError } = await supabase
          .from("productos")
          .insert(mapped)
          .select("id")
          .single();

        if (insertError) {
          // Saltar duplicados silenciosamente
          if (insertError.code === "23505") {
            sinCambios++;
            continue;
          }
          console.error(`Error creando ${sp.name}:`, insertError.message);
          continue;
        }

        // Crear registro de inventario con cantidad 0
        await supabase.from("inventario").insert({
          producto_id: newProduct.id,
          cantidad: 0,
          ubicacion: "Showroom",
          stock_minimo: 2,
        });

        creados++;
      } else {
        // Producto existente — actualizar solo campos de catálogo
        const needsUpdate =
          existing.slug !== mapped.slug ||
          existing.nombre !== mapped.nombre ||
          existing.categoria !== mapped.categoria ||
          existing.precio_venta !== mapped.precio_venta ||
          existing.descripcion !== mapped.descripcion ||
          existing.dimensiones !== mapped.dimensiones ||
          JSON.stringify(existing.materiales) !== JSON.stringify(mapped.materiales);

        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from("productos")
            .update({
              nombre: mapped.nombre,
              slug: mapped.slug,
              categoria: mapped.categoria,
              precio_venta: mapped.precio_venta,
              descripcion: mapped.descripcion,
              dimensiones: mapped.dimensiones,
              materiales: mapped.materiales,
            })
            .eq("id", existing.id);

          if (updateError) {
            console.error(`Error actualizando ${sp.name}:`, updateError.message);
            continue;
          }
          actualizados++;
        } else {
          sinCambios++;
        }
      }
    }

    return NextResponse.json({ creados, actualizados, sinCambios });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
