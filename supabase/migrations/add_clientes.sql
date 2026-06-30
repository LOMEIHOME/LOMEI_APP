-- Migración: Tabla de clientes para Punto de Venta
-- Ejecutar en Supabase Dashboard > SQL Editor

-- Tipo de cliente
CREATE TYPE tipo_cliente AS ENUM (
  'menudeo',
  'mayorista',
  'disenador',
  'arquitecto',
  'otro'
);

-- Tabla de clientes
CREATE TABLE clientes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre     TEXT NOT NULL,
  email      TEXT UNIQUE,
  telefono   TEXT,
  tipo       tipo_cliente NOT NULL DEFAULT 'menudeo',
  notas      TEXT,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  editado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_tipo ON clientes(tipo);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);

-- RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON clientes FOR ALL USING (auth.uid() IS NOT NULL);

-- Trigger editado_en
CREATE TRIGGER tr_clientes_editado
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION actualizar_editado_en();

-- FK en ordenes para vincular cliente
ALTER TABLE ordenes ADD COLUMN cliente_id UUID REFERENCES clientes(id);
CREATE INDEX idx_ordenes_cliente ON ordenes(cliente_id);
