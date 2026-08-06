// Constantes compartidas del admin panel

export const CATEGORY_EMOJI: Record<string, string> = {
  Muebles: "🛋️",
  "Cojines & Textiles": "🧶",
  Adornos: "🏺",
  Iluminación: "💡",
  Alfombras: "🧵",
  Acabados: "🪞",
  Jarrones: "🏺",
  Capelos: "🔔",
  Relojes: "⏳",
  Florero: "🌸",
  Macetas: "🪴",
  "Plantas Artificiales": "🌿",
};

export function getCategoryEmoji(cat: string): string {
  return CATEGORY_EMOJI[cat] || "📦";
}

/** Formatea una fecha ISO a formato dd/mm/aaaa hh:mm */
export function formatFecha(iso: string, conHora = true): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  if (!conHora) return `${dd}/${mm}/${yyyy}`;
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}
