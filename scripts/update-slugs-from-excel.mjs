/**
 * Actualiza los slugs de productos en Sanity usando el ID Producto del Excel.
 * Mapea por nombre (fuzzy match normalizado).
 *
 * Uso: node scripts/update-slugs-from-excel.mjs
 *   --dry-run  (default) solo muestra el mapeo sin modificar
 *   --apply    aplica los cambios en Sanity
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

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const dryRun = !process.argv.includes("--apply");

// Normalizar nombre para comparación
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/[,.\-()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Leer Excel
const wb = XLSX.readFile("C:/Users/LuisA/Downloads/Lista_accesorios.xlsx");
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Parsear productos del Excel (fila 1 = header, filas 2+ = data)
const excelProducts = [];
for (let i = 2; i < rows.length; i++) {
  const row = rows[i];
  if (!row || !row[0] || !row[1]) continue;
  excelProducts.push({
    sku: String(row[0]).trim(),
    nombre: String(row[1]).trim(),
    precio: row[3] ? Math.round(Number(row[3]) * 100) / 100 : null,
    normalized: normalize(String(row[1])),
  });
}

console.log(`\n📊 Excel: ${excelProducts.length} productos con SKU\n`);

// Leer productos de Sanity
const sanityProducts = await client.fetch(
  `*[_type == "producto"] { _id, name, slug, price, category }`
);

console.log(`📦 Sanity: ${sanityProducts.length} productos\n`);

// Extraer palabras clave significativas (sin stopwords)
const STOPWORDS = new Set([
  "de", "del", "en", "con", "y", "a", "la", "el", "los", "las", "un", "una",
  "set", "decorativo", "decorativa", "decorativos", "decorativas",
  "accesorio", "acabado", "estilo", "base", "artificial", "planta",
]);

function keywords(str) {
  return normalize(str)
    .split(" ")
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function similarity(a, b) {
  const kwA = keywords(a);
  const kwB = keywords(b);
  if (kwA.length === 0 || kwB.length === 0) return 0;
  const shared = kwA.filter((w) => kwB.some((w2) => w2.includes(w) || w.includes(w2)));
  return shared.length / Math.max(kwA.length, kwB.length);
}

// Mapear por nombre — primero slug exacto, luego normalizado, luego fuzzy
const matched = [];
const unmatched = [];
const usedExcel = new Set();

// Paso 1: match por slug actual ↔ URL del Excel
for (const sp of sanityProducts) {
  const slug = sp.slug?.current;
  if (!slug) continue;
  const match = excelProducts.find((ep, i) => {
    if (usedExcel.has(i)) return false;
    const epNorm = normalize(ep.nombre);
    // Coincidencia exacta normalizada
    if (epNorm === normalize(sp.name)) return true;
    return false;
  });
  if (match) {
    const idx = excelProducts.indexOf(match);
    usedExcel.add(idx);
    matched.push({
      sanityId: sp._id,
      sanityName: sp.name,
      currentSlug: slug,
      newSlug: match.sku.toLowerCase(),
      sku: match.sku,
      excelName: match.nombre,
      excelPrice: match.precio,
      sanityPrice: sp.price,
    });
  }
}

// Paso 2: match por contenido parcial
const remaining = sanityProducts.filter((sp) => !matched.some((m) => m.sanityId === sp._id));

for (const sp of remaining) {
  const spNorm = normalize(sp.name);
  let bestMatch = null;
  let bestScore = 0;

  for (let i = 0; i < excelProducts.length; i++) {
    if (usedExcel.has(i)) continue;
    const ep = excelProducts[i];

    // Contenido parcial
    if (ep.normalized.includes(spNorm) || spNorm.includes(ep.normalized)) {
      const score = 0.8;
      if (score > bestScore) { bestScore = score; bestMatch = { ep, idx: i }; }
      continue;
    }

    // Similaridad por keywords
    const sim = similarity(sp.name, ep.nombre);
    if (sim > 0.5 && sim > bestScore) {
      bestScore = sim;
      bestMatch = { ep, idx: i };
    }
  }

  if (bestMatch) {
    usedExcel.add(bestMatch.idx);
    matched.push({
      sanityId: sp._id,
      sanityName: sp.name,
      currentSlug: sp.slug?.current,
      newSlug: bestMatch.ep.sku.toLowerCase(),
      sku: bestMatch.ep.sku,
      excelName: bestMatch.ep.nombre,
      excelPrice: bestMatch.ep.precio,
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

// Mostrar resultados
console.log(`✅ Mapeados: ${matched.length}`);
console.log(`❌ Sin mapeo: ${unmatched.length}\n`);

console.log("── MAPEADOS ──────────────────────────────────");
for (const m of matched) {
  const slugChanged = m.currentSlug !== m.newSlug;
  const priceChanged = m.excelPrice && Math.abs(m.sanityPrice - m.excelPrice) > 0.5;
  console.log(
    `${slugChanged ? "🔄" : "✓ "} ${m.sku} ← "${m.sanityName}"` +
    (slugChanged ? ` (slug: ${m.currentSlug} → ${m.newSlug})` : "") +
    (priceChanged ? ` | precio: $${m.sanityPrice} → $${m.excelPrice}` : "")
  );
}

if (unmatched.length > 0) {
  console.log("\n── SIN MAPEO (probablemente cojines u otros) ──");
  for (const u of unmatched) {
    console.log(`   ⚪ [${u.category}] "${u.sanityName}" (slug: ${u.currentSlug})`);
  }
}

// Aplicar cambios
if (!dryRun) {
  console.log("\n🚀 Aplicando cambios en Sanity...\n");

  let updated = 0;
  let pricesUpdated = 0;

  for (const m of matched) {
    const slugChanged = m.currentSlug !== m.newSlug;
    const priceChanged = m.excelPrice && Math.abs(m.sanityPrice - m.excelPrice) > 0.5;

    if (!slugChanged && !priceChanged) continue;

    const patch = {};
    if (slugChanged) patch.slug = { _type: "slug", current: m.newSlug };
    if (priceChanged) patch.price = m.excelPrice;

    try {
      await client.patch(m.sanityId).set(patch).commit();
      if (slugChanged) updated++;
      if (priceChanged) pricesUpdated++;
      console.log(`   ✅ ${m.sku} — ${m.sanityName}`);
    } catch (err) {
      console.error(`   ❌ Error en ${m.sku}: ${err.message}`);
    }
  }

  console.log(`\n✨ Listo: ${updated} slugs actualizados, ${pricesUpdated} precios actualizados`);
} else {
  console.log("\n⚠️  Modo dry-run. Usa --apply para ejecutar los cambios.");
}
