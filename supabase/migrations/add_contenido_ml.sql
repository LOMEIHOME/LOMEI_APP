-- Agregar contenido_ml a productos
-- Indica el contenido total en ml del producto (ej: 500 para un frasco de 500ml)
-- Se usa para calcular el precio por ml: precio_venta / contenido_ml

ALTER TABLE productos
ADD COLUMN contenido_ml NUMERIC(12,2) DEFAULT NULL;
