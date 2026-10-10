-- =============================================
-- Mejoras POS: Venta por ml + Método de pago
-- =============================================

-- ─── Venta por mililitro ─────────────────────
-- Algunas fragancias se venden por ml, no por unidad

ALTER TABLE productos ADD COLUMN venta_por_ml BOOLEAN NOT NULL DEFAULT false;

-- Dropear vista que depende de inventario.cantidad
DROP VIEW IF EXISTS vista_stock_bajo;

-- Cambiar columnas de cantidad de INTEGER a NUMERIC(12,2)
-- para soportar cantidades decimales (mililitros)

ALTER TABLE orden_items ALTER COLUMN cantidad TYPE NUMERIC(12,2);
ALTER TABLE inventario ALTER COLUMN cantidad TYPE NUMERIC(12,2);
ALTER TABLE movimientos ALTER COLUMN cantidad TYPE NUMERIC(12,2);
ALTER TABLE movimientos ALTER COLUMN cantidad_antes TYPE NUMERIC(12,2);
ALTER TABLE movimientos ALTER COLUMN cantidad_despues TYPE NUMERIC(12,2);

-- Recrear vista con los nuevos tipos
CREATE VIEW vista_stock_bajo AS
SELECT
  p.id,
  p.nombre,
  p.slug,
  p.categoria,
  p.sku,
  i.cantidad,
  i.stock_minimo,
  i.ubicacion,
  i.cantidad <= i.stock_minimo AS alerta_activa
FROM productos p
JOIN inventario i ON i.producto_id = p.id
WHERE i.cantidad <= i.stock_minimo AND p.activo = TRUE;

-- ─── Método de pago ──────────────────────────
-- Registrar si la venta fue en efectivo o tarjeta

ALTER TABLE ordenes ADD COLUMN metodo_pago TEXT NOT NULL DEFAULT 'efectivo';
ALTER TABLE ordenes ADD COLUMN num_transaccion TEXT;
