import { getClient } from "./client";

// ─── Proyectos ───────────────────────────────────────

export interface SanityProyecto {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  year: string;
  location: string;
  description: string;
  area: string;
  duration: string;
  materials: string[];
  images: SanityImage[];
  featured: boolean;
}

export interface SanityImage {
  _key: string;
  asset: { _ref: string };
  alt?: string;
}

export async function getProyectos(): Promise<SanityProyecto[]> {
  return getClient().fetch(
    `*[_type == "proyecto"] | order(year desc) {
      _id, title, slug, category, year, location,
      description, area, duration, materials,
      images, featured
    }`
  );
}

export async function getProyectoBySlug(
  slug: string
): Promise<SanityProyecto | null> {
  return getClient().fetch(
    `*[_type == "proyecto" && slug.current == $slug][0] {
      _id, title, slug, category, year, location,
      description, area, duration, materials,
      images, featured
    }`,
    { slug }
  );
}

export async function getProyectoSlugs(): Promise<{ slug: { current: string } }[]> {
  return getClient().fetch(
    `*[_type == "proyecto"] { slug }`
  );
}

// ─── Productos ───────────────────────────────────────

export interface SanityProducto {
  _id: string;
  name: string;
  slug: { current: string };
  category: string;
  price: number;
  description: string;
  dimensions: string;
  materials: string[];
  finishes: string[];
  images: SanityImage[];
  badge: string;
}

export async function getProductos(): Promise<SanityProducto[]> {
  return getClient().fetch(
    `*[_type == "producto"] | order(name asc) {
      _id, name, slug, category, price,
      description, dimensions, materials, finishes,
      images, badge
    }`
  );
}

export async function getProductoBySlug(
  slug: string
): Promise<SanityProducto | null> {
  return getClient().fetch(
    `*[_type == "producto" && slug.current == $slug][0] {
      _id, name, slug, category, price,
      description, dimensions, materials, finishes,
      images, badge
    }`,
    { slug }
  );
}

export async function getProductoSlugs(): Promise<{ slug: { current: string } }[]> {
  return getClient().fetch(
    `*[_type == "producto"] { slug }`
  );
}
