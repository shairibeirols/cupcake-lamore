import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);

const productsData = [
  {
    name: "Cupcake de Morango",
    slug: "cupcake-morango",
    description: "Delicioso cupcake com cobertura de morango fresco e chantilly",
    price: 1200, // R$ 12,00
    categoryId: 2, // Frutas
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500",
    active: true,
  },
  {
    name: "Cupcake de Chocolate Belga",
    slug: "cupcake-chocolate-belga",
    description: "Massa de chocolate com cobertura cremosa de chocolate belga",
    price: 1400, // R$ 14,00
    categoryId: 3, // Chocolate
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500",
    active: true,
  },
  {
    name: "Cupcake de Baunilha",
    slug: "cupcake-baunilha",
    description: "Clássico cupcake de baunilha com buttercream suave",
    price: 1000, // R$ 10,00
    categoryId: 1, // Clássicos
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500",
    active: true,
  },
  {
    name: "Cupcake de Limão Siciliano",
    slug: "cupcake-limao",
    description: "Refrescante cupcake de limão com cobertura cítrica",
    price: 1100, // R$ 11,00
    categoryId: 2, // Frutas
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?w=500",
    active: true,
  },
  {
    name: "Cupcake Red Velvet",
    slug: "cupcake-red-velvet",
    description: "Famoso red velvet com cream cheese frosting",
    price: 1500, // R$ 15,00
    categoryId: 4, // Especiais
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1599785209796-786432b228bc?w=500",
    active: true,
  },
  {
    name: "Cupcake de Cenoura",
    slug: "cupcake-cenoura",
    description: "Cupcake de cenoura com cobertura de cream cheese",
    price: 1100, // R$ 11,00
    categoryId: 1, // Clássicos
    stock: 55,
    imageUrl: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=500",
    active: true,
  },
  {
    name: "Cupcake de Chocolate Mint",
    slug: "cupcake-chocolate-mint",
    description: "Chocolate com toque refrescante de menta",
    price: 1300, // R$ 13,00
    categoryId: 3, // Chocolate
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1426869884541-df7117556757?w=500",
    active: true,
  },
  {
    name: "Cupcake Vegano de Banana",
    slug: "cupcake-vegano-banana",
    description: "100% vegano com banana e cobertura de chocolate",
    price: 1400, // R$ 14,00
    categoryId: 5, // Veganos
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=500",
    active: true,
  },
];

async function seed() {
  console.log("🌱 Inserindo produtos...");
  
  for (const product of productsData) {
    await db.insert(products).values(product);
    console.log(`✓ ${product.name}`);
  }
  
  console.log("✅ Seed de produtos concluído!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
