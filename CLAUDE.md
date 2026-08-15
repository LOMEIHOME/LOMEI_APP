# LOMEI HOME — Contexto del Proyecto

Este archivo es el **contexto maestro** del proyecto. Claude debe leerlo al inicio de cada sesión y basar todas las decisiones de diseño, código y contenido en él.

---

## 1. Identidad de la marca

| Campo | Valor |
|---|---|
| Nombre comercial | **LOMEI HOME** |
| Subtítulo | Arquitectura e Interiorismo |
| Razón social | LV Arquitectura e Interiorismo |
| Fundadora | Arq. Ana Lorena Vargas Mejía |
| Año de fundación | 2023 |
| Ubicación | Querétaro, México |
| Instagram | @lomeihome |
| Email | arqinteriorismolv@gmail.com |
| Teléfono | 771 100 90 84 |

**Filosofía del estudio:**
> "Un espacio no solo se construye: se diseña para vivirse."

**Misión:** Diseñar y desarrollar proyectos residenciales y comerciales de manera integral, desde la arquitectura hasta el interior que se habita. Crear propuestas donde la arquitectura y el interiorismo dialogan desde el origen del proyecto, generando espacios que reflejen la personalidad, estilo de vida y aspiraciones de cada cliente.

---

## 2. Identidad visual — seguir estrictamente

### Paleta de colores

```css
/* Usar estos valores en TODO el proyecto */
--color-cream:     #F5F0E8;   /* fondo principal — crema cálido */
--color-linen:     #EDE6D6;   /* fondo secundario — lino */
--color-sand:      #D4C4A0;   /* bordes y separadores */
--color-warm-gray: #B5A898;   /* texto secundario / muted */
--color-oak:       #A0845C;   /* acento cálido — madera de encino */
--color-camel:     #8B6340;   /* acento fuerte — camel/terracota */
--color-dark:      #2A2118;   /* texto principal — casi negro cálido */
--color-white:     #FAFAF7;   /* blanco ligeramente cálido */
```

### Tipografía

```css
/* Títulos y display — serif elegante */
font-family: 'Cormorant Garamond', serif;
font-weight: 300 o 400 (nunca bold en títulos grandes);
letter-spacing: 0.05em a 0.15em según tamaño;

/* Cuerpo y UI — sans-serif geométrica */
font-family: 'Montserrat', sans-serif;
font-weight: 300 (cuerpo) / 400 (UI) / 500 (énfasis);
letter-spacing: 0.08em a 0.2em en textos pequeños uppercase;

/* Nunca usar: Inter, Roboto, Jost, Arial, system-ui */
```

### Estilo visual — reglas de diseño

- **Lujo silencioso y minimalista**: menos es más, el espacio en blanco es parte del diseño
- **Fondo con textura sutil**: usar un leve ruido/grain en el background (como papel)
- **Sin colores saturados**: toda la paleta es neutra y cálida
- **Fotografía e imágenes como protagonistas**: texto escaso, imagen grande
- **Animaciones sutiles**: fade-in suave, transiciones lentas (0.4s–0.6s ease)
- **Sin sombras duras**: usar sombras muy sutiles o ninguna
- **Bordes delgados**: máximo 1px, preferir 0.5px
- **Grid asimétrico**: evitar layouts 100% simétricos — usar proporciones áureas
- **Hover elegante**: en imágenes, un overlay suave con info, no zoom brusco

### Logo
- Monograma geométrico con la "L" estructural
- Nombre "LOMEI HOME" en sans-serif espaciada
- Subtítulo "ARQUITECTURA E INTERIORISMO" en caps muy pequeño
- Usar **siempre en oscuro** sobre fondo claro, o **en blanco** sobre imágenes
- No distorsionar ni cambiar proporciones

---

## 3. Estructura del sitio web

El sitio tiene **6 páginas principales**. En la Fase 1 se construyen las primeras 4.

### Navegación principal
```
LOMEI HOME
├── Inicio
├── Proyectos
├── Catálogo
├── Nosotros
├── Servicios
└── Contacto
```

---

### Página 1: Inicio (/)

**Hero — pantalla completa**
- Imagen de fondo: render 3D del showroom o proyecto destacado
- Logo centrado o esquina superior
- Frase: *"Espacios diseñados para vivirse"*
- CTA: "Ver proyectos" → link a /proyectos
- Scroll indicator animado (línea o punto que baja)

