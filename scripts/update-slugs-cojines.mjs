/**
 * Actualiza slugs de cojines en Sanity con ID Producto del Excel de cojines.
 * Mapea por nombre del cojín (ej: "Amelie Snow" ↔ "Cojín decorativo Amelie Snow 50 x 50 cm c/relleno")
 *
 * Uso: node scripts/update-slugs-cojines.mjs
 *   --dry-run  (default)
 *   --apply    aplica cambios
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "next-sanity";
import XLSX from "xlsx";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Faltan NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_WRITE_TOKEN en .env.local");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });
const dryRun = !process.argv.includes("--apply");

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[,.\-()]/g, " ").replace(/\s+/g, " ").trim();
}

// Leer Excel cojines
const wb = XLSX.readFile("C:/Users/LuisA/Downloads/Lista_cojines.xlsx");
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

const excelCojines = [];
for (let i = 2; i < rows.length; i++) {
  const row = rows[i];
  if (!row || !row[0] || !row[1]) continue;

  const desc = String(row[1]).trim();
  // Extraer nombre del cojín: "Cojín decorativo Amelie Snow 50 x 50 cm c/relleno" → "amelie snow"
  const nameMatch = desc.match(/Cojín\s+[Dd]ecorativ[oa]\s+(.+?)\s+(?:\d+\s*[xX×D]|\d+\s*cm|c\/relleno)/i);
  const shortName = nameMatch ? nameMatch[1].trim() : desc;

  excelCojines.push({
    sku: String(row[0]).trim(),
    nombre: desc,
    shortName,
    normalized: normalize(shortName),
    precio: row[4] ? Math.round(Number(row[4]) * 100) / 100 : null, // Precio con IVA
  });
}

console.log(`\n📊 Excel cojines: ${excelCojines.length} productos\n`);

// Leer cojines de Sanity
const sanityProducts = await client.fetch(
  `*[_type == "producto" && (category == "Cojines" || category == "Cojines & Textiles")] { _id, name, slug, price, category }`
);

console.log(`📦 Sanity cojines: ${sanityProducts.length} productos\n`);

const matched = [];
const unmatched = [];
const usedExcel = new Set();

for (const sp of sanityProducts) {
  const spNorm = normalize(sp.name);

  let bestMatch = null;
  let bestIdx = -1;

  for (let i = 0; i < excelCojines.length; i++) {
    if (usedExcel.has(i)) continue;
    const ep = excelCojines[i];

    // Match exacto por nombre normalizado
    if (ep.normalized === spNorm) {
      bestMatch = ep;
      bestIdx = i;
      break;
    }

    // Match parcial
    if (ep.normalized.includes(spNorm) || spNorm.includes(ep.normalized)) {
      if (!bestMatch) {
        bestMatch = ep;
        bestIdx = i;
      }
    }
  }

  if (bestMatch && bestIdx >= 0) {
    usedExcel.add(bestIdx);
    matched.push({
      sanityId: sp._id,
      sanityName: sp.name,
      currentSlug: sp.slug?.current,
      newSlug: bestMatch.sku.toLowerCase(),
      sku: bestMatch.sku,
      excelName: bestMatch.shortName,
      excelPrice: bestMatch.precio,
      sanityPrice: sp.price,
    });
  } else {
    unmatched.push({
      sanityName: sp.name,
      currentSlug: sp.slug?.current,
      category: sp.category,
    });
  }
}

console.log(`✅ Mapeados: ${matched.length}`);
console.log(`❌ Sin mapeo: ${unmatched.length}\n`);

console.log("── MAPEADOS ──────────────────────────────────");
for (const m of matched) {
  const slugChanged = m.currentSlug !== m.newSlug;
  console.log(
    `${slugChanged ? "🔄" : "✓ "} ${m.sku} ← "${m.sanityName}" → "${m.excelName}"` +
    (slugChanged ? ` (${m.currentSlug} → ${m.newSlug})` : "")
  );
}

if (unmatched.length > 0) {
  console.log("\n── SIN MAPEO ──");
  for (const u of unmatched) {
    console.log(`   ⚪ [${u.category}] "${u.sanityName}" (${u.currentSlug})`);
  }
}

if (!dryRun) {
  console.log("\n🚀 Aplicando cambios...\n");
  let updated = 0;

  for (const m of matched) {
    if (m.currentSlug === m.newSlug) continue;
    try {
      await client.patch(m.sanityId).set({ slug: { _type: "slug", current: m.newSlug } }).commit();
      updated++;
      console.log(`   ✅ ${m.sku} — ${m.sanityName}`);
    } catch (err) {
      console.error(`   ❌ Error en ${m.sku}: ${err.message}`);
    }
  }
  console.log(`\n✨ Listo: ${updated} slugs actualizados`);
} else {
  console.log("\n⚠️  Modo dry-run. Usa --apply para ejecutar.");
}
