export interface Proyecto {
  slug: string;
  title: string;
  category: "Residencial" | "Comercial" | "Interiorismo";
  year: string;
  location: string;
  description: string;
  area: string;
  duration: string;
  materials: string[];
  images: string[];
  featured?: boolean;
}

export const PROYECTOS: Proyecto[] = [
  {
    slug: "showroom-lomei",
    title: "Showroom LOMEI Home",
    category: "Comercial",
    year: "2026",
    location: "Querétaro, México",
    description:
      "Proyecto de adecuación de local comercial para showroom de interiorismo. El espacio integra una mesa de trabajo para asesorías, mueble repisero para exhibición de muestras de telas, piedras y acabados, coffee station y set recibidor que evoca la calidez de un hogar. Los materiales principales incluyen madera de encino natural, cubiertas de Silestone, acabado nanocal en muros y loseta porcelánica tipo concreto.",
    area: "85 m²",
    duration: "3 meses",
    materials: ["Encino natural", "Silestone", "Nanocal", "Porcelánico"],
    images: [
      "/images/showroom/showroom-main.png",
      "/images/showroom/showroom-led.png",
      "/images/showroom/fachada.png",
      "/images/showroom/render-sketch-1.png",
      "/images/showroom/render-sketch-2.png",
    ],
    featured: true,
  },
  {
    slug: "sala-recibidor-qro",
    title: "Sala Recibidor Querétaro",
    category: "Interiorismo",
    year: "2026",
    location: "Querétaro, México",
    description:
      "Diseño interior de sala de estar con enfoque en confort y estética contemporánea. El proyecto incluye selección de mobiliario, tapicería en tonos neutros con acentos cálidos, iluminación ambiental y una paleta de materiales naturales que transmiten serenidad.",
    area: "42 m²",
    duration: "6 semanas",
    materials: ["Lino", "Madera de roble", "Mármol travertino", "Acero negro"],
    images: [
      "/images/showroom/sala-recibidor.png",
      "/images/showroom/sala-detalle.png",
    ],
    featured: true,
  },
  {
    slug: "departamento-juriquilla",
    title: "Departamento Juriquilla",
    category: "Residencial",
    year: "2025",
    location: "Juriquilla, Querétaro",
    description:
      "Remodelación integral de departamento en zona residencial. El concepto parte de una paleta neutra y cálida con acentos en madera y piedra natural, priorizando la luz natural y los espacios abiertos. Se diseñó mobiliario a medida para optimizar cada rincón.",
    area: "120 m²",
    duration: "4 meses",
    materials: ["Encino blanqueado", "Cuarzo", "Microcemento", "Vidrio templado"],
    images: [
      "/images/showroom/sala-recibidor.png",
      "/images/showroom/showroom-main.png",
    ],
    featured: true,
  },
  {
    slug: "consultorio-centro",
    title: "Consultorio Centro Histórico",
    category: "Comercial",
    year: "2025",
    location: "Centro, Querétaro",
    description:
      "Adecuación de espacio comercial para consultorio médico con énfasis en generar un ambiente de calma y confianza. Diseño de recepción, sala de espera y dos consultorios con acabados cálidos y mobiliario ergonómico.",
    area: "65 m²",
    duration: "2 meses",
    materials: ["Madera de pino", "Laminado", "Pintura especial", "Alfombra modular"],
    images: [
      "/images/showroom/render-sketch-2.png",
      "/images/showroom/showroom-led.png",
    ],
  },
  {
    slug: "casa-zibata",
    title: "Casa Zibatá",
    category: "Residencial",
    year: "2024",
    location: "Zibatá, Querétaro",
    description:
      "Proyecto residencial de diseño integral: arquitectura y acabados interiores. Una casa donde cada espacio dialoga con el jardín central, utilizando materiales locales y una paleta inspirada en el paisaje queretano.",
    area: "210 m²",
    duration: "8 meses",
    materials: ["Cantera", "Encino", "Barro cocido", "Acero corten"],
    images: [
      "/images/showroom/fachada.png",
      "/images/showroom/sala-detalle.png",
    ],
  },
];

export function getProyectoBySlug(slug: string): Proyecto | undefined {
  return PROYECTOS.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  return ["Todos", ...new Set(PROYECTOS.map((p) => p.category))];
}