**Sección: Sobre el estudio**
- Layout 50/50: texto izquierda, imagen derecha
- Título: *"Diseño con alma propia"*
- Párrafo corto de la filosofía
- Stat row: 2+ años · proyectos realizados · Querétaro

**Sección: Servicios (preview)**
- 3 tarjetas horizontales sobre fondo oscuro (#2A2118)
- 01 Diseño de Interiores / 02 Arquitectura / 03 Mobiliario & Objetos
- Texto breve cada una

**Sección: Proyectos destacados**
- Grid asimétrico: 1 imagen grande izquierda + 2 pequeñas derecha
- Hover: overlay con nombre del proyecto y categoría
- CTA: "Ver todos los proyectos"

**Sección: Catálogo preview**
- 4 productos en grid 2x2 o fila horizontal
- Solo foto, nombre y precio
- CTA: "Explorar catálogo"

**Footer**
- Logo + tagline
- Links de navegación en columnas
- Instagram · Email · Teléfono
- © 2025 LOMEI HOME

---

### Página 2: Proyectos (/proyectos)

**Header de página**
- Fondo linen, título "Proyectos" en serif grande
- Filtros: Todos / Obra / Diseño

**Grid de proyectos**
- Cards con imagen a pantalla completa de la card
- Al hover: overlay con nombre, categoría y año
- Al hacer clic: abre la página de detalle del proyecto

**Detalle de proyecto (/proyectos/[slug])**
- Imagen hero a ancho completo
- Título, categoría, año, ubicación
- Galería en grid: mezcla de paisaje y retrato
- Texto de descripción del proyecto
- Ficha técnica: área, materiales principales, duración
- Flechas para navegar al proyecto anterior/siguiente

---

### Página 3: Catálogo (/catalogo)

**Header**
- Título "Colección" en serif + subtítulo
- Filtros por categoría: Muebles / Cojines & Textiles / Adornos / Iluminación / Alfombras / Acabados

**Grid de productos**
- 3 columnas en desktop, 2 en tablet, 1 en móvil
- Card: foto + categoría (uppercase pequeño) + nombre + precio
- Badge "Nuevo" o "Disponible" cuando aplique
- Hover: botón "+" para agregar (Fase 2 — Tienda) o "Ver detalle"

**Detalle de producto (/catalogo/[slug])**
- Galería de fotos (principal + miniaturas)
- Nombre, categoría, precio
- Descripción: materiales, dimensiones, acabados disponibles
- Botón "Solicitar información" → abre WhatsApp o modal de contacto
- Productos relacionados al final

---

### Página 4: Nosotros (/nosotros)

**Hero**
- Foto de la arquitecta o del showroom
- Nombre y título

**Historia del estudio**
- Timeline o sección narrativa
- Foto del proceso (mood board, planos, renders del showroom)

**El showroom**
- Renders 3D del proyecto de adecuación
- Descripción de los espacios: mesa de trabajo, mueble repisero, coffee station, set recibidor
- Materiales: encino natural, Silestone, nanocal, porcelánico tipo concreto

**Proceso de trabajo**
- Pasos: 01 Brief / 02 Concepto / 03 Desarrollo / 04 Ejecución / 05 Entrega

---

### Página 5: Servicios (/servicios)

- Diseño residencial
- Diseño comercial
- Proyecto ejecutivo
- Consultoría y asesoría
- Cada uno con descripción, proceso y galería propia

---

### Página 6: Contacto (/contacto)

- Formulario: nombre, email, teléfono, tipo de proyecto, mensaje
- Botón de agendar cita
- Datos de contacto
- Instagram embed o feed

---

## 4. Stack tecnológico

### Repo en GitHub
- **LOMEIHOME/LOMEI_APP** — monorepo (frontend + API routes + admin)

### Frontend + Backend (monorepo Next.js)
```
Framework:    Next.js 16 (App Router, Turbopack)
Estilos:      Tailwind CSS 4 + CSS Variables para la paleta
Tipografía:   Google Fonts — Cormorant Garamond + Montserrat
Imágenes:     Next/Image + Sanity CDN (urlFor)
Animaciones:  Framer Motion (sutiles, nunca llamativas)
CMS:          Sanity.io (proyectos y productos del sitio público)
Base de datos: Supabase PostgreSQL (inventario, órdenes, clientes, alertas)
Auth:         Supabase Auth (admin panel)
Emails:       Nodemailer (tickets de venta)
Deploy:       Vercel
```

### Variables de entorno necesarias
```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=              # Lectura desde Sanity
SANITY_WRITE_TOKEN=            # Escritura a Sanity (solo para seeds)

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # anon key (formato sb_publishable_)
SUPABASE_SERVICE_ROLE_KEY=              # service role (formato sb_secret_)

NEXT_PUBLIC_SITE_URL=https://lomeihome.com

SMTP_HOST=                     # Para envío de tickets
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

## 5. Estructura de carpetas del proyecto

```
LOMEI_APP/
├── app/
│   ├── layout.tsx              ← Layout global
│   ├── page.tsx                ← Página de inicio (Sanity: proyectos + productos)
│   ├── globals.css             ← Variables CSS + estilos globales
│   ├── proyectos/
│   │   ├── page.tsx            ← Lista de proyectos (Sanity)
│   │   ├── ProyectosFilterGrid.tsx ← Grid 2 cols con filtros
│   │   └── [slug]/page.tsx     ← Detalle de proyecto (Sanity)
│   ├── catalogo/
│   │   ├── page.tsx            ← Catálogo de productos (Sanity)
│   │   ├── CatalogoFilterGrid.tsx ← Grid con buscador inteligente
│   │   └── [slug]/page.tsx     ← Detalle de producto (Sanity)
│   ├── nosotros/page.tsx       ← Página nosotros
│   ├── servicios/page.tsx      ← Página servicios
│   ├── contacto/page.tsx       ← Página contacto con formulario
│   ├── admin/
│   │   ├── layout.tsx          ← AdminShell (sidebar + header)
│   │   ├── login/page.tsx      ← Login con monograma
│   │   ├── page.tsx            ← Dashboard KPIs + top vendidos (Supabase)
│   │   ├── pos/page.tsx        ← Punto de Venta (Supabase)
│   │   ├── inventario/         ← CRUD productos (Supabase)
│   │   ├── ordenes/            ← Lista + detalle órdenes (Supabase)
│   │   ├── ventas/page.tsx     ← Resumen de ventas (Supabase)
│   │   └── alertas/page.tsx    ← Alertas de stock (Supabase)
│   └── api/
│       ├── dashboard/kpis/     ← KPIs del dashboard
│       ├── dashboard/top-productos/ ← Top 5 más vendidos
│       ├── inventario/         ← CRUD inventario
│       ├── productos/          ← CRUD productos
│       ├── ordenes/            ← CRUD órdenes
│       ├── clientes/           ← CRUD clientes
│       ├── pos/productos/      ← Búsqueda ligera para POS
│       ├── ventas/resumen/     ← Datos de ventas
│       ├── alertas/            ← Config + log de alertas
│       └── contacto/           ← Formulario de contacto
├── components/
│   ├── layout/                 ← Navbar, Footer
│   ├── ui/                     ← Button, Badge, FilterTabs, ProductGallery, etc.
│   ├── sections/               ← Hero, AboutPreview, ServicesStrip, ProjectsGrid, etc.
│   └── admin/                  ← AdminSidebar, AdminHeader, ProductForm, etc.
├── lib/
│   ├── sanity.ts               ← Wrapper Sanity con fallback a mock data
│   ├── supabase/admin.ts       ← Cliente Supabase para API routes
│   ├── ticket.ts               ← Generación de notas de venta
│   ├── email.ts                ← Envío de emails (nodemailer)
│   └── data/                   ← Datos mock (fallback si Sanity no responde)
├── sanity/
│   ├── client.ts               ← Cliente Sanity + urlFor
│   ├── queries.ts              ← GROQ queries
│   └── schemas/                ← Schemas: proyecto, producto
├── supabase/
│   ├── schema.sql              ← Schema completo (productos, inventario, ordenes, clientes, alertas)
│   └── migrations/             ← Migraciones SQL
├── scripts/
│   ├── seed-supabase.mjs       ← Seed de productos en Supabase
│   ├── seed-velas.mjs          ← Seed de 44 velas Yolt en Sanity + Supabase
│   ├── seed-aromas.mjs         ← Seed de 27 aromas Mandaland en Sanity + Supabase
│   ├── seed-proyectos-sanity.mjs ← Seed de 16 proyectos en Sanity
│   ├── update-cojines-stock.mjs ← Actualización masiva de stock de cojines
│   ├── backup-db.mjs           ← Respaldo de BD a JSON (productos, inventario, clientes)
│   └── restore-db.mjs         ← Restaurar BD desde respaldo JSON
├── public/images/              ← Logos, proyectos (16 carpetas), showroom
├── CLAUDE.md                   ← Este archivo
└── package.json
```

---

## 6. Estilo visual del Admin Panel — "Notion Style"

El panel de administración (`/admin/*`) sigue un estilo visual inspirado en Notion, **completamente separado** del estilo público del sitio (que usa la paleta LOMEI de §2).

### Paleta del admin

```css
--admin-bg:         #fff;        /* fondo principal */
--admin-sidebar-bg: #f8f7f4;     /* sidebar y fondos secundarios */
--admin-text:       #37352f;     /* texto principal */
--admin-text-muted: #9b968c;     /* texto secundario */
--admin-text-mid:   #6b6760;     /* texto intermedio */
--admin-border:     #eeece7;     /* bordes de cards y tablas */
--admin-border-light: #f1efe9;   /* separadores de filas */
--admin-hover:      #faf9f6;     /* hover en filas */
--admin-accent:     #37352f;     /* botones primarios, chips activos */
```

### Tipografía del admin

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
/* NO usar Cormorant Garamond ni Montserrat en el admin */
```

### Reglas de diseño del admin

- **Cards**: `border: 1px solid #eeece7`, `border-radius: 12px`, padding 20-28px
- **Tablas**: header con `background: #f8f7f4`, columnas en 11px uppercase `#9b968c`
- **Chips/filtros**: activo = `bg #37352f` texto blanco, inactivo = `bg #fff` borde `#e6e3db`
- **Status pills**: `border-radius: 999px`, colores semánticos:
  - En stock: `bg #eaf3ec` / `color #16794a`
  - Bajo: `bg #fbf3e0` / `color #b7791f`
  - Crítico: `bg #fdf3ec` / `color #c2410c`
  - Agotado: `bg #f1efe9` / `color #8a857c`
- **Inputs**: `border: 1px solid #e6e3db`, `border-radius: 8px`, padding 9-11px
- **Botones primarios**: `bg #37352f`, `color #fff`, `border-radius: 8px`
- **Encabezados de sección**: 11px uppercase, `letter-spacing: 0.12em`, `color #b3ada1`, `font-weight: 600`
- **Emojis como iconos**: cada sección/categoría usa emojis (📊📦💰🧾🔔)
- **Sidebar**: fondo `#f8f7f4`, monograma "L" oscuro, navegación con emojis
- **Inline styles**: el admin usa estilos inline (no Tailwind) para independencia del sitio público
- **Sin sombras**: bordes sutiles en lugar de box-shadow

### Categorías y emojis

| Categoría | Emoji |
|---|---|
| Muebles | 🛋️ |
| Cojines & Textiles | 🧶 |
| Adornos | 🏺 |
| Jarrones | 🏺 |
| Iluminación | 💡 |
| Alfombras | 🧵 |
| Acabados | 🪞 |
| Capelos | 🔔 |
| Relojes | ⏳ |
| Florero | 🌸 |
| Macetas | 🪴 |
| Plantas Artificiales | 🌿 |
| Velas | 🕯️ |
| Aromas | 🌿 |

### Páginas del admin

```
/admin/login          ← Login centrado con monograma "L"
/admin                ← Dashboard con KPIs emoji + top 5 vendidos + alertas reposición
/admin/pos            ← Punto de Venta (POS) — buscar productos, carrito, datos cliente, checkout
/admin/inventario     ← Lista con búsqueda, chips de categoría, tabla
/admin/inventario/[id]       ← Detalle de producto + ajuste de stock + historial
/admin/inventario/[id]/editar ← Formulario de edición (ProductForm)
/admin/inventario/nuevo       ← Formulario de creación (ProductForm)
/admin/inventario/movimientos ← Historial global de movimientos
/admin/ordenes        ← Lista de órdenes con filtros de estado
/admin/ordenes/[id]   ← Detalle de orden + cambio de estado
/admin/ventas         ← Resumen de ventas con gráfica y KPIs
/admin/alertas        ← Alertas de stock bajo + configuración
```

---

## 7. Convenciones de código

- **Componentes**: PascalCase, un componente por archivo
- **Hooks**: camelCase con prefijo `use`
- **Constantes globales**: UPPER_SNAKE_CASE en `/lib/constants.ts`
- **Clases Tailwind**: en el archivo, nunca inline styles salvo CSS variables
- **Imágenes**: siempre con `next/image`, nunca `<img>` directo
- **Textos en español**: todo el contenido visible al usuario en español
- **Comentarios**: en español
- **No usar `any` en TypeScript** — tipar siempre correctamente

---

## 8. Fases del proyecto

### Fase 1 — Vitrina (completada)
Objetivo: sitio público funcional con identidad de LOMEI HOME

- [x] Setup inicial Next.js 16 + Tailwind CSS 4 + fuentes
- [x] Componentes base: Navbar, Footer, Button, Badge, SectionTag, FadeIn
- [x] Página de Inicio completa (Hero, About, Services, Projects carousel, Catalog)
- [x] Página de Proyectos (grid 2 cols con filtros + 16 proyectos reales)
- [x] Página de Catálogo (grid con buscador inteligente + filtros + detalle)
- [x] Página Nosotros completa
- [x] Página de Servicios completa
- [x] Página de Contacto con formulario funcional
- [x] Integración con Sanity CMS (schemas + queries + studio)
- [x] Logo oficial integrado (Navbar, Footer, Hero)
- [x] 16 proyectos con ~80 imágenes en Sanity CDN
- [x] ~248 productos en Sanity CMS (decorativos, velas, aromas)
- [x] Deploy en Vercel + dominio lomeihome.com
- [x] Responsive design en todas las páginas (max-w-[85rem] estándar)

### Fase 3 — Operaciones (completada)
- [x] Base de datos Supabase PostgreSQL (productos, inventario, ordenes, clientes, alertas)
- [x] Panel admin completo estilo Notion (login, dashboard, inventario, ordenes, ventas, alertas)
- [x] Punto de Venta (POS) — búsqueda, carrito, registro cliente, checkout, ticket por email
- [x] Dashboard con KPIs, top 5 vendidos, alertas de reposición
- [x] Sistema de alertas de stock bajo con configuración
- [x] Seed de ~248 productos en Supabase (decorativos + 44 velas Yolt + 27 aromas Mandaland)
- [x] Tabla de clientes con tipos (menudeo, mayorista, diseñador, arquitecto)
- [x] POS: validación de stock en backend, modal de confirmación, email opcional, vaciar carrito
- [x] POS: validación de precios contra BD (anti-manipulación), HTML escapado en tickets
- [x] Inventario: columna "Valor" (precio × stock), colores de stock simplificados
- [x] Contacto: formulario funcional con envío de email
- [x] Nosotros: sección de colaboraciones (Yolt Candle Studio + Naturhabitat)
- [x] Scripts de respaldo y restauración de BD
- [x] IVA_RATE centralizado en lib/constants.ts
- [x] Badges de productos: "Nuevo", "Disponible", "Yolt", "Lomei & Yolt"

### Fase 2 — Tienda en línea (pendiente, $7,500 MXN)
- [ ] Carrito de compras
- [ ] Checkout con Stripe
- [ ] Cuentas de clientes (Clerk o Supabase Auth)
- [ ] Notificaciones por correo (Resend)

---

## 9. Cotización (26 mayo 2026)

| Concepto | Precio |
|---|---|
| Fase 1 — Sitio Vitrina | $9,000 MXN |
| Fase 3 — Operaciones | $5,400 MXN |
| Desarrollador extra | $1,500 MXN |
| **Total** | **$15,900 MXN** |
| Fotografía opcional (50 prod) | $3,500 ($70/foto) |
| Fotografía opcional (100 prod) | $5,000 ($50/foto) |

Pagos: 40% al aprobar · 30% al publicar Fase 1 · 30% al entregar Fase 3
Mantenimiento: Básico $400 · Recomendado $700 · Premium $1,000 (mensual, aparte)

---

## 10. Reglas que Claude NUNCA debe romper en este proyecto

1. **La paleta es fija** — no agregar colores fuera de los definidos en §2
2. **Tipografía solo Cormorant Garamond + Montserrat** — nunca Inter, Roboto, Jost ni system fonts
3. **Estilo minimalista elegante** — si algo se ve "genérico de AI", rediseñar
4. **El logo no se modifica** — solo se coloca, nunca se rediseña
5. **Textos en español** — todo el contenido al usuario en español
6. **Mobile-first** — diseñar primero para móvil, luego desktop
7. **No usar `<img>`** — siempre `next/image`
8. **No hardcodear contenido** — el texto de proyectos y productos viene de Sanity
9. **Commits descriptivos en español** — `feat: agrega hero de página de inicio`
10. **Nunca subir `.env.local` a GitHub**

---

*Última actualización: 15 agosto 2026 — Luis Fonseca / LOMEI HOME*
