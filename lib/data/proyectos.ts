export interface Proyecto {
  slug: string;
  title: string;
  category: "Obra" | "Diseño";
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
    slug: "paseo-de-claustros",
    title: "Paseo de Claustros",
    category: "Obra",
    year: "2026",
    location: "Campanario, Querétaro",
    description:
      "Proyecto residencial integral con diseño de sala, comedor, cocina y áreas comunes. Espacios de doble altura con iluminación colgante, escalera con barandal metálico y acabados en madera natural que generan una atmósfera cálida y contemporánea.",
    area: "180 m²",
    duration: "5 meses",
    materials: ["Encino natural", "Acero negro", "Porcelánico", "Mármol"],
    images: Array.from({ length: 10 }, (_, i) => `/images/proyectos/paseo-de-claustros/${String(i + 1).padStart(2, "0")}.jpg`),
    featured: true,
  },
  {
    slug: "sophia-distrito",
    title: "Sophia Distrito",
    category: "Obra",
    year: "2026",
    location: "Querétaro, México",
    description:
      "Diseño interior de departamento con vista panorámica a la ciudad. Concepto que integra sala, comedor y recámara en un espacio abierto con divisiones en madera ranurada, mobiliario contemporáneo y una paleta de tonos neutros con acentos en madera.",
    area: "95 m²",
    duration: "3 meses",
    materials: ["Madera ranurada", "Porcelánico", "Acero negro", "Textiles naturales"],
    images: Array.from({ length: 5 }, (_, i) => `/images/proyectos/sophia-distrito/${String(i + 1).padStart(2, "0")}.jpg`),
    featured: true,
  },
  {
    slug: "atria-distrito",
    title: "Proyecto Ejecutivo Atria Distrito",
    category: "Obra",
    year: "2026",
    location: "Querétaro, México",
    description:
      "Proyecto ejecutivo de edificio de usos mixtos con renders de fachada en diferentes momentos del día. Diseño arquitectónico que combina vidrio, acero y concreto con vegetación integrada, creando un edificio que dialoga con su entorno urbano.",
    area: "2,400 m²",
    duration: "12 meses",
    materials: ["Vidrio templado", "Acero estructural", "Concreto aparente", "Vegetación"],
    images: Array.from({ length: 10 }, (_, i) => `/images/proyectos/atria-distrito/${String(i + 1).padStart(2, "0")}.jpg`),
    featured: true,
  },
  {
    slug: "oficina-ave-fenix",
    title: "Oficina Ave Fénix",
    category: "Obra",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de oficina corporativa con enfoque en productividad y bienestar. Espacios abiertos de trabajo, sala de juntas y áreas de descanso con acabados en madera y una paleta profesional pero cálida.",
    area: "120 m²",
    duration: "3 meses",
    materials: ["Madera de encino", "Alfombra modular", "Vidrio", "Acero"],
    images: Array.from({ length: 6 }, (_, i) => `/images/proyectos/oficina-ave-fenix/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "cocina-alturia-zibata",
    title: "Cocina Alturia Zibatá",
    category: "Diseño",
    year: "2025",
    location: "El Marqués, Querétaro",
    description:
      "Diseño de cocina integral con isla central, acabados en tonos oscuros y detalles en madera. Iluminación empotrada y materiales de alta gama que combinan funcionalidad con estética refinada.",
    area: "28 m²",
    duration: "6 semanas",
    materials: ["Cuarzo", "Madera de nogal", "Acero inoxidable", "Porcelánico"],
    images: Array.from({ length: 5 }, (_, i) => `/images/proyectos/cocina-alturia-zibata/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "ceja-de-bravo",
    title: "Ceja de Bravo",
    category: "Diseño",
    year: "2025",
    location: "Corregidora, Querétaro",
    description:
      "Proyecto de interiorismo para cocina y áreas comunes. Diseño basado en mood board con paleta de materiales naturales, texturas en madera y piedra, iluminación cálida y mobiliario a medida.",
    area: "45 m²",
    duration: "2 meses",
    materials: ["Encino", "Granito", "Latón", "Textiles"],
    images: Array.from({ length: 5 }, (_, i) => `/images/proyectos/ceja-de-bravo/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "puerta-coyoacan",
    title: "Puerta Coyoacán",
    category: "Obra",
    year: "2025",
    location: "Ciudad de México",
    description:
      "Diseño residencial en la Ciudad de México con concepto contemporáneo. Espacios luminosos con doble altura, materiales nobles y una paleta que combina tonos claros con acentos en madera oscura.",
    area: "150 m²",
    duration: "4 meses",
    materials: ["Mármol", "Madera de tzalam", "Vidrio", "Acero negro"],
    images: Array.from({ length: 4 }, (_, i) => `/images/proyectos/puerta-coyoacan/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "roof-mirador-campanario",
    title: "Roof Mirador del Campanario",
    category: "Obra",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de terraza roof garden con vista panorámica. Concepto de espacio exterior con sala lounge, área de asador y jardín vertical, utilizando materiales resistentes a la intemperie con estética de lujo.",
    area: "60 m²",
    duration: "2 meses",
    materials: ["Deck de madera", "Acero corten", "Piedra natural", "Vegetación"],
    images: Array.from({ length: 4 }, (_, i) => `/images/proyectos/roof-mirador-campanario/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "terraza-campo-real",
    title: "Terraza Campo Real Refugio",
    category: "Obra",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de terraza exterior con concepto de refugio natural. Pérgola con vegetación, área de estar con mobiliario de exterior y acabados que integran el espacio con el paisaje circundante.",
    area: "45 m²",
    duration: "6 semanas",
    materials: ["Madera tratada", "Piedra laja", "Acero", "Plantas nativas"],
    images: Array.from({ length: 5 }, (_, i) => `/images/proyectos/terraza-campo-real/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "recamara-bebe-villas",
    title: "Recámara Bebé Villas del Refugio",
    category: "Diseño",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de recámara infantil con paleta suave y mobiliario funcional. Un espacio pensado para crecer con el niño, utilizando materiales seguros y una estética que combina ternura con diseño contemporáneo.",
    area: "18 m²",
    duration: "4 semanas",
    materials: ["Madera de pino", "Textiles orgánicos", "Pintura ecológica", "MDF"],
    images: Array.from({ length: 4 }, (_, i) => `/images/proyectos/recamara-bebe-villas/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "canadas-del-lago",
    title: "Cañadas del Lago",
    category: "Obra",
    year: "2024",
    location: "Querétaro, México",
    description:
      "Proyecto residencial con diseño de interiores completo. Espacios amplios con acabados premium, iluminación diseñada y mobiliario seleccionado para crear un hogar sofisticado y acogedor.",
    area: "200 m²",
    duration: "6 meses",
    materials: ["Encino", "Mármol", "Acero negro", "Vidrio"],
    images: Array.from({ length: 3 }, (_, i) => `/images/proyectos/canadas-del-lago/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "valle-de-las-flores",
    title: "Valle de las Flores",
    category: "Obra",
    year: "2024",
    location: "Pachuca, Hidalgo",
    description:
      "Diseño residencial integral en Pachuca. Concepto que aprovecha la luz natural con grandes ventanales, paleta de colores tierra y materiales locales que generan calidez y pertenencia.",
    area: "160 m²",
    duration: "5 meses",
    materials: ["Cantera", "Madera de parota", "Barro", "Acero"],
    images: Array.from({ length: 5 }, (_, i) => `/images/proyectos/valle-de-las-flores/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "casa-gema",
    title: "Casa Gema",
    category: "Obra",
    year: "2024",
    location: "Pachuca, Hidalgo",
    description:
      "Proyecto residencial con diseño interior enfocado en funcionalidad y estilo. Espacios que combinan lo moderno con lo acogedor, utilizando una paleta neutra con acentos de color estratégicos.",
    area: "130 m²",
    duration: "4 meses",
    materials: ["Madera", "Cuarzo", "Porcelánico", "Acero"],
    images: Array.from({ length: 2 }, (_, i) => `/images/proyectos/casa-gema/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "teresitas",
    title: "Teresitas",
    category: "Obra",
    year: "2024",
    location: "Campanario, Querétaro",
    description:
      "Diseño de interiores para residencia en zona Campanario. Ambientes que equilibran lujo y confort con materiales naturales y una iluminación cuidadosamente planeada.",
    area: "175 m²",
    duration: "4 meses",
    materials: ["Encino", "Mármol travertino", "Latón", "Lino"],
    images: Array.from({ length: 2 }, (_, i) => `/images/proyectos/teresitas/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "vestidor-pachuquilla",
    title: "Vestidor Glam Pachuquilla",
    category: "Diseño",
    year: "2024",
    location: "Pachuquilla, Hidalgo",
    description:
      "Diseño de vestidor tipo walk-in con estética glam. Iluminación LED integrada, espejos de cuerpo completo, isla central y acabados en tonos neutros con detalles dorados.",
    area: "15 m²",
    duration: "3 semanas",
    materials: ["MDF laqueado", "Espejo", "LED", "Latón"],
    images: Array.from({ length: 3 }, (_, i) => `/images/proyectos/vestidor-pachuquilla/${String(i + 1).padStart(2, "0")}.jpg`),
  },
  {
    slug: "san-juan-del-rio",
    title: "San Juan del Río — Cuarto de Lavado",
    category: "Diseño",
    year: "2024",
    location: "San Juan del Río, Querétaro",
    description:
      "Diseño funcional de cuarto de lavado con almacenamiento optimizado. Un espacio que demuestra que las áreas de servicio también merecen un diseño cuidado y estético.",
    area: "8 m²",
    duration: "2 semanas",
    materials: ["Melamina", "Cuarzo", "Azulejo", "Acero inoxidable"],
    images: Array.from({ length: 3 }, (_, i) => `/images/proyectos/san-juan-del-rio/${String(i + 1).padStart(2, "0")}.jpg`),
  },
];

export function getProyectoBySlug(slug: string): Proyecto | undefined {
  return PROYECTOS.find((p) => p.slug === slug);
}

export function getCategories(): string[] {
  return ["Todos", ...new Set(PROYECTOS.map((p) => p.category))];
}
