-- ==============================================
-- LOMEI HOME — Fase 3: Schema de Base de Datos
-- Supabase PostgreSQL
-- ==============================================

-- Habilitar generación de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PERFILES ADMIN ──────────────────────────
-- Metadata extra para usuarios de Supabase Auth

CREATE TABLE perfiles_admin (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre     TEXT NOT NULL,
  rol        TEXT NOT NULL DEFAULT 'admin' CHECK (rol IN ('admin', 'asistente')),
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  editado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PRODUCTOS ───────────────────────────────
-- Catálogo operativo para gestión de inventario

CREATE TABLE productos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre          TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  categoria       TEXT NOT NULL,
  sku             TEXT UNIQUE,
  precio_costo    NUMERIC(12,2) NOT NULL DEFAULT 0,
  precio_venta    NUMERIC(12,2) NOT NULL DEFAULT 0,
  descripcion     TEXT,
  dimensiones     TEXT,
  materiales      TEXT[],
  acabados        TEXT[],
  imagen_url      TEXT,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  editado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_productos_slug ON productos(slug);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);

-- ─── INVENTARIO ──────────────────────────────
-- Stock por producto y ubicación

CREATE TABLE inventario (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id     UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad        INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
  ubicacion       TEXT NOT NULL DEFAULT 'Showroom',
  stock_minimo    INTEGER NOT NULL DEFAULT 2,
  editado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(producto_id, ubicacion)
);

CREATE INDEX idx_inventario_producto ON inventario(producto_id);

-- ─── MOVIMIENTOS DE INVENTARIO ───────────────
-- Log inmutable de cada cambio de stock

CREATE TYPE tipo_movimiento AS ENUM (
  'entrada',
  'salida',
  'ajuste',
  'devolucion'
);

CREATE TABLE movimientos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id      UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  tipo             tipo_movimiento NOT NULL,
  cantidad         INTEGER NOT NULL,
  cantidad_antes   INTEGER NOT NULL,
  cantidad_despues INTEGER NOT NULL,
  nota             TEXT,
  usuario_id       UUID REFERENCES auth.users(id),
  creado_en        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movimientos_producto ON movimientos(producto_id);
CREATE INDEX idx_movimientos_fecha ON movimientos(creado_en);

-- ─── ORDENES / VENTAS ────────────────────────

CREATE TYPE estado_orden AS ENUM (
  'pendiente',
  'completada',
  'cancelada'
);

CREATE TABLE ordenes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero          SERIAL,
  cliente_nombre  TEXT,
  cliente_email   TEXT,
  cliente_tel     TEXT,
  estado          estado_orden NOT NULL DEFAULT 'pendiente',
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
  descuento       NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,
  nota            TEXT,
  ticket_html     TEXT,
  cliente_id      UUID,
  usuario_id      UUID REFERENCES auth.users(id),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  editado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ordenes_fecha ON ordenes(creado_en);
CREATE INDEX idx_ordenes_estado ON ordenes(estado);

CREATE TABLE orden_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id        UUID NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id     UUID NOT NULL REFERENCES productos(id),
  cantidad        INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL,
  subtotal        NUMERIC(12,2) NOT NULL
);

CREATE INDEX idx_orden_items_orden ON orden_items(orden_id);

-- ─── CONFIGURACIÓN DE ALERTAS ────────────────

CREATE TABLE alertas_config (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notificar_email     BOOLEAN NOT NULL DEFAULT TRUE,
  notificar_whatsapp  BOOLEAN NOT NULL DEFAULT FALSE,
  email_destino       TEXT,
  telefono_destino    TEXT,
  frecuencia_horas    INTEGER NOT NULL DEFAULT 24,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  editado_en          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alertas_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id     UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  cantidad_actual INTEGER NOT NULL,
  stock_minimo    INTEGER NOT NULL,
  canal           TEXT NOT NULL,
  enviado         BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ──────────────────────

ALTER TABLE perfiles_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orden_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_log ENABLE ROW LEVEL SECURITY;

-- Políticas: solo usuarios autenticados (admins)
CREATE POLICY "admin_all" ON perfiles_admin FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all" ON productos FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all" ON inventario FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all" ON movimientos FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all" ON ordenes FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all" ON orden_items FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all" ON alertas_config FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all" ON alertas_log FOR ALL USING (auth.uid() IS NOT NULL);

-- ─── VISTAS ÚTILES ───────────────────────────

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

CREATE VIEW vista_ventas_resumen AS
SELECT
  DATE_TRUNC('day', o.creado_en)::DATE AS fecha,
  COUNT(o.id)::INTEGER AS num_ordenes,
  SUM(o.total) AS total_ventas
FROM ordenes o
WHERE o.estado = 'completada'
GROUP BY DATE_TRUNC('day', o.creado_en)
ORDER BY fecha DESC;

-- ─── FUNCIÓN: Actualizar editado_en ──────────

CREATE OR REPLACE FUNCTION actualizar_editado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.editado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_productos_editado
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION actualizar_editado_en();

CREATE TRIGGER tr_inventario_editado
  BEFORE UPDATE ON inventario
  FOR EACH ROW EXECUTE FUNCTION actualizar_editado_en();

CREATE TRIGGER tr_ordenes_editado
  BEFORE UPDATE ON ordenes
  FOR EACH ROW EXECUTE FUNCTION actualizar_editado_en();

CREATE TRIGGER tr_perfiles_editado
  BEFORE UPDATE ON perfiles_admin
  FOR EACH ROW EXECUTE FUNCTION actualizar_editado_en();

CREATE TRIGGER tr_alertas_config_editado
  BEFORE UPDATE ON alertas_config
  FOR EACH ROW EXECUTE FUNCTION actualizar_editado_en();

-- ─── CLIENTES (Punto de Venta) ─────────────────

CREATE TYPE tipo_cliente AS ENUM (
  'menudeo',
  'mayorista',
  'disenador',
  'arquitecto',
  'otro'
);

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

CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_tipo ON clientes(tipo);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON clientes FOR ALL USING (auth.uid() IS NOT NULL);

CREATE TRIGGER tr_clientes_editado
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION actualizar_editado_en();

-- FK en ordenes para vincular cliente
ALTER TABLE ordenes ADD COLUMN cliente_id UUID REFERENCES clientes(id);
CREATE INDEX idx_ordenes_cliente ON ordenes(cliente_id);
