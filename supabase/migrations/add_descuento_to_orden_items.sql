-- Agrega columna de descuento porcentual por artículo en orden_items
ALTER TABLE orden_items
ADD COLUMN descuento NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (descuento >= 0 AND descuento <= 100);
