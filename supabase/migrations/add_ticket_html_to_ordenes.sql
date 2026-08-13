-- Agregar columna ticket_html a ordenes para persistir el ticket de venta
ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS ticket_html TEXT;
