export interface Producto {
  slug: string;
  name: string;
  category: "Muebles" | "Cojines & Textiles" | "Adornos" | "Iluminación" | "Alfombras" | "Acabados";
  price: number;
  description: string;
  dimensions: string;
  materials: string[];
  finishes: string[];
  images: string[];
  badge?: "Nuevo" | "Disponible";
}

export const PRODUCTOS: Producto[] = [
  {
    slug: "mesa-centro-encino",
    name: "Mesa de Centro Encino",
    category: "Muebles",
    price: 12800,
    description:
      "Mesa de centro con base cilíndrica en madera de encino natural y cubierta circular. Acabado mate que resalta las vetas de la madera. Pieza ideal para salas con estética contemporánea y cálida.",
    dimensions: "90 cm diámetro × 40 cm alto",
    materials: ["Encino natural"],
    finishes: ["Natural mate", "Encino blanqueado"],
    images: [
      "/images/showroom/sala-recibidor.png",
      "/images/showroom/sala-detalle.png",
    ],
    badge: "Nuevo",
  },
  {
    slug: "sillon-curvo-lino",
    name: "Sillón Curvo Lino",
    category: "Muebles",
    price: 28500,
    description:
      "Sillón de líneas orgánicas tapizado en lino natural. Estructura interna de madera con espuma de alta densidad. Diseño que invita al descanso con una silueta escultórica.",
    dimensions: "180 × 85 × 75 cm",
    materials: ["Lino natural", "Madera de pino", "Espuma HD"],
    finishes: ["Lino crudo", "Lino arena"],
    images: [
      "/images/showroom/sala-detalle.png",
      "/images/showroom/sala-recibidor.png",
    ],
    badge: "Disponible",
  },
  {
    slug: "cojin-terracota",
    name: "Cojín Terracota",
    category: "Cojines & Textiles",
    price: 1200,
    description:
      "Cojín decorativo en tela de algodón con teñido artesanal en tono terracota. Relleno de fibra siliconada. Combina perfectamente con paletas neutras para agregar un punto cálido de color.",
    dimensions: "50 × 50 cm",
    materials: ["Algodón 100%", "Fibra siliconada"],
    finishes: ["Terracota", "Óxido"],
    images: [
      "/images/showroom/sala-detalle.png",
    ],
  },
  {
    slug: "manta-tejida-crema",
    name: "Manta Tejida Crema",
    category: "Cojines & Textiles",
    price: 2400,
    description:
      "Manta de tejido artesanal en algodón orgánico, tono crema con textura waffle. Perfecta para dar calidez visual y táctil a sillones y camas.",
    dimensions: "130 × 180 cm",
    materials: ["Algodón orgánico"],
    finishes: ["Crema", "Arena"],
    images: [
      "/images/showroom/sala-recibidor.png",
    ],
    badge: "Nuevo",
  },
  {
    slug: "jarron-ceramica-negro",
    name: "Jarrón Cerámica Negro",
    category: "Adornos",
    price: 1850,
    description:
      "Jarrón de cerámica artesanal con acabado mate en negro carbón. Forma orgánica asimétrica que aporta presencia escultórica a cualquier repisa o mesa.",
    dimensions: "25 cm diámetro × 35 cm alto",
    materials: ["Cerámica artesanal"],
    finishes: ["Negro mate", "Grafito"],
    images: [
      "/images/showroom/render-sketch-2.png",
    ],
  },
  {
    slug: "lampara-arco-dorada",
    name: "Lámpara Arco Dorada",
    category: "Iluminación",
    price: 8900,
    description:
      "Lámpara de piso con brazo curvo en acero con acabado dorado cepillado. Base de mármol travertino. Pantalla esférica de vidrio opal que genera una luz cálida y envolvente.",
    dimensions: "45 × 45 × 180 cm",
    materials: ["Acero", "Mármol travertino", "Vidrio opal"],
    finishes: ["Dorado cepillado", "Negro mate"],
    images: [
      "/images/showroom/showroom-led.png",
    ],
    badge: "Disponible",
  },
  {
    slug: "lampara-colgante-lineal",
    name: "Lámpara Colgante Lineal",
    category: "Iluminación",
    price: 6500,
    description:
      "Luminaria suspendida de línea minimalista en aluminio con LED integrado. Luz cálida regulable, ideal para mesas de trabajo y comedores.",
    dimensions: "120 × 5 × 8 cm",
    materials: ["Aluminio anodizado", "LED integrado"],
    finishes: ["Negro", "Champagne"],
    images: [
      "/images/showroom/showroom-main.png",
    ],
  },
  {
    slug: "tapete-artesanal-yute",
    name: "Tapete Artesanal Yute",
    category: "Alfombras",
    price: 5600,
    description:
      "Tapete tejido a mano en yute natural con borde de algodón. Textura orgánica que aporta calidez y delimita espacios de manera elegante.",
    dimensions: "200 × 300 cm",
    materials: ["Yute natural", "Algodón"],
    finishes: ["Natural", "Natural con borde blanco"],
    images: [
      "/images/showroom/sala-recibidor.png",
    ],
  },
  {
    slug: "muestra-silestone-blanco",
    name: "Muestra Silestone Blanco",
    category: "Acabados",
    price: 450,
    description:
      "Muestra de cubierta Silestone en tono blanco calacatta. Material de alta resistencia ideal para cocinas, baños y superficies de trabajo.",
    dimensions: "15 × 15 cm (muestra)",
    materials: ["Silestone (cuarzo compactado)"],
    finishes: ["Calacatta", "Statuario", "Nieve"],
    images: [
      "/images/showroom/render-sketch-1.png",
    ],
  },
  {
    slug: "muestra-encino-natural",
    name: "Muestra Encino Natural",
    category: "Acabados",
    price: 350,
    description:
      "Muestra de madera de encino con acabado natural sellado. Referencia para mobiliario y revestimientos. Incluye variantes de tono.",
    dimensions: "20 × 10 cm (muestra)",
    materials: ["Encino natural"],
    finishes: ["Natural", "Blanqueado", "Ahumado"],
    images: [
      "/images/showroom/render-sketch-1.png",
    ],
  },
];

export function getProductoBySlug(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.slug === slug);
}

export function getProductCategories(): string[] {
  return ["Todos", ...new Set(PRODUCTOS.map((p) => p.category))];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
}
