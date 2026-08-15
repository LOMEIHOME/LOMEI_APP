/**
 * Seed de aromas Mandaland en Sanity + Supabase
 * - Crea productos en Sanity CMS (slug = ID producto en minúsculas)
 * - Crea productos en Supabase con SKU = slug, stock = cantidad del CSV
 *
 * Uso: node scripts/seed-aromas.mjs
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pc8b3z15";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SANITY_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Faltan variables: SANITY_WRITE_TOKEN, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: SANITY_TOKEN,
  useCdn: false,
});

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
  if (!res.ok) throw new Error(`Supabase ${method} ${path}: ${res.status} — ${text}`);
  return text ? JSON.parse(text) : null;
}

// Datos del Excel
const AROMAS = [
  { id: "MDL3401", name: "Dispensador electrico", cantidad: 7, price: 998 },
  { id: "MDL3501", name: "Recarga de dispensador Reina (cor)", cantidad: 4, price: 499 },
  { id: "MDL3502", name: "Recarga de dispensador Jazmin", cantidad: 1, price: 499 },
  { id: "MDL3503", name: "Recarga de dispensador Mango", cantidad: 1, price: 499 },
  { id: "MDL3504", name: "Recarga de dispensador Massimo Dutti", cantidad: 2, price: 499 },
  { id: "MDL3505", name: "Recarga de dispensador Té verde", cantidad: 2, price: 499 },
  { id: "MDL3506", name: "Recarga de dispensador Aloe", cantidad: 1, price: 499 },
  { id: "MDL3507", name: "Recarga de dispensador Armonia", cantidad: 2, price: 499 },
  { id: "MDL3508", name: "Recarga de dispensador Infinity", cantidad: 1, price: 499 },
  { id: "MDL3509", name: "Recarga de dispensador Frutos rojos", cantidad: 1, price: 499 },
  { id: "MDL3510", name: "Recarga de dispensador Verde limón", cantidad: 2, price: 499 },
  { id: "MDL3603", name: "Mikado 500 ml Mango", cantidad: 1, price: 800 },
  { id: "MDL3609", name: "Mikado 500 ml Frutos rojos", cantidad: 1, price: 800 },
  { id: "MDL3611", name: "Mikado 500 ml Fresa", cantidad: 1, price: 800 },
  { id: "MDL3612", name: "Mikado 500 ml Palacio premium", cantidad: 1, price: 800 },
  { id: "MDL3613", name: "Mikado 500 ml Santal 33", cantidad: 1, price: 800 },
  { id: "MDL3614", name: "Mikado 500 ml Tabaco vainilla", cantidad: 1, price: 800 },
  { id: "MDL3615", name: "Mikado 500 ml Chocolate", cantidad: 1, price: 800 },
  { id: "MDL3616", name: "Mikado 500 ml Algodón de azúcar", cantidad: 1, price: 800 },
  { id: "MDL3708", name: "Aerosol turbo Infinity", cantidad: 1, price: 499 },
  { id: "MDL3706", name: "Aerosol turbo Aloe", cantidad: 2, price: 499 },
  { id: "MDL3705", name: "Aerosol turbo Té verde", cantidad: 2, price: 499 },
  { id: "MDL3717", name: "Aerosol turbo Mango tropical", cantidad: 1, price: 499 },
  { id: "MDL3718", name: "Aerosol turbo Car leather", cantidad: 1, price: 499 },
  { id: "MDL3719", name: "Aerosol turbo Higo", cantidad: 1, price: 499 },
  { id: "MDL3720", name: "Aerosol turbo Sicilian summer", cantidad: 1, price: 499 },
  { id: "MDL3721", name: "Aerosol turbo Vetiver del caribe", cantidad: 1, price: 499 },
];

async function main() {
  let sanityOk = 0, supabaseOk = 0, errors = 0;

  for (const a of AROMAS) {
    const slug = a.id.toLowerCase();

    try {
      // 1. Crear en Sanity
      await sanity.createOrReplace({
        _id: `producto-${slug}`,
        _type: "producto",
        name: a.name,
        slug: { _type: "slug", current: slug },
        category: "Aromas",
        price: a.price,
        description: "",
        badge: "Lomei & Yolt",
      });
      sanityOk++;

      // 2. Crear en Supabase
      const [producto] = await supabaseRequest("productos", "POST", {
        nombre: a.name,
        slug,
        sku: slug,
        categoria: "Aromas",
        precio_venta: a.price,
        descripcion: "",
        activo: true,
      });

      // 3. Crear inventario con la cantidad del Excel
      await supabaseRequest("inventario", "POST", {
        producto_id: producto.id,
        cantidad: a.cantidad,
        ubicacion: "Showroom",
        stock_minimo: 2,
      });
      supabaseOk++;

      console.log(`✓ ${a.name} (SKU: ${slug}, $${a.price}, stock: ${a.cantidad})`);
    } catch (err) {
      if (err.message.includes("duplicate") || err.message.includes("23505")) {
        console.log(`– Ya existe: "${a.name}" (${slug})`);
      } else {
        console.log(`✗ Error "${a.name}": ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`\n— Resumen —`);
  console.log(`Sanity:   ${sanityOk} creados`);
  console.log(`Supabase: ${supabaseOk} creados`);
  console.log(`Errores:  ${errors}`);
}

main().catch(console.error);
