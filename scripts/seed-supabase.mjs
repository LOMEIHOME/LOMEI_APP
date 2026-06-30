/**
 * Seed Supabase con productos desde Sanity CMS
 * Inserta cada producto en la tabla `productos` y crea un registro
 * en `inventario` con cantidad = 1
 *
 * Uso: node scripts/seed-supabase.mjs
 */

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pc8b3z15";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Faltan variables NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

async function fetchSanityProducts() {
  const query = encodeURIComponent(
    '*[_type=="producto"]{name,slug,category,price,description,dimensions,materials}'
  );
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result;
}

async function supabaseRequest(path, method, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase ${method} ${path}: ${res.status} — ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function main() {
  console.log("Obteniendo productos de Sanity...");
  const sanityProducts = await fetchSanityProducts();
  console.log(`Encontrados: ${sanityProducts.length} productos\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const p of sanityProducts) {
    const slug = p.slug?.current || p.slug;
    if (!slug) {
      console.log(`⚠ Sin slug: "${p.name}" — saltando`);
      skipped++;
      continue;
    }

    try {
      // Insertar producto
      const [producto] = await supabaseRequest("productos", "POST", {
        nombre: p.name,
        slug,
        categoria: p.category || "Adornos",
        precio_venta: Math.round((p.price || 0) * 100) / 100,
        descripcion: p.description || "",
        dimensiones: p.dimensions || "",
        materiales: p.materials || [],
        activo: true,
      });

      // Crear registro de inventario con cantidad 1
      await supabaseRequest("inventario", "POST", {
        producto_id: producto.id,
        cantidad: 1,
        ubicacion: "Showroom",
        stock_minimo: 2,
      });

      console.log(`✓ ${p.name}`);
      created++;
    } catch (err) {
      if (err.message.includes("duplicate") || err.message.includes("23505")) {
        console.log(`– Ya existe: "${p.name}"`);
        skipped++;
      } else {
        console.log(`✗ Error "${p.name}": ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`\n— Resumen —`);
  console.log(`Creados:  ${created}`);
  console.log(`Saltados: ${skipped}`);
  console.log(`Errores:  ${errors}`);
}

main().catch(console.error);
