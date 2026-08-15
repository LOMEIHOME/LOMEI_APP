/**
 * Seed de velas Yolt en Sanity + Supabase
 * - Crea productos en Sanity CMS (slug = ID producto en minúsculas)
 * - Crea productos en Supabase con SKU = slug, stock = 1
 *
 * Uso: node scripts/seed-velas.mjs
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

// Datos del CSV
const VELAS = [
  { id: "YT250101", name: "Statement U Blanco", price: 175 },
  { id: "YT250102", name: "Statement U Verde olivo", price: 175 },
  { id: "YT250103", name: "Statement U Naranja", price: 175 },
  { id: "YT250104", name: "Statement U Lila", price: 175 },
  { id: "YT250105", name: "Statement U Fuccia", price: 175 },
  { id: "YT250201", name: "Statement Bola Blanco", price: 220 },
  { id: "YT250202", name: "Statement Bola Verde olivo", price: 220 },
  { id: "YT250203", name: "Statement Bola Naranja", price: 220 },
  { id: "YT250204", name: "Statement Bola Lila", price: 220 },
  { id: "YT250205", name: "Statement Bola Fuccia", price: 220 },
  { id: "YT250304", name: "Statement Prisma M Lila", price: 195 },
  { id: "YT250305", name: "Statement Prisma M Fuccia", price: 195 },
  { id: "YT250404", name: "Statement Prisma L Lila", price: 275 },
  { id: "YT250405", name: "Statement Prisma L Fuccia", price: 275 },
  { id: "YT260201", name: "Twist M Blanco", price: 200 },
  { id: "YT260204", name: "Twist M Lila", price: 200 },
  { id: "YT260205", name: "Twist M Fuccia", price: 200 },
  { id: "YT260203", name: "Twist M Naranja", price: 200 },
  { id: "YT260301", name: "Twist L Blanco", price: 250 },
  { id: "YT260304", name: "Twist L Lila", price: 250 },
  { id: "YT260305", name: "Twist L Fuccia", price: 250 },
  { id: "YT260303", name: "Twist L Naranja", price: 250 },
  { id: "YT270101", name: "Flor Blanco", price: 480 },
  { id: "YT270102", name: "Flor Verde olivo", price: 480 },
  { id: "YT270103", name: "Flor Naranja", price: 480 },
  { id: "YT270104", name: "Flor Lila", price: 480 },
  { id: "YT270105", name: "Flor Fuccia", price: 480 },
  { id: "YT250501", name: "Statement Bubble Blanco", price: 95 },
  { id: "YT250502", name: "Statement Bubble Verde olivo", price: 95 },
  { id: "YT250503", name: "Statement Bubble Naranja", price: 95 },
  { id: "YT250504", name: "Statement Bubble Lila", price: 95 },
  { id: "YT250505", name: "Statement Bubble Fuccia", price: 95 },
  { id: "YT280101", name: "Set decorativo Budda Blanco", price: 575 },
  { id: "YT280106", name: "Set decorativo Budda Rosa", price: 575 },
  { id: "YT280206", name: "Set decorativo Suculentas Rosa", price: 575 },
  { id: "YT280306", name: "Set decorativo Jardin botanico Rosa", price: 600 },
  { id: "YT290301", name: "Artesanal Cera de soja Budda + flores Blanco", price: 550 },
  { id: "YT310306", name: "Yolt bloom Flower bomb petalos Rosa", price: 500 },
  { id: "YT320104", name: "Yolt little bloom Peonia Lila", price: 140 },
  { id: "YT310406", name: "Yolt bloom Flower bomb tulipanes Rosa", price: 480 },
  { id: "YT310501", name: "Yolt bloom Bouquet neutral Blanco", price: 550 },
  { id: "YT290201", name: "Artesanal Cera de soja flores Blanco", price: 550 },
  { id: "YT290101", name: "Artesanal Cera de Soja natural Blanco", price: 270 },
  { id: "YT300901", name: "Yolt antojos Iced coffee S Blanco", price: 350 },
];

async function main() {
  let sanityOk = 0, supabaseOk = 0, errors = 0;

  for (const v of VELAS) {
    const slug = v.id.toLowerCase();

    try {
      // 1. Crear en Sanity
      await sanity.createOrReplace({
        _id: `producto-${slug}`,
        _type: "producto",
        name: v.name,
        slug: { _type: "slug", current: slug },
        category: "Velas",
        price: v.price,
        description: "",
      });
      sanityOk++;

      // 2. Crear en Supabase
      const [producto] = await supabaseRequest("productos", "POST", {
        nombre: v.name,
        slug,
        sku: slug,
        categoria: "Velas",
        precio_venta: v.price,
        descripcion: "",
        activo: true,
      });

      // 3. Crear inventario con stock = 1
      await supabaseRequest("inventario", "POST", {
        producto_id: producto.id,
        cantidad: 1,
        ubicacion: "Showroom",
        stock_minimo: 2,
      });
      supabaseOk++;

      console.log(`✓ ${v.name} (SKU: ${slug}, $${v.price})`);
    } catch (err) {
      if (err.message.includes("duplicate") || err.message.includes("23505")) {
        console.log(`– Ya existe: "${v.name}" (${slug})`);
      } else {
        console.log(`✗ Error "${v.name}": ${err.message}`);
        errors++;
      }
    }
  }

  console.log(`\n— Resumen —`);
  console.log(`Sanity:   ${sanityOk} creados`);
  console.log(`Supabase: ${supabaseOk} creados (stock: 1)`);
  console.log(`Errores:  ${errors}`);
}

main().catch(console.error);
