/**
 * Script de importación masiva de productos desde Excel a Sanity CMS
 * Uso: node scripts/import-productos.mjs
 */

import { readFileSync } from "fs";
import { config } from "dotenv";
import { createClient } from "@sanity/client";
import * as XLSX from "xlsx";

// Cargar variables de entorno desde .env.local
config({ path: ".env.local" });

// ─── Configuración ───────────────────────────────────
const EXCEL_PATH = "C:/Users/LuisA/Downloads/Lista_accesorios.xlsx";

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ Falta SANITY_API_TOKEN en .env.local");
  process.exit(1);
}

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pc8b3z15",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ─── Helpers ─────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function parsePrice(raw) {
  if (typeof raw === "number") return raw;
  const str = String(raw).replace(/[$,\s]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function inferCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes("perchero")) return "Muebles";
  if (lower.includes("lámpara") || lower.includes("lampara")) return "Iluminación";
  if (lower.includes("cojín") || lower.includes("cojin") || lower.includes("textil")) return "Cojines & Textiles";
  if (lower.includes("alfombra") || lower.includes("tapete")) return "Alfombras";
  return "Adornos";
}

function makeUnique(slug, seen) {
  let candidate = slug;
  let i = 2;
  while (seen.has(candidate)) {
    candidate = `${slug}-${i}`;
    i++;
  }
  seen.add(candidate);
  return candidate;
}

// ─── Main ────────────────────────────────────────────

async function main() {
  console.log("📖 Leyendo Excel:", EXCEL_PATH);

  const buf = readFileSync(EXCEL_PATH);
  const workbook = XLSX.read(buf, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`📦 ${rows.length} filas encontradas\n`);

  // Obtener productos existentes para evitar duplicados
  const existing = await sanity.fetch(`*[_type == "producto"]{ "slug": slug.current }`);
  const existingSlugs = new Set(existing.map((p) => p.slug));
  console.log(`🔍 ${existingSlugs.size} productos ya existen en Sanity\n`);

  const seenSlugs = new Set([...existingSlugs]);
  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    // Buscar la columna de nombre (puede ser "Descripcion" o similar)
    const name =
      row["Descripcion"] || row["Descripción"] || row["DESCRIPCION"] || row["Nombre"] || row["nombre"];
    const priceRaw =
      row["Precio"] || row["PRECIO"] || row["precio"] || row["Precio Unitario"] || 0;
    const idProducto = row["ID Producto"] || row["ID"] || row["id"] || "";

    if (!name) {
      console.log(`⚠️  Fila sin nombre, saltando:`, row);
      skipped++;
      continue;
    }

    const slug = makeUnique(slugify(name), seenSlugs);

    // Saltar si ya existe en Sanity
    if (existingSlugs.has(slug)) {
      console.log(`⏭️  Ya existe: ${name} (${slug})`);
      skipped++;
      continue;
    }

    const price = parsePrice(priceRaw);
    const category = inferCategory(name);

    const doc = {
      _type: "producto",
      name: name.trim(),
      slug: { _type: "slug", current: slug },
      category,
      price,
      description: `${name.trim()} — producto decorativo disponible en LOMEI Home.`,
      dimensions: "",
      materials: [],
      finishes: [],
      images: [],
      badge: "Disponible",
    };

    try {
      await sanity.create(doc);
      created++;
      console.log(`✅ [${created}] ${name} → ${slug} ($${price.toFixed(2)}) [${category}]`);
    } catch (err) {
      errors++;
      console.error(`❌ Error creando "${name}":`, err.message);
    }
  }

  console.log(`\n════════════════════════════════════`);
  console.log(`✅ Creados:  ${created}`);
  console.log(`⏭️  Saltados: ${skipped}`);
  console.log(`❌ Errores:  ${errors}`);
  console.log(`════════════════════════════════════`);
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
