/**
 * Actualiza el stock de cojines en Supabase desde el Excel.
 * Solo modifica la cantidad en inventario, no toca precios ni nombres.
 *
 * Uso: node scripts/update-cojines-stock.mjs
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Faltan variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
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
  if (!res.ok) throw new Error(`Supabase ${method} ${path}: ${res.status} — ${text}`);
  return text ? JSON.parse(text) : null;
}

// Datos del Excel — SKU (ID Producto en minúsculas) y cantidad
const COJINES = [
  { sku: "ap22521pi", cantidad: 2 },
  { sku: "ap22539pi", cantidad: 2 },
  { sku: "ap22002pi", cantidad: 2 },
  { sku: "ap22689pi", cantidad: 2 },
  { sku: "ap22675pi", cantidad: 2 },
  { sku: "ap24675pe", cantidad: 1 },
  { sku: "ap23c0001", cantidad: 2 },
  { sku: "ap22394pi", cantidad: 2 },
  { sku: "ap23752pg", cantidad: 2 },
  { sku: "ap22736pi", cantidad: 2 },
  { sku: "ap23c0002", cantidad: 2 },
  { sku: "ap22c0003", cantidad: 2 },
  { sku: "ap23c0004", cantidad: 2 },
  { sku: "ap24521pe", cantidad: 1 },
  { sku: "ap24520pe", cantidad: 1 },
  { sku: "ap24696pe", cantidad: 2 },
  { sku: "ap22304pi", cantidad: 2 },
  { sku: "ap22311pi", cantidad: 2 },
  { sku: "ap23c0005", cantidad: 2 },
  { sku: "ap22597pi", cantidad: 2 },
  { sku: "ap24596pe", cantidad: 1 },
  { sku: "ap22673pi", cantidad: 2 },
  { sku: "ap23c0006", cantidad: 2 },
  { sku: "ap22817pi", cantidad: 2 },
  { sku: "ap22499pi", cantidad: 2 },
  { sku: "ap22526pi", cantidad: 2 },
  { sku: "ap23453pg", cantidad: 2 },
  { sku: "ap22827pi", cantidad: 2 },
  { sku: "ap23825pg", cantidad: 2 },
  { sku: "ap22831pi", cantidad: 2 },
  { sku: "ap23819pg", cantidad: 2 },
  { sku: "ap22671pi", cantidad: 2 },
  { sku: "ap22642pi", cantidad: 2 },
  { sku: "ap22619pi", cantidad: 2 },
  { sku: "ap22606pi", cantidad: 2 },
  { sku: "ap23c0007", cantidad: 2 },
  { sku: "ap22738pi", cantidad: 2 },
  { sku: "ap22721pi", cantidad: 2 },
  { sku: "ap22753pi", cantidad: 2 },
  { sku: "ap22308pi", cantidad: 2 },
  { sku: "ap22672pi", cantidad: 2 },
  { sku: "ap22653pi", cantidad: 2 },
];

async function main() {
  let actualizados = 0, noEncontrados = 0, errors = 0;

  for (const c of COJINES) {
    try {
      // Buscar producto por SKU
      const productos = await supabaseRequest(
        `productos?sku=eq.${c.sku}&select=id,nombre,sku`,
        "GET"
      );

      if (!productos || productos.length === 0) {
        console.log(`⚠ No encontrado: ${c.sku}`);
        noEncontrados++;
        continue;
      }

      const producto = productos[0];

      // Actualizar inventario
      const result = await supabaseRequest(
        `inventario?producto_id=eq.${producto.id}`,
        "PATCH",
        { cantidad: c.cantidad }
      );

      if (result && result.length > 0) {
        console.log(`✓ ${producto.nombre} — stock: ${c.cantidad}`);
        actualizados++;
      } else {
        console.log(`⚠ Sin inventario: ${producto.nombre} (${c.sku})`);
        noEncontrados++;
      }
    } catch (err) {
      console.log(`✗ Error ${c.sku}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n— Resumen —`);
  console.log(`Actualizados:    ${actualizados}`);
  console.log(`No encontrados:  ${noEncontrados}`);
  console.log(`Errores:         ${errors}`);
}

main().catch(console.error);
