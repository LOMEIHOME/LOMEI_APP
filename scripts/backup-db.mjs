/**
 * Respaldo de la base de datos (productos + inventario + clientes)
 * Guarda un snapshot JSON que se puede restaurar con restore-db.mjs
 *
 * Uso: node scripts/backup-db.mjs
 */

import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Faltan variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

async function supabaseGet(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`GET ${table}: ${res.status}`);
  return res.json();
}

async function main() {
  console.log("Descargando datos...");

  const [productos, inventario, clientes] = await Promise.all([
    supabaseGet("productos"),
    supabaseGet("inventario"),
    supabaseGet("clientes"),
  ]);

  const backup = {
    fecha: new Date().toISOString(),
    productos,
    inventario,
    clientes,
  };

  const filename = `backup-${new Date().toISOString().slice(0, 10)}.json`;
  const filepath = path.resolve("scripts", filename);
  fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));

  console.log(`\n✓ Respaldo guardado: scripts/${filename}`);
  console.log(`  - ${productos.length} productos`);
  console.log(`  - ${inventario.length} registros de inventario`);
  console.log(`  - ${clientes.length} clientes`);
  console.log(`\nPara restaurar: node scripts/restore-db.mjs scripts/${filename}`);
}

main().catch(console.error);
