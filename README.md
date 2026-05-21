# LOMEI App

Frontend del proyecto **LOMEI** (Forma & Espacio) — sitio web y tienda en línea para estudio de interiorismo.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4

## Requisitos

- Node.js 18+
- npm 9+

## Inicio rápido

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd LOMEI_APP

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Edita .env.local con tus claves

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

```
LOMEI_APP/
├── app/
│   ├── page.tsx              ← Página de inicio
│   ├── layout.tsx            ← Layout principal
│   ├── catalogo/
│   │   └── page.tsx          ← Catálogo de productos
│   ├── proyectos/
│   │   └── page.tsx          ← Portafolio de trabajos
│   ├── servicios/
│   │   └── page.tsx          ← Servicios del estudio
│   └── tienda/
│       ├── page.tsx          ← Tienda en línea
│       └── carrito/
│           └── page.tsx      ← Carrito de compras
├── components/
│   ├── ui/                   ← Botones, cards, inputs reutilizables
│   ├── layout/               ← Navbar, Footer
│   └── sections/             ← Hero, Galería, etc.
├── lib/
│   ├── db.ts                 ← Conexión a Supabase / PostgreSQL
│   ├── stripe.ts             ← Configuración de Stripe
│   └── utils.ts              ← Funciones utilitarias
├── public/
│   ├── images/               ← Imágenes estáticas
│   └── fonts/                ← Tipografías locales
└── styles/
    └── globals.css           ← Estilos globales + Tailwind
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (localhost:3000) |
| `npm run build` | Build de producción |
| `npm start` | Servidor de producción |
| `npm run lint` | Ejecutar ESLint |

## Variables de entorno

Copia `.env.local.example` a `.env.local` y completa los valores:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto en Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |
| `NEXT_PUBLIC_API_URL` | URL del backend (default: `http://localhost:3001`) |

## Deploy

El frontend se despliega en [Vercel](https://vercel.com/). Conecta el repositorio de GitHub y Vercel detectará automáticamente la configuración de Next.js.
