// Capa de datos que usa Sanity si está configurado, o datos mock como fallback.

import { isSanityConfigured, urlFor } from "@/sanity/client";
import {
  getProyectos as sanityGetProyectos,
  getProyectoBySlug as sanityGetProyectoBySlug,
  getProyectoSlugs,
  getProductos as sanityGetProductos,
  getProductoBySlug as sanityGetProductoBySlug,
  getProductoSlugs,
  type SanityProyecto,
  type SanityProducto,
} from "@/sanity/queries";
import {
  PROYECTOS as MOCK_PROYECTOS,
  getProyectoBySlug as mockGetProyectoBySlug,
  type Proyecto,
} from "@/lib/data/proyectos";
import {
  PRODUCTOS as MOCK_PRODUCTOS,
  getProductoBySlug as mockGetProductoBySlug,
  type Producto,
} from "@/lib/data/productos";

// ─── Adaptadores Sanity → tipos locales ──────────────

function adaptProyecto(p: SanityProyecto): Proyecto {
  return {
    slug: p.slug.current,
    title: p.title,
    category: p.category as Proyecto["category"],
    year: p.year,
    location: p.location || "",
    description: p.description || "",
    area: p.area || "",
    duration: p.duration || "",
    materials: p.materials || [],
    images: p.images?.map((img) => urlFor(img).width(1200).url()) || [],
    featured: p.featured || false,
  };
}

function adaptProducto(p: SanityProducto): Producto {
  return {
    slug: p.slug.current,
    name: p.name,
    category: p.category as Producto["category"],
    price: p.price,
    description: p.description || "",
    dimensions: p.dimensions || "",
    materials: p.materials || [],
    finishes: p.finishes || [],
    images: p.images?.map((img) => urlFor(img).width(1200).url()) || [],
    badge: (p.badge as Producto["badge"]) || undefined,
  };
}

// ─── API pública ─────────────────────────────────────

export async function getAllProyectos(): Promise<Proyecto[]> {
  if (!isSanityConfigured()) return MOCK_PROYECTOS;
  const data = await sanityGetProyectos();
  return data.length > 0 ? data.map(adaptProyecto) : MOCK_PROYECTOS;
}

export async function getProyecto(slug: string): Promise<Proyecto | undefined> {
  if (!isSanityConfigured()) return mockGetProyectoBySlug(slug);
  const data = await sanityGetProyectoBySlug(slug);
  return data ? adaptProyecto(data) : mockGetProyectoBySlug(slug);
}

export async function getAllProyectoSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return MOCK_PROYECTOS.map((p) => p.slug);
  const data = await getProyectoSlugs();
  const slugs = data.map((p) => p.slug.current);
  return slugs.length > 0 ? slugs : MOCK_PROYECTOS.map((p) => p.slug);
}

export async function getAllProductos(): Promise<Producto[]> {
  if (!isSanityConfigured()) return MOCK_PRODUCTOS;
  const data = await sanityGetProductos();
  return data.length > 0 ? data.map(adaptProducto) : MOCK_PRODUCTOS;
}

export async function getProducto(slug: string): Promise<Producto | undefined> {
  if (!isSanityConfigured()) return mockGetProductoBySlug(slug);
  const data = await sanityGetProductoBySlug(slug);
  return data ? adaptProducto(data) : mockGetProductoBySlug(slug);
}

export async function getAllProductoSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return MOCK_PRODUCTOS.map((p) => p.slug);
  const data = await getProductoSlugs();
  const slugs = data.map((p) => p.slug.current);
  return slugs.length > 0 ? slugs : MOCK_PRODUCTOS.map((p) => p.slug);
}
