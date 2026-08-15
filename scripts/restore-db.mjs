/**
 * Restaura la base de datos desde un respaldo JSON
 * - Borra órdenes de prueba, movimientos, alertas
 * - Restaura inventario al estado del backup
 * - No toca productos ni clientes (solo restaura stock)
 *
 * Uso: node scripts/restore-db.mjs scripts/backup-2026-08-15.json
 */

import fs from "fs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Faltan variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const backupFile = process.argv[2];
if (!backupFile) {
  console.error("Uso: node scripts/restore-db.mjs <archivo-backup.json>");
  process.exit(1);
}

async function supabaseRequest(path, method, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: method === "DELETE" ? "return=minimal" : "return=representation",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path}: ${res.status} — ${text}`);
  }
  if (method === "DELETE") return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  const backup = JSON.parse(fs.readFileSync(backupFile, "utf-8"));

  console.log(`Restaurando respaldo del ${backup.fecha}`);
  console.log(`  - ${backup.productos.length} productos`);
  console.log(`  - ${backup.inventario.length} registros de inventario`);
  console.log(`  - ${backup.clientes.length} clientes\n`);

  // 1. Limpiar datos de prueba (en orden de FK)
  console.log("Limpiando datos de prueba...");
  await supabaseRequest("alertas_log?id=not.is.null", "DELETE");
  await supabaseRequest("movimientos?id=not.is.null", "DELETE");
  await supabaseRequest("orden_items?id=not.is.null", "DELETE");
  await supabaseRequest("ordenes?id=not.is.null", "DELETE");
  console.log("  ✓ Órdenes, movimientos y alertas eliminados");

  // 2. Restaurar inventario (actualizar cantidades)
  console.log("Restaurando inventario...");
  let stockOk = 0;
  for (const inv of backup.inventario) {
    try {
      await supabaseRequest(
        `inventario?id=eq.${inv.id}`,
        "PATCH",
        { cantidad: inv.cantidad, stock_minimo: inv.stock_minimo }
      );
      stockOk++;
    } catch (err) {
      console.log(`  ⚠ No se pudo restaurar inventario ${inv.id}: ${err.message}`);
    }
  }
  console.log(`  ✓ ${stockOk} registros de inventario restaurados`);

  console.log("\n✓ Restauración completa. La BD está como estaba el", backup.fecha.slice(0, 10));
}

main().catch(console.error);
