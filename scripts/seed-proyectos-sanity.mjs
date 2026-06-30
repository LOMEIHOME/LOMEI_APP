/**
 * Seed Sanity con los 16 proyectos y sus imágenes locales.
 *
 * Uso:
 *   node scripts/seed-proyectos-sanity.mjs
 *
 * Requiere:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local
 *   SANITY_WRITE_TOKEN (desde sanity.io/manage → API → Tokens → Add token con Editor role)
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!PROJECT_ID || !TOKEN) {
  console.error(
    "Faltan variables: NEXT_PUBLIC_SANITY_PROJECT_ID y SANITY_WRITE_TOKEN"
  );
  console.error(
    "Crea un token en https://www.sanity.io/manage → tu proyecto → API → Tokens"
  );
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

const PUBLIC_DIR = resolve("public");

// Los 16 proyectos (mismos datos que lib/data/proyectos.ts)
const PROYECTOS = [
  {
    slug: "paseo-de-claustros",
    title: "Paseo de Claustros",
    category: "Residencial",
    year: "2026",
    location: "Campanario, Querétaro",
    description:
      "Proyecto residencial integral con diseño de sala, comedor, cocina y áreas comunes. Espacios de doble altura con iluminación colgante, escalera con barandal metálico y acabados en madera natural que generan una atmósfera cálida y contemporánea.",
    area: "180 m²",
    duration: "5 meses",
    materials: ["Encino natural", "Acero negro", "Porcelánico", "Mármol"],
    imageCount: 10,
    featured: true,
  },
  {
    slug: "sophia-distrito",
    title: "Sophia Distrito",
    category: "Residencial",
    year: "2026",
    location: "Querétaro, México",
    description:
      "Diseño interior de departamento con vista panorámica a la ciudad. Concepto que integra sala, comedor y recámara en un espacio abierto con divisiones en madera ranurada, mobiliario contemporáneo y una paleta de tonos neutros con acentos en madera.",
    area: "95 m²",
    duration: "3 meses",
    materials: ["Madera ranurada", "Porcelánico", "Acero negro", "Textiles naturales"],
    imageCount: 5,
    featured: true,
  },
  {
    slug: "atria-distrito",
    title: "Proyecto Ejecutivo Atria Distrito",
    category: "Comercial",
    year: "2026",
    location: "Querétaro, México",
    description:
      "Proyecto ejecutivo de edificio de usos mixtos con renders de fachada en diferentes momentos del día. Diseño arquitectónico que combina vidrio, acero y concreto con vegetación integrada.",
    area: "2,400 m²",
    duration: "12 meses",
    materials: ["Vidrio templado", "Acero estructural", "Concreto aparente", "Vegetación"],
    imageCount: 10,
    featured: true,
  },
  {
    slug: "oficina-ave-fenix",
    title: "Oficina Ave Fénix",
    category: "Comercial",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de oficina corporativa con enfoque en productividad y bienestar. Espacios abiertos de trabajo, sala de juntas y áreas de descanso con acabados en madera y una paleta profesional pero cálida.",
    area: "120 m²",
    duration: "3 meses",
    materials: ["Madera de encino", "Alfombra modular", "Vidrio", "Acero"],
    imageCount: 6,
    featured: false,
  },
  {
    slug: "cocina-alturia-zibata",
    title: "Cocina Alturia Zibatá",
    category: "Interiorismo",
    year: "2025",
    location: "El Marqués, Querétaro",
    description:
      "Diseño de cocina integral con isla central, acabados en tonos oscuros y detalles en madera. Iluminación empotrada y materiales de alta gama que combinan funcionalidad con estética refinada.",
    area: "28 m²",
    duration: "6 semanas",
    materials: ["Cuarzo", "Madera de nogal", "Acero inoxidable", "Porcelánico"],
    imageCount: 5,
    featured: false,
  },
  {
    slug: "ceja-de-bravo",
    title: "Ceja de Bravo",
    category: "Interiorismo",
    year: "2025",
    location: "Corregidora, Querétaro",
    description:
      "Proyecto de interiorismo para cocina y áreas comunes. Diseño basado en mood board con paleta de materiales naturales, texturas en madera y piedra, iluminación cálida y mobiliario a medida.",
    area: "45 m²",
    duration: "2 meses",
    materials: ["Encino", "Granito", "Latón", "Textiles"],
    imageCount: 5,
    featured: false,
  },
  {
    slug: "puerta-coyoacan",
    title: "Puerta Coyoacán",
    category: "Residencial",
    year: "2025",
    location: "Ciudad de México",
    description:
      "Diseño residencial en la Ciudad de México con concepto contemporáneo. Espacios luminosos con doble altura, materiales nobles y una paleta que combina tonos claros con acentos en madera oscura.",
    area: "150 m²",
    duration: "4 meses",
    materials: ["Mármol", "Madera de tzalam", "Vidrio", "Acero negro"],
    imageCount: 4,
    featured: false,
  },
  {
    slug: "roof-mirador-campanario",
    title: "Roof Mirador del Campanario",
    category: "Residencial",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de terraza roof garden con vista panorámica. Concepto de espacio exterior con sala lounge, área de asador y jardín vertical.",
    area: "60 m²",
    duration: "2 meses",
    materials: ["Deck de madera", "Acero corten", "Piedra natural", "Vegetación"],
    imageCount: 4,
    featured: false,
  },
  {
    slug: "terraza-campo-real",
    title: "Terraza Campo Real Refugio",
    category: "Residencial",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de terraza exterior con concepto de refugio natural. Pérgola con vegetación, área de estar con mobiliario de exterior y acabados que integran el espacio con el paisaje.",
    area: "45 m²",
    duration: "6 semanas",
    materials: ["Madera tratada", "Piedra laja", "Acero", "Plantas nativas"],
    imageCount: 5,
    featured: false,
  },
  {
    slug: "recamara-bebe-villas",
    title: "Recámara Bebé Villas del Refugio",
    category: "Interiorismo",
    year: "2025",
    location: "Querétaro, México",
    description:
      "Diseño de recámara infantil con paleta suave y mobiliario funcional. Un espacio pensado para crecer con el niño, utilizando materiales seguros y una estética contemporánea.",
    area: "18 m²",
    duration: "4 semanas",
    materials: ["Madera de pino", "Textiles orgánicos", "Pintura ecológica", "MDF"],
    imageCount: 4,
    featured: false,
  },
  {
    slug: "canadas-del-lago",
    title: "Cañadas del Lago",
    category: "Residencial",
    year: "2024",
    location: "Querétaro, México",
    description:
      "Proyecto residencial con diseño de interiores completo. Espacios amplios con acabados premium, iluminación diseñada y mobiliario seleccionado.",
    area: "200 m²",
    duration: "6 meses",
    materials: ["Encino", "Mármol", "Acero negro", "Vidrio"],
    imageCount: 3,
    featured: false,
  },
  {
    slug: "valle-de-las-flores",
    title: "Valle de las Flores",
    category: "Residencial",
    year: "2024",
    location: "Pachuca, Hidalgo",
    description:
      "Diseño residencial integral en Pachuca. Concepto que aprovecha la luz natural con grandes ventanales, paleta de colores tierra y materiales locales.",
    area: "160 m²",
    duration: "5 meses",
    materials: ["Cantera", "Madera de parota", "Barro", "Acero"],
    imageCount: 5,
    featured: false,
  },
  {
    slug: "casa-gema",
    title: "Casa Gema",
    category: "Residencial",
    year: "2024",
    location: "Pachuca, Hidalgo",
    description:
      "Proyecto residencial con diseño interior enfocado en funcionalidad y estilo. Espacios que combinan lo moderno con lo acogedor.",
    area: "130 m²",
    duration: "4 meses",
    materials: ["Madera", "Cuarzo", "Porcelánico", "Acero"],
    imageCount: 2,
    featured: false,
  },
  {
    slug: "teresitas",
    title: "Teresitas",
    category: "Residencial",
    year: "2024",
    location: "Campanario, Querétaro",
    description:
      "Diseño de interiores para residencia en zona Campanario. Ambientes que equilibran lujo y confort con materiales naturales y una iluminación cuidadosamente planeada.",
    area: "175 m²",
    duration: "4 meses",
    materials: ["Encino", "Mármol travertino", "Latón", "Lino"],
    imageCount: 2,
    featured: false,
  },
  {
    slug: "vestidor-pachuquilla",
    title: "Vestidor Glam Pachuquilla",
    category: "Interiorismo",
    year: "2024",
    location: "Pachuquilla, Hidalgo",
    description:
      "Diseño de vestidor tipo walk-in con estética glam. Iluminación LED integrada, espejos de cuerpo completo, isla central y acabados en tonos neutros con detalles dorados.",
    area: "15 m²",
    duration: "3 semanas",
    materials: ["MDF laqueado", "Espejo", "LED", "Latón"],
    imageCount: 3,
    featured: false,
  },
  {
    slug: "san-juan-del-rio",
    title: "San Juan del Río — Cuarto de Lavado",
    category: "Interiorismo",
    year: "2024",
    location: "San Juan del Río, Querétaro",
    description:
      "Diseño funcional de cuarto de lavado con almacenamiento optimizado. Un espacio que demuestra que las áreas de servicio también merecen un diseño cuidado y estético.",
    area: "8 m²",
    duration: "2 semanas",
    materials: ["Melamina", "Cuarzo", "Azulejo", "Acero inoxidable"],
    imageCount: 3,
    featured: false,
  },
];

async function uploadImage(filePath) {
  const absolutePath = join(PUBLIC_DIR, filePath);
  if (!existsSync(absolutePath)) {
    console.warn(`  ⚠ Imagen no encontrada: ${absolutePath}`);
    return null;
  }
  const buffer = readFileSync(absolutePath);
  const filename = filePath.split("/").pop();
  const asset = await client.assets.upload("image", buffer, { filename });
  return {
    _type: "image",
    _key: Math.random().toString(36).slice(2, 10),
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function main() {
  console.log(`Subiendo ${PROYECTOS.length} proyectos a Sanity...\n`);

  for (const p of PROYECTOS) {
    // Verificar si ya existe
    const existing = await client.fetch(
      `*[_type == "proyecto" && slug.current == $slug][0]._id`,
      { slug: p.slug }
    );

    if (existing) {
      console.log(`⏭ ${p.title} — ya existe, saltando`);
      continue;
    }

    // Subir imágenes
    console.log(`📸 ${p.title} — subiendo ${p.imageCount} imágenes...`);
    const images = [];
    for (let i = 1; i <= p.imageCount; i++) {
      const imgPath = `/images/proyectos/${p.slug}/${String(i).padStart(2, "0")}.jpg`;
      const img = await uploadImage(imgPath);
      if (img) {
        images.push(img);
        process.stdout.write(`  ✓ ${i}/${p.imageCount}\r`);
      }
    }
    console.log();

    // Crear documento
    const doc = {
      _type: "proyecto",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: p.category,
      year: p.year,
      location: p.location,
      description: p.description,
      area: p.area,
      duration: p.duration,
      materials: p.materials,
      images,
      featured: p.featured,
    };

    await client.create(doc);
    console.log(`✅ ${p.title} — creado con ${images.length} imágenes`);
  }

  console.log("\n🎉 Seed de proyectos completado");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
