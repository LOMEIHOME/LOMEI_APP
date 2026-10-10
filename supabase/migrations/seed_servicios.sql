-- =============================================
-- Seed: 8 servicios de LOMEI HOME
-- Precio placeholder $1 — el precio real se define en el POS
-- Sin registro de inventario (categoria = 'Servicios')
-- =============================================

INSERT INTO productos (nombre, slug, categoria, sku, precio_venta, precio_costo, descripcion, venta_por_ml, activo)
VALUES
  ('Interiorismo',           'servicio-interiorismo',         'Servicios', 'SVC-001', 1, 0, 'Diseño integral de interiores — materiales, mobiliario, iluminación, colores y acabados.',          false, true),
  ('Asesoría',               'servicio-asesoria',             'Servicios', 'SVC-002', 1, 0, 'Acompañamiento profesional para resolver dudas y definir ideas. Video llamada o en sitio.',        false, true),
  ('Custom Design',          'servicio-custom-design',        'Servicios', 'SVC-003', 1, 0, 'Diseño de piezas únicas de mobiliario personalizado.',                                             false, true),
  ('Styling',                'servicio-styling',              'Servicios', 'SVC-004', 1, 0, 'Selección de mobiliario, decoración, textiles, iluminación y accesorios para tu espacio.',          false, true),
  ('Proyecto Obra',          'servicio-proyecto-obra',        'Servicios', 'SVC-005', 1, 0, 'Coordinación y supervisión de obra — calidad, tiempos y presupuesto.',                             false, true),
  ('Fabricación de Muebles', 'servicio-fabricacion',          'Servicios', 'SVC-006', 1, 0, 'Mobiliario personalizado fabricado con materiales seleccionados.',                                  false, true),
  ('Ejecutivo',              'servicio-ejecutivo',            'Servicios', 'SVC-007', 1, 0, 'Planos, detalles técnicos y documentación para ejecutar el proyecto.',                              false, true),
  ('Paisajismo',             'servicio-paisajismo',           'Servicios', 'SVC-008', 1, 0, 'Diseño de espacios exteriores — en colaboración con Naturhabitat.',                                 false, true)
ON CONFLICT (slug) DO NOTHING;
