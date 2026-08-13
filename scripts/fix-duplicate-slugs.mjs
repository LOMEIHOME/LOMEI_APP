/**
 * Corrige 4 slugs duplicados en Sanity asignando sufijo "-b" al segundo producto de cada par.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const fixes = [
  { _id: "v2QPAS0EbzGFgyFjtUlynW", name: "Ramillete Delphinium Blanca 82cm", newSlug: "cr170004-b" },
  { _id: "lam0QrU1I74uWM1Y3ilT1U", name: "Set de Sujetalibros Decorativos de Metal II", newSlug: "cr040270-b" },
  { _id: "v2QPAS0EbzGFgyFjtUlzlU", name: "Eucalyptus Grass 34cm", newSlug: "cr170011-b" },
  { _id: "v2QPAS0EbzGFgyFjtUlzJo", name: "Ramillete Leaves Branch Crema 65cm", newSlug: "cr170015-b" },
];

for (const fix of fixes) {
  try {
    await client.patch(fix._id).set({ slug: { _type: "slug", current: fix.newSlug } }).commit();
    console.log(`✅ ${fix.newSlug} — ${fix.name}`);
  } catch (err) {
    console.error(`❌ ${fix._id}: ${err.message}`);
  }
}

console.log("\n✨ Slugs duplicados corregidos.");
