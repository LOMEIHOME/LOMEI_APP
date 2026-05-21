# PROMPT INICIAL — Primera sesión en Claude Code

Copia y pega este texto completo al iniciar Claude Code en el proyecto.

---

## Prompt de arranque

```
Eres el desarrollador principal del sitio web de LOMEI HOME, un estudio de 
arquitectura e interiorismo en Querétaro, México, fundado por la Arq. Ana 
Lorena Vargas Mejía.

Lee el archivo CLAUDE.md en la raíz del proyecto. Contiene TODO el contexto 
del proyecto: identidad de marca, paleta de colores, tipografía, estructura 
de páginas, stack tecnológico y reglas de diseño. Ese archivo es tu biblia — 
cada decisión que tomes debe estar alineada con él.

El objetivo de esta sesión es hacer el setup inicial del proyecto:

1. Inicializar Next.js 14 con App Router y TypeScript
2. Configurar Tailwind CSS con la paleta de colores de LOMEI HOME
3. Instalar y configurar las fuentes: Cormorant Garamond + Jost (Google Fonts)
4. Crear los componentes base: Navbar y Footer
5. Crear el archivo globals.css con todas las variables CSS de la paleta
6. Crear la estructura de carpetas definida en CLAUDE.md §5

Antes de escribir cualquier código, confirma que leíste el CLAUDE.md y dime 
qué vas a hacer paso a paso.
```

---

## Comandos para ejecutar antes de la primera sesión

En tu terminal, dentro de la carpeta del repo:

```bash
# 1. Clonar el repo (si no lo has hecho)
git clone https://github.com/TU-USUARIO/lomei-home-app.git
cd lomei-home-app

# 2. Copiar el CLAUDE.md a la raíz del proyecto
# (arrastra el archivo descargado a la carpeta del proyecto)

# 3. Iniciar Claude Code
claude
```

---

## Prompts para sesiones siguientes

### Sesión 2 — Página de Inicio
```
Lee CLAUDE.md. Hoy vamos a construir la página de inicio completa (/).
Sigue exactamente la estructura definida en §3 "Página 1: Inicio".
Empieza por el componente Hero con la imagen de fondo, logo y frase principal.
Usa solo los colores de la paleta --color-cream, --color-dark, etc.
Las fuentes ya están configuradas: Cormorant Garamond para títulos, Jost para cuerpo.
```

### Sesión 3 — Página de Proyectos
```
Lee CLAUDE.md. Hoy construimos la página /proyectos y la vista de detalle /proyectos/[slug].
Por ahora usa datos mock (sin Sanity todavía) — crea un archivo /lib/data/proyectos.ts 
con 4-5 proyectos de ejemplo siguiendo la estructura definida en §3.
El grid debe ser asimétrico y elegante, con hover overlay suave.
```

### Sesión 4 — Catálogo
```
Lee CLAUDE.md. Hoy construimos /catalogo y /catalogo/[slug].
Categorías: Muebles, Cojines & Textiles, Adornos, Iluminación, Alfombras, Acabados.
Usa datos mock en /lib/data/productos.ts con 8-10 productos de ejemplo.
Incluye filtros por categoría funcionales (client component).
```

### Sesión 5 — Página Nosotros
```
Lee CLAUDE.md. Construye /nosotros.
Esta página debe incluir la sección del showroom con los renders 3D (usa las 
imágenes en /public/images/showroom/).
Incluye el proceso de trabajo en 5 pasos y la historia del estudio.
```

### Sesión 6 — Sanity CMS
```
Lee CLAUDE.md. Hoy conectamos Sanity CMS.
1. Crea el proyecto en sanity.io
2. Define los schemas: Proyecto y Producto
3. Reemplaza los datos mock por queries a Sanity
4. Configura las variables de entorno en .env.local
```

### Sesión 7 — Deploy
```
Lee CLAUDE.md. Preparamos el deploy en Vercel.
1. Revisar que no hay variables de entorno hardcodeadas
2. Configurar next.config.ts para optimización de imágenes con Cloudinary
3. Conectar repo a Vercel
4. Configurar variables de entorno en Vercel dashboard
5. Hacer deploy y revisar que todo funciona
```

---

## Notas importantes para Claude Code

- **El CLAUDE.md es la fuente de verdad** — si hay duda, el CLAUDE.md manda
- **Paleta fija**: solo usar las variables `--color-*` definidas, nunca colores ad hoc
- **Fuentes**: Cormorant Garamond (títulos) + Jost (cuerpo) — sin excepciones
- **Commits en español**: `feat:`, `fix:`, `style:`, `chore:` + descripción en español
- **Nunca `.env.local` en git** — verificar que está en `.gitignore`

---

*LOMEI HOME · Arquitectura e Interiorismo · Querétaro, México*
