-- Agrega campo JSONB para umbrales de stock por categoría
-- Formato: { "Jarrones": 5, "Muebles": 3, ... }
ALTER TABLE alertas_config
ADD COLUMN IF NOT EXISTS umbrales_categoria JSONB DEFAULT '{}'::JSONB;
