import { drizzle } from "drizzle-orm/mysql2";
import { categories } from "./drizzle/schema";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

const categoriesData = [
  { name: "Clássicos", slug: "classicos", description: "Sabores tradicionais e atemporais" },
  { name: "Frutas", slug: "frutas", description: "Cupcakes com sabores de frutas frescas" },
  { name: "Chocolate", slug: "chocolate", description: "Para os amantes de chocolate" },
  { name: "Especiais", slug: "especiais", description: "Sabores únicos e exclusivos" },
  { name: "Veganos", slug: "veganos", description: "Opções 100% veganas" },
];

async function seed() {
  console.log("🌱 Inserindo categorias...");
  
  for (const cat of categoriesData) {
    await db.insert(categories).values(cat).onDuplicateKeyUpdate({ set: { name: cat.name } });
    console.log(`✓ ${cat.name}`);
  }
  
  console.log("✅ Seed concluído!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
