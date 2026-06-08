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
| Instagram | @lvinteriorismo |
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
- Filtros: Todos / Residencial / Comercial / Interiorismo

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

### Página 5: Servicios (/servicios) — Fase 1 (pendiente)

- Diseño residencial
- Diseño comercial
- Proyecto ejecutivo
- Consultoría y asesoría
- Cada uno con descripción, proceso y galería propia

---

### Página 6: Contacto (/contacto) — Fase 1 (pendiente)

- Formulario: nombre, email, teléfono, tipo de proyecto, mensaje
- Botón de agendar cita
- Datos de contacto
- Instagram embed o feed

---

## 4. Stack tecnológico

### Repos en GitHub
- **forma-espacio-app** (frontend) — renombrar a `lomei-home-app`
- **forma-espacio-api** (backend) — renombrar a `lomei-home-api`

### Frontend
```
Framework:    Next.js 14 (App Router)
Estilos:      Tailwind CSS + CSS Variables para la paleta
Tipografía:   Google Fonts — Cormorant Garamond + Montserrat
Imágenes:     Next/Image con Cloudinary para optimización
Animaciones:  Framer Motion (sutiles, nunca llamativas)
CMS:          Sanity.io (gestión de proyectos y productos)
Deploy:       Vercel
```

### Backend (Fase 3 — Operaciones / Fase 2 — Tienda)
```
Runtime:      Node.js con Express
Base de datos: PostgreSQL vía Supabase
Auth:         Clerk (Fase 2)
Pagos:        Stripe (Fase 2)
Emails:       Resend (Fase 2)
Deploy:       Railway
```

### Variables de entorno necesarias
```bash
# .env.local (frontend)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_SITE_URL=https://lomeihome.mx

# Fase 3 (Operaciones) + Fase 2 (Tienda)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 5. Estructura de carpetas del proyecto

```
lomei-home-app/
├── app/
│   ├── layout.tsx              ← Layout global (Nav + Footer)
│   ├── page.tsx                ← Página de inicio
│   ├── globals.css             ← Variables CSS + estilos globales
│   ├── proyectos/
│   │   ├── page.tsx            ← Lista de proyectos
│   │   └── [slug]/
│   │       └── page.tsx        ← Detalle de proyecto
│   ├── catalogo/
│   │   ├── page.tsx            ← Catálogo de productos
│   │   └── [slug]/
│   │       └── page.tsx        ← Detalle de producto
│   ├── nosotros/
│   │   └── page.tsx            ← Página nosotros
│   ├── servicios/
│   │   └── page.tsx            ← PENDIENTE (esqueleto)
│   └── contacto/
│       └── page.tsx            ← PENDIENTE (esqueleto)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          ← Logo real (dark/white según scroll)
│   │   └── Footer.tsx          ← Logo blanco real
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── FadeIn.tsx
│   │   └── SectionTag.tsx
│   └── sections/
│       ├── Hero.tsx            ← Logo + render Paseo de Claustros
│       ├── AboutPreview.tsx
│       ├── ServicesStrip.tsx
│       ├── ProjectsGrid.tsx
│       └── CatalogPreview.tsx
├── lib/
│   ├── sanity.ts               ← Cliente de Sanity
│   └── data/
│       ├── proyectos.ts        ← 16 proyectos reales
│       └── productos.ts        ← 10 productos (imágenes pendientes de actualizar)
├── public/
│   └── images/
│       ├── logos/              ← Logos oficiales LOMEI
│       │   ├── logo-dark.png   ← Logo completo fondo claro
│       │   ├── logo-white.png  ← Logo completo fondo oscuro
│       │   ├── icon-dark.png   ← Monograma "L" oscuro
│       │   ├── icon-white.png  ← Monograma "L" blanco
│       │   └── logo-redes.png  ← Logo para redes sociales
│       ├── proyectos/          ← 16 carpetas con renders reales
│       │   ├── paseo-de-claustros/   (10 renders)
│       │   ├── sophia-distrito/      (5 renders)
│       │   ├── atria-distrito/       (10 renders)
│       │   ├── oficina-ave-fenix/    (6 renders)
│       │   ├── cocina-alturia-zibata/ (5 renders)
│       │   ├── ceja-de-bravo/        (5 renders)
│       │   ├── puerta-coyoacan/      (4 renders)
│       │   ├── roof-mirador-campanario/ (4 renders)
│       │   ├── terraza-campo-real/   (5 renders)
│       │   ├── recamara-bebe-villas/ (4 renders)
│       │   ├── canadas-del-lago/     (3 renders)
│       │   ├── valle-de-las-flores/  (5 renders)
│       │   ├── casa-gema/            (2 renders)
│       │   ├── teresitas/            (2 renders)
│       │   ├── vestidor-pachuquilla/ (3 renders)
│       │   └── san-juan-del-rio/     (3 renders)
│       └── showroom/           ← Imágenes originales del showroom (legacy)
├── CLAUDE.md                   ← Este archivo
├── next.config.ts
└── package.json
```

---

## 6. Convenciones de código

- **Componentes**: PascalCase, un componente por archivo
- **Hooks**: camelCase con prefijo `use`
- **Constantes globales**: UPPER_SNAKE_CASE en `/lib/constants.ts`
- **Clases Tailwind**: en el archivo, nunca inline styles salvo CSS variables
- **Imágenes**: siempre con `next/image`, nunca `<img>` directo
- **Textos en español**: todo el contenido visible al usuario en español
- **Comentarios**: en español
- **No usar `any` en TypeScript** — tipar siempre correctamente

---

## 7. Fases del proyecto

### Fase 1 — Vitrina (activa — entrega 30 junio 2026)
Objetivo: sitio público funcional con identidad de LOMEI HOME

- [x] Setup inicial Next.js 16 + Tailwind CSS 4 + fuentes
- [x] Componentes base: Navbar, Footer, Button, Badge, SectionTag, FadeIn
- [x] Página de Inicio completa (Hero, About, Services, Projects, Catalog)
- [x] Página de Proyectos (grid con filtros + 16 proyectos reales)
- [x] Página de Catálogo (grid con filtros + detalle)
- [x] Página Nosotros completa
- [x] Integración con Sanity CMS (schemas + queries + studio)
- [x] Logo oficial integrado (Navbar, Footer, Hero)
- [x] 16 proyectos reales con ~80 renders en /images/proyectos/
- [ ] **Página de Servicios** (esqueleto → completa, fecha: 9 junio)
- [ ] **Página de Contacto** (esqueleto → formulario funcional, fecha: 9 junio)
- [ ] Actualizar imágenes de productos (`lib/data/productos.ts` usa paths viejos)
- [ ] Actualizar imágenes en Nosotros (`app/nosotros/page.tsx` tiene 4 paths viejos)
- [ ] Carga de contenido real en Sanity CMS
- [ ] Deploy en Vercel + dominio lomeihome.mx

### Fase 3 — Operaciones (entrega 15 julio 2026, con 2do desarrollador)
- [ ] Base de datos (Supabase PostgreSQL)
- [ ] Panel de control de inventario
- [ ] Dashboard de reportes de ventas
- [ ] Sistema de alertas de stock bajo

### Fase 2 — Tienda en línea (posterior, $7,500 MXN)
- [ ] Carrito de compras
- [ ] Checkout con Stripe
- [ ] Cuentas de clientes (Clerk)
- [ ] Notificaciones por correo (Resend)

---

## 8. Cotización (26 mayo 2026)

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

## 9. Reglas que Claude NUNCA debe romper en este proyecto

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

*Última actualización: 27 mayo 2026 — Luis Fonseca / LOMEI HOME*
